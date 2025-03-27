
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, resetAuthStatus } from '@/lib/slices/authSlice';
import { RootState } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  initialMode?: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { status, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  
  // Animation effect on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Show error toast if there's an auth error
  useEffect(() => {
    if (status === 'failed' && error) {
      toast({
        title: 'Authentication Error',
        description: error,
        variant: 'destructive',
      });
      dispatch(resetAuthStatus());
    }
  }, [status, error, toast, dispatch]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      await dispatch(login({ email, password }) as any);
    } else {
      if (!name.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Name is required',
          variant: 'destructive',
        });
        return;
      }
      await dispatch(register({ name, email, password }) as any);
    }
  };
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 50);
  };
  
  const isLoading = status === 'loading';
  
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card 
        className={`p-6 shadow-lg glass-card transition-all duration-500 ease-apple-spring ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {mode === 'login'
              ? 'Sign in to access your tasks'
              : 'Sign up to start organizing your tasks'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="transition-all duration-200"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="transition-all duration-200"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            )}
          </Button>
        </form>
        <div className='text-center mt-4 text-muted-foreground'>
          email : demo@example.com <br /> password : password
        </div>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline focus:outline-none transition-colors duration-200"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
