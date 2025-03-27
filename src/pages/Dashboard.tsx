
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/lib/store';
import AppLayout from '@/components/layout/AppLayout';
import TaskInput from '@/components/todo/TaskInput';
import TaskList from '@/components/todo/TaskList';
import WeatherWidget from '@/components/weather/WeatherWidget';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Hello, {user.name}</h1>
          <p className="text-muted-foreground">
            Organize your tasks and stay productive
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <TaskInput />
            <TaskList />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Weather</h2>
            <WeatherWidget />
            <div className="mt-6 glass-card p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="p-2 bg-secondary/50 rounded">
                  Mark tasks as outdoor activities to get weather recommendations
                </li>
                <li className="p-2 bg-secondary/50 rounded">
                  Use priorities to organize your tasks effectively
                </li>
                <li className="p-2 bg-secondary/50 rounded">
                  Check the weather before planning outdoor activities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
