import { create } from 'zustand';
import { UniversityAPI, MockUniversityAPI } from '../api/university';
import { DatabaseAPI, MockDatabaseAPI } from '../api/database';
import { Assignment, Course, Store, StoreItem, StoreVendor, User } from '../model';

export interface AppStateStore {
  api: UniversityAPI | null;
  db: DatabaseAPI | null;
  user: User | null;
  userPoints: number;
  store: Store | null;
  courses: Course[];
  allAssignments: Record<string, Assignment[]>; // courseUuid -> assignments
  courseUsers: Record<string, User[]>; // courseUuid -> users
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // actions
  init(): void;
  authenticate(): Promise<boolean>;
  fetchAllData(): Promise<void>;
  getClaimedItems(): { item: StoreItem; claimedAt: Date }[];
  claimItem(itemUuid: string): Promise<void>;
  clear(): void;
}

export const useAppState: any = create((set: any, get: any) => ({
  api: null,
  db: null,
  user: null,
  userPoints: 0,
  store: null,
  courses: [],
  allAssignments: {},
  courseUsers: {},
  isInitialized: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  init() {
    // create mock implementations by default
    const api = new MockUniversityAPI();
    const db = new MockDatabaseAPI();
    set({ api, db, isInitialized: true });
  },

  async authenticate() {
    if (!get().api) {
      // lazy init
      get().init();
    }
    const api = get().api;
    try {
      set({ isLoading: true, error: null });
      const user = await api.authenticate();
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err?.message ?? String(err), isLoading: false });
      return false;
    }
  },

  async fetchAllData() {
    if (!get().api) {
      // lazy init
      get().init();
    }

    const api = get().api;
    const db = get().db;
    let user = get().user;

    if (!user) {
      // try to authenticate if not already
      const ok = await get().authenticate();
      if (!ok) {
        set({ error: 'User not authenticated' });
        return;
      }
      user = get().user;
    }

    try {
      set({ isLoading: true, error: null });

      const courses = await api.getCourses();

      const assignmentsResults = await Promise.all(
        courses.map(async (course: Course) => ({
          courseUuid: course.uuid,
          assignments: await api.getAssignments(course),
        })),
      );

      const usersResults = await Promise.all(
        courses.map(async (course: Course) => ({
          courseUuid: course.uuid,
          users: await api.getCourseUsers(course),
        })),
      );

      const allAssignments: Record<string, Assignment[]> = {};
      const courseUsers: Record<string, User[]> = {};

      // Process each course: enrich assignments with DB-provided pointsMax, apply grades
      for (const course of courses) {
        const ar = assignmentsResults.find((r) => r.courseUuid === course.uuid);
        const assignments = ar ? ar.assignments : [];

        // fetch assignment max points from DB if available
        if (db) {
          await Promise.all(
            assignments.map(async (assignment: Assignment) => {
              const max = await db.getAssignmentPointsMax(assignment.uuid);
              assignment.pointsMax = typeof max === 'number' ? max : assignment.pointsMax;
            }),
          );
        }

        // fetch grades (assumed to be for current user)
        const grades = await api.getGrades(course);

        // reset pointsGained
        assignments.forEach((a: Assignment) => (a.pointsGained = a.pointsGained ?? null));

        for (const grade of grades) {
          const a = assignments.find((x: Assignment) => x.uuid === grade.assignmentId);
          if (!a) continue;
          a.pointsGained = (grade.percentage() || 0) * (a.pointsMax || 0);
        }

        // calculated total points for the course (from assignments)
        const calculatedPoints = assignments.reduce((s: number, a: Assignment) => s + (a.pointsGained ?? 0), 0);

        // fetch stored points from DB
        let storedPoints = 0;
        if (db) {
          storedPoints = await db.getUserPointsInCourse(user.uuid, course.uuid);
          // update DB if differs
          if (storedPoints !== calculatedPoints) {
            await db.setUserPointsInCourse(user.uuid, course.uuid, calculatedPoints);
            storedPoints = calculatedPoints;
          }
        }

        // set course aggregated values
        course.pointsGained = calculatedPoints;
        course.pointsMax = assignments.reduce((s: number, a: Assignment) => s + (a.pointsMax || 0), 0);

        allAssignments[course.uuid] = assignments;
        const ur = usersResults.find((r) => r.courseUuid === course.uuid);
        courseUsers[course.uuid] = ur ? ur.users : [];
      }

      // fetch user-level data from DB if available
      let userPoints = 0;
      let storeObj: Store | null = null;
      if (db) {
        userPoints = await db.getUserPoints();
        const s = await db.getStore();
        if (s) {
          storeObj = s;
        }
      }

      set({ courses, allAssignments, courseUsers, userPoints, store: storeObj, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message ?? String(err), isLoading: false });
    }
  },

  getClaimedItems() {
    const store = get().store;
    if (!store) {
      return [];
    }

    const now = Date.now();
    const fifteenMinutesMs = 15 * 60 * 1000;

    return (Object.entries(store.claimedItems) as Array<[string, any]>)
      .map(([claimUuid, claimRecord]) => {
        const item = store.vendors
          .flatMap((vendor: StoreVendor) => vendor.items)
          .find((candidate: StoreItem) => candidate.uuid === claimRecord.itemUuid);

        return item ? { claimUuid, item, claimedAt: claimRecord.timestamp } : null;
      })
      .filter((entry): entry is { claimUuid: string; item: StoreItem; claimedAt: Date } => {
        if (!entry) {
          return false;
        }

        const age = now - entry.claimedAt.getTime();
        return age >= 0 && age <= fifteenMinutesMs;
      })
      .sort((a, b) => b.claimedAt.getTime() - a.claimedAt.getTime());
  },

  async claimItem(itemUuid: string) {
    if (!get().api || !get().db) {
      get().init();
    }

    if (!get().user) {
      const ok = await get().authenticate();
      if (!ok) {
        throw new Error('User not authenticated');
      }
    }

    const db = get().db;
    const user = get().user;
    const store = get().store;

    if (!db || !user || !store) {
      throw new Error('Store not loaded');
    }

    const item = store.vendors
      .flatMap((vendor: StoreVendor) => vendor.items)
      .find((candidate: StoreItem) => candidate.uuid === itemUuid);

    if (!item) {
      throw new Error(`Item not found: ${itemUuid}`);
    }

    // Check if item was claimed recently and is still in cooldown
    const claimedItems = get().getClaimedItems();
    const recentClaim = claimedItems.find((c: any) => c.item.uuid === itemUuid);
    if (recentClaim) {
      const timeSinceLastClaim = Date.now() - recentClaim.claimedAt.getTime();
      const cooldownMs = recentClaim.item.reclaimCooldown * 1000;
      if (timeSinceLastClaim < cooldownMs) {
        throw new Error(
          `Item still in reclaim cooldown. Try again in ${Math.ceil((cooldownMs - timeSinceLastClaim) / 1000)} seconds.`,
        );
      }
    }

    const timestamp = new Date();
    const claimUuid = await db.claimItem(itemUuid, user.uuid, timestamp);
    if (!claimUuid) {
      throw new Error(`Unable to claim item: ${itemUuid}`);
    }

    const nextUserPoints = Math.max(0, get().userPoints - item.pointsCost);
    const nextStore = new Store({
      uuid: store.uuid,
      vendors: store.vendors,
      claimedItems: {
        ...store.claimedItems,
        [claimUuid]: { itemUuid, timestamp },
      },
    });

    set({ userPoints: nextUserPoints, store: nextStore });
  },

  clear() {
    set({
      api: null,
      db: null,
      user: null,
      userPoints: 0,
      store: null,
      courses: [],
      allAssignments: {},
      courseUsers: {},
      isInitialized: false,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));



