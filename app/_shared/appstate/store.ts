import { UniversityAPI } from '../api/university';
import { Assignment, Course, User } from '../model';

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
  user: User | null;
  courses: Course[];
  allAssignments: Record<string, Assignment[]>; // courseUuid -> assignments
  courseUsers: Record<string, User[]>; // courseUuid -> users
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // actions
  init(api: UniversityAPI): void;
  authenticate(): Promise<boolean>;
  fetchAllData(): Promise<void>;
  clear(): void;
}

export const useAppState: any = createFn((set: any, get: any) => ({
  api: null,
  user: null,
  courses: [],
  allAssignments: {},
  courseUsers: {},
  isInitialized: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  init(api: UniversityAPI) {
    set({ api, isInitialized: true });
  },

  async authenticate() {
    const api = get().api;
    if (!api) {
      set({ error: 'API not initialized' });
      return false;
    }
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
    const api = get().api;
    if (!api) {
      set({ error: 'API not initialized' });
      return;
    }
    try {
      set({ isLoading: true, error: null });

      const courses = await api.getCourses();

      const assignmentsPromises = courses.map(async (course: Course) => ({
        courseUuid: course.uuid,
        assignments: await api.getAssignments(course),
      }));

      const usersPromises = courses.map(async (course: Course) => ({
        courseUuid: course.uuid,
        users: await api.getCourseUsers(course),
      }));

      const assignmentsResults = await Promise.all(assignmentsPromises);
      const usersResults = await Promise.all(usersPromises);

      const allAssignments: Record<string, Assignment[]> = {};
      assignmentsResults.forEach((r) => {
        allAssignments[r.courseUuid] = r.assignments;
      });

      const courseUsers: Record<string, User[]> = {};
      usersResults.forEach((r) => {
        courseUsers[r.courseUuid] = r.users;
      });

      set({ courses, allAssignments, courseUsers, isLoading: false });
    } catch (err: any) {
      set({ error: err?.message ?? String(err), isLoading: false });
    }
  },

  clear() {
    set({
      api: null,
      user: null,
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



