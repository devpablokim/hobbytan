/**
 * Adapter: converts FirebaseUser + FirestoreUser into the legacy User type
 * used by child components (DashboardPage, CurriculumPage, etc.)
 *
 * This is a bridge for FIRESTORE-001 STEP 1.
 * Components will be individually migrated to use Firestore directly in later steps.
 */
import type { User as FirebaseUser } from 'firebase/auth';
import type { FirestoreUser } from './firestoreService';
import type { User, Role } from './types';

const DEFAULT_PROGRESS = {
  week0: { status: 'not-started' as const, completedAt: null },
  week1: { status: 'not-started' as const, completedAt: null },
  week2: { status: 'not-started' as const, completedAt: null },
  week3: { status: 'not-started' as const, completedAt: null },
  week4: { status: 'not-started' as const, completedAt: null },
  week5: { status: 'not-started' as const, completedAt: null },
};

export function toAppUser(fbUser: FirebaseUser, fsUser: FirestoreUser | null): User {
  return {
    userId: fbUser.uid,
    displayName: fsUser?.nickname || fbUser.displayName || 'Unknown',
    email: fbUser.email || '',
    photoURL: fbUser.photoURL,
    role: (fsUser?.role || 'student') as Role,
    status: fsUser?.status || 'pending',
    cohortId: fsUser?.cohortId || 'cohort-1',
    teamId: fsUser?.teamId || null,
    progress: DEFAULT_PROGRESS,
    onboarded: fsUser?.onboarded || false,
    nickname: fsUser?.nickname || '',
    realName: fsUser?.realName || '',
    organization: fsUser?.organization || '',
    jobRole: fsUser?.jobRole || '',
    participationStatus: fsUser?.participationStatus,
  };
}
