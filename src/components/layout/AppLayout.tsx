
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/lib/slices/authSlice';
import { RootState } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = async () => {
    await dispatch(logout() as any);
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully',
    });
    navigate('/');
  };
  
  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-lg border-b border-border bg-background/70">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">TaskMaster</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                  <UserCircle className="h-4 w-4 mr-2" />
                  <span>{user.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      
      <footer className="py-6 border-t border-border">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>TaskMaster &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
