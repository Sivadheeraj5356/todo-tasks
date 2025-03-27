
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

// Mock login function - in a real app, this would call an API
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'demo@example.com' && password === 'password') {
        // Retrieve stored user data or create new user
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          return JSON.parse(storedUser);
        }
        
        // Create new user if none exists
        const newUser = {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
        };
        
        // Store in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(newUser));
        return newUser;
      }
      
      return rejectWithValue('Invalid email or password');
    } catch (error) {
      return rejectWithValue('Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    { name, email, password }: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
      };
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      return rejectWithValue('Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  // Clear user from localStorage
  localStorage.removeItem('user');
  return null;
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      });
  },
});

export const { resetAuthStatus } = authSlice.actions;
export default authSlice.reducer;
