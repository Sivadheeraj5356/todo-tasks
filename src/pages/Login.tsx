
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/lib/store';
import AuthForm from '@/components/auth/AuthForm';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-b from-background to-secondary/30">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 animate-fade-in">TaskMaster</h1>
        <p className="text-muted-foreground animate-fade-in">
          Manage your tasks with ease
        </p>
      </div>
      <AuthForm />
    </div>
  );
};

export default Login;
