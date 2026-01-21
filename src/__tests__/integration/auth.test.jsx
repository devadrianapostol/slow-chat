import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Mock Firebase
vi.mock('../../firebase', () => ({
  auth: {
    onAuthStateChanged: vi.fn((callback) => {
      callback(null);
      return vi.fn();
    }),
  },
  db: {},
  storage: {},
  default: {},
}));

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null);
    return vi.fn();
  }),
  updateProfile: vi.fn(),
}));

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display login page when not authenticated', () => {
    render(<App />);
    
    expect(screen.getByText('SlowChat')).toBeInTheDocument();
    expect(screen.getByText('One message per 24 hours. Make it count.')).toBeInTheDocument();
  });

  it('should toggle between login and signup forms', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Initially on login
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    
    // Click to switch to signup
    const toggleButton = screen.getByText(/Don't have an account\? Sign up/i);
    await user.click(toggleButton);
    
    // Should now show signup
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  it('should validate required fields on signup', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Switch to signup
    const toggleButton = screen.getByText(/Don't have an account\? Sign up/i);
    await user.click(toggleButton);
    
    // Try to submit without filling fields
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);
    
    // Form should prevent submission (browser validation)
    const nameInput = screen.getByPlaceholderText('Your name');
    expect(nameInput).toBeInvalid();
  });
});
