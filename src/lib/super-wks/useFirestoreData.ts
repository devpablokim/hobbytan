'use client';

import { useState, useEffect } from 'react';
import {
  getActiveCohort, getTeams, getCurriculum, getSubmissions,
  getPosts, getGoals, getAllUsers, getPendingUsers,
} from './firestoreService';
import type { Cohort, Curriculum, Team, Submission, Post, Goal } from './types';
import type { FirestoreUser } from './firestoreService';

// ─── Generic hook ───
function useFirestoreQuery<T>(fetcher: () => Promise<T>, deps: unknown[] = []): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
      .then(result => { if (!cancelled) { setData(result); setError(null); } })
      .catch(err => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, ...deps]);

  return { data, loading, error, refetch: () => setTrigger(t => t + 1) };
}

// ─── Typed hooks ───

export function useCohort() {
  return useFirestoreQuery<Cohort | null>(() => getActiveCohort());
}

export function useTeams(cohortId?: string) {
  return useFirestoreQuery<Team[]>(() => getTeams(cohortId), [cohortId]);
}

export function useCurriculum(cohortId?: string) {
  return useFirestoreQuery<Curriculum[]>(() => getCurriculum(cohortId), [cohortId]);
}

export function useSubmissions(filters?: { userId?: string; teamId?: string; cohortId?: string; weekNumber?: number }) {
  return useFirestoreQuery<Submission[]>(() => getSubmissions(filters), [filters?.userId, filters?.teamId, filters?.cohortId, filters?.weekNumber]);
}

export function usePosts(filters?: { cohortId?: string; teamId?: string }) {
  return useFirestoreQuery<Post[]>(() => getPosts(filters), [filters?.cohortId, filters?.teamId]);
}

export function useGoals(filters?: { teamId?: string; cohortId?: string }) {
  return useFirestoreQuery<Goal[]>(() => getGoals(filters), [filters?.teamId, filters?.cohortId]);
}

export function useAllUsers() {
  return useFirestoreQuery<FirestoreUser[]>(() => getAllUsers());
}

export function usePendingUsersFS() {
  return useFirestoreQuery<FirestoreUser[]>(() => getPendingUsers());
}
