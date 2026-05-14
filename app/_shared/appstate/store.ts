import { UniversityAPI, MockUniversityAPI } from '../api/university';
import { DatabaseAPI, MockDatabaseAPI } from '../api/database';
import { Assignment, Course, Store, User } from '../model';

// Resolve the zustand `create` factory robustly at runtime.
// Metro / bundlers can export the package in different shapes (function, { create }, { default }).
// Check common cases and pick the actual function; if none match, throw a clear error.
const _zustand_mod: any = require('zustand');
let createFn: any;
if (typeof _zustand_mod === 'function') {
  createFn = _zustand_mod;
} else if (_zustand_mod && typeof _zustand_mod.create === 'function') {
  createFn = _zustand_mod.create;
} else if (_zustand_mod && typeof _zustand_mod.default === 'function') {
  createFn = _zustand_mod.default;
} else {
  // Provide detailed diagnostics to help debugging in the bundler environment
  const shape = Object.keys(_zustand_mod || {}).join(', ');
  throw new Error(
    `Unable to resolve zustand create function. Module keys: [${shape}]`,
  );
}

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
  clear(): void;
}

export const useAppState: any = createFn((set: any, get: any) => ({
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
          const pts = (grade.percentage() || 0) * (a.pointsMax || 0);
          a.pointsGained = pts;
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
          // s is expected to be StoreJson
          try {
            storeObj = Store.fromJson(s);
          } catch (e) {
            storeObj = null;
          }
        }
      }

      set({ courses, allAssignments, courseUsers, userPoints, store: storeObj, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message ?? String(err), isLoading: false });
    }
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



