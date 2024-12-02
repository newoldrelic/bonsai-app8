import { create } from 'zustand';
import { auth, googleProvider, logAnalyticsEvent } from '../config/firebase';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type User 
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signInWithEmail: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await signInWithEmailAndPassword(auth, email, password);
      logAnalyticsEvent('login', { method: 'email' });
      set({ user: result.user, loading: false });
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      let errorMessage = 'Failed to sign in. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please create an account first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      }
      logAnalyticsEvent('login_error', { method: 'email', error: error.code });
      set({ error: errorMessage, loading: false });
    }
  },

  createAccount: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      logAnalyticsEvent('sign_up', { method: 'email' });
      set({ user: result.user, loading: false });
    } catch (error: any) {
      console.error('Error creating account:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account already exists with this email. Please sign in instead.';
      }
      logAnalyticsEvent('sign_up_error', { method: 'email', error: error.code });
      set({ error: errorMessage, loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      try {
        const result = await signInWithPopup(auth, googleProvider);
        logAnalyticsEvent('login', { method: 'google' });
        set({ user: result.user, loading: false });
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, googleProvider);
        } else {
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      logAnalyticsEvent('login_error', { method: 'google', error: error.code });
      set({ 
        error: 'Failed to sign in with Google. Please try again.',
        loading: false 
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await signOut(auth);
      logAnalyticsEvent('logout');
      set({ user: null, loading: false });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ 
        error: 'Failed to sign out. Please try again.',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));

// Set up auth state listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
  if (user) {
    logAnalyticsEvent('user_state_changed', { 
      state: 'signed_in',
      userId: user.uid
    });
  }
});