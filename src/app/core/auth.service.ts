import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseError, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { environment } from '../../environments/environment';

/** Friendly messages for the Firebase errors people actually hit. */
const MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'That email and password combination is not right.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/email-already-in-use': 'An account with this email already exists. Try logging in instead.',
  'auth/weak-password': 'Please choose a password with at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/popup-closed-by-user': 'The Google sign-in window was closed before finishing.',
  'auth/network-request-failed': 'Could not reach the sign-in service. Check your connection.',
};

export function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) return MESSAGES[error.code] ?? 'Something went wrong. Please try again.';
  return 'Something went wrong. Please try again.';
}

/**
 * Firebase Authentication with the modular SDK (no @angular/fire wrapper, so it doesn't lag
 * behind Angular releases). Exposes the signed-in user as a signal.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly auth = getAuth(initializeApp(environment.firebase));

  /** undefined until Firebase reports the first auth state, then the user or null. */
  readonly user = signal<User | null | undefined>(undefined);
  readonly signedIn = computed(() => {
    const user = this.user();
    return !!user && isVerified(user);
  });

  /** Resolves once the first auth state is known (guards wait for this on a fresh page load). */
  readonly ready: Promise<void>;

  constructor() {
    this.ready = new Promise((resolve) =>
      onAuthStateChanged(this.auth, (user) => {
        this.user.set(user);
        resolve();
      }),
    );
  }

  async login(email: string, password: string): Promise<void> {
    const { user } = await signInWithEmailAndPassword(this.auth, email, password);
    await this.router.navigate([isVerified(user) ? '/dashboard' : '/verify-email']);
  }

  async register(email: string, password: string): Promise<void> {
    const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
    await sendEmailVerification(user);
    await this.router.navigate(['/verify-email']);
  }

  async resendVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) await sendEmailVerification(user);
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async loginWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
    await this.router.navigate(['/dashboard']);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }
}

/** Email accounts must verify their address; Google accounts are already verified. */
function isVerified(user: User): boolean {
  return user.emailVerified || user.providerData.some((p) => p.providerId === 'google.com');
}
