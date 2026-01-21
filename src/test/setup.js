import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase auth functions
const mockOnAuthStateChanged = vi.fn((auth, callback) => {
  if (typeof callback === 'function') {
    callback(null);
  }
  return vi.fn(); // unsubscribe function
});

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: mockOnAuthStateChanged,
  updateProfile: vi.fn(),
}));

// Mock Firebase
vi.mock('../firebase', () => ({
  auth: {},
  db: {},
  storage: {},
  default: {},
}));
