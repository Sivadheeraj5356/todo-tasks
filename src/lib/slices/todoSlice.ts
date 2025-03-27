
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  userId: string;
  priority: PriorityLevel;
  isOutdoorActivity: boolean;
}

interface TodoState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null,
};

// Load todos from localStorage
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (userId: string) => {
  try {
    const storedTodos = localStorage.getItem(`todos_${userId}`);
    return storedTodos ? JSON.parse(storedTodos) : [];
  } catch (error) {
    return [];
  }
});

// Helper function to save todos to localStorage
const saveTodosToStorage = (todos: Todo[], userId: string) => {
  localStorage.setItem(`todos_${userId}`, JSON.stringify(todos));
};

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (
    { text, userId, priority, isOutdoorActivity }: 
    { text: string; userId: string; priority: PriorityLevel; isOutdoorActivity: boolean }, 
    { getState, dispatch }
  ) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
      userId,
      priority,
      isOutdoorActivity,
    };
    
    // Get current state
    const state = getState() as { todos: TodoState };
    const updatedTodos = [...state.todos.todos, newTodo];
    
    // Save to localStorage
    saveTodosToStorage(updatedTodos, userId);
    
    return newTodo;
  }
);

export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async ({ id, userId }: { id: string; userId: string }, { getState }) => {
    const state = getState() as { todos: TodoState };
    const todo = state.todos.todos.find((t) => t.id === id);
    
    if (!todo) throw new Error('Todo not found');
    
    const updatedTodo = { ...todo, completed: !todo.completed };
    const updatedTodos = state.todos.todos.map((t) => 
      t.id === id ? updatedTodo : t
    );
    
    // Save to localStorage
    saveTodosToStorage(updatedTodos, userId);
    
    return updatedTodo;
  }
);

export const updateTodoPriority = createAsyncThunk(
  'todos/updatePriority',
  async (
    { id, priority, userId }: { id: string; priority: PriorityLevel; userId: string },
    { getState }
  ) => {
    const state = getState() as { todos: TodoState };
    const todo = state.todos.todos.find((t) => t.id === id);
    
    if (!todo) throw new Error('Todo not found');
    
    const updatedTodo = { ...todo, priority };
    const updatedTodos = state.todos.todos.map((t) => 
      t.id === id ? updatedTodo : t
    );
    
    // Save to localStorage
    saveTodosToStorage(updatedTodos, userId);
    
    return updatedTodo;
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async ({ id, userId }: { id: string; userId: string }, { getState }) => {
    const state = getState() as { todos: TodoState };
    const updatedTodos = state.todos.todos.filter((t) => t.id !== id);
    
    // Save to localStorage
    saveTodosToStorage(updatedTodos, userId);
    
    return id;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      })
      
      // Add Todo
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      })
      
      // Toggle Todo
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      
      // Update Todo Priority
      .addCase(updateTodoPriority.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      
      // Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;
