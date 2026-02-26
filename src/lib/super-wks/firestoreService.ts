'use client';

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Role, UserStatus, ParticipationStatus, OnboardingData } from './types';

// ─── Firestore User Document Schema ───
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  // Onboarding
  nickname: string;
  realName: string;
  organization: string;
  jobRole: string;
  participationStatus: ParticipationStatus;
  // Role & Status
  role: Role;
  status: UserStatus; // 'pending' | 'active' | 'suspended'
  onboarded: boolean;
  // Team
  teamId: string | null;
  cohortId: string;
  // Timestamps
  createdAt: unknown;
  updatedAt: unknown;
  onboardedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
}

const USERS_COL = 'swks_users';
const DEFAULT_COHORT = 'cohort-1';

// ─── User Operations ───

export async function getUserDoc(uid: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, USERS_COL, uid));
  if (!snap.exists()) return null;
  return snap.data() as FirestoreUser;
}

export async function createUserFromOnboarding(
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | null,
  data: OnboardingData
): Promise<void> {
  const userDoc: FirestoreUser = {
    uid,
    email,
    displayName,
    photoURL,
    nickname: data.nickname,
    realName: data.realName,
    organization: data.organization,
    jobRole: data.jobRole,
    participationStatus: data.participationStatus,
    role: 'student',
    status: 'pending',
    onboarded: true,
    teamId: null,
    cohortId: DEFAULT_COHORT,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    onboardedAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null,
  };
  await setDoc(doc(db, USERS_COL, uid), userDoc);
}

export async function getAllUsers(): Promise<FirestoreUser[]> {
  const snap = await getDocs(collection(db, USERS_COL));
  return snap.docs.map(d => d.data() as FirestoreUser);
}

export async function getPendingUsers(): Promise<FirestoreUser[]> {
  const q = query(collection(db, USERS_COL), where('status', '==', 'pending'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as FirestoreUser);
}

export async function getActiveUsers(): Promise<FirestoreUser[]> {
  const q = query(collection(db, USERS_COL), where('status', '==', 'active'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as FirestoreUser);
}

export async function approveUser(uid: string, adminUid: string, teamId: string): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), {
    status: 'active',
    teamId,
    approvedAt: new Date().toISOString(),
    approvedBy: adminUid,
    updatedAt: serverTimestamp(),
  });
}

export async function rejectUser(uid: string): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), {
    status: 'suspended',
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserTeam(uid: string, teamId: string): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), {
    teamId,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserRole(uid: string, role: Role): Promise<void> {
  await updateDoc(doc(db, USERS_COL, uid), {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUser(uid: string): Promise<void> {
  await deleteDoc(doc(db, USERS_COL, uid));
}

// ─── Admin Check ───
const ADMIN_EMAILS = ['tanhyu.kim@gmail.com'];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}
