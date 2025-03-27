
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  toggleTodo, 
  deleteTodo, 
  updateTodoPriority,
  Todo,
  PriorityLevel
} from '@/lib/slices/todoSlice';
import { RootState } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Trash, 
  ArrowUp, 
  ArrowDown, 
  Cloud, 
  CheckCircle 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TaskItemProps {
  todo: Todo;
}

const TaskItem: React.FC<TaskItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  
  if (!user) return null;
  
  const handleToggle = () => {
    dispatch(toggleTodo({ id: todo.id, userId: user.id }) as any);
    
    toast({
      title: todo.completed ? 'Task Reopened' : 'Task Completed',
      description: todo.text,
    });
  };
  
  const handleDelete = () => {
    dispatch(deleteTodo({ id: todo.id, userId: user.id }) as any);
    
    toast({
      title: 'Task Deleted',
      description: `"${todo.text}" has been removed`,
    });
  };
  
  const handlePriorityChange = (newPriority: PriorityLevel) => {
    if (newPriority !== todo.priority) {
      dispatch(
        updateTodoPriority({
          id: todo.id,
          priority: newPriority,
          userId: user.id,
        }) as any
      );
      
      toast({
        title: 'Priority Updated',
        description: `Task priority changed to ${newPriority}`,
      });
    }
  };
  
  // Get priority color class
  const getPriorityColorClass = () => {
    switch (todo.priority) {
      case 'high':
        return 'border-priority-high';
      case 'medium':
        return 'border-priority-medium';
      case 'low':
        return 'border-priority-low';
      default:
        return '';
    }
  };
  
  return (
    <Card 
      className={`p-4 flex items-center justify-between transition-all duration-300 glass-card border-l-4 ${getPriorityColorClass()} ${
        todo.completed ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-center space-x-3 flex-grow">
        <Checkbox 
          checked={todo.completed} 
          onCheckedChange={handleToggle} 
          id={`todo-${todo.id}`}
          className="transition-all duration-200"
        />
        <div className="flex-grow">
          <label
            htmlFor={`todo-${todo.id}`}
            className={`cursor-pointer ${
              todo.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {todo.text}
          </label>
          
          <div className="flex items-center mt-1 space-x-2">
            {todo.isOutdoorActivity && (
              <Badge variant="outline" className="flex items-center text-xs space-x-1">
                <Cloud className="h-3 w-3" />
                <span>Outdoor</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!todo.completed && (
            <>
              <DropdownMenuItem onClick={() => handleToggle()}>
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Mark as completed</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePriorityChange('high')}>
                <ArrowUp className="h-4 w-4 mr-2 text-priority-high" />
                <span>High Priority</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange('medium')}>
                <span className="h-4 w-4 mr-2 flex items-center justify-center text-priority-medium">•</span>
                <span>Medium Priority</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePriorityChange('low')}>
                <ArrowDown className="h-4 w-4 mr-2 text-priority-low" />
                <span>Low Priority</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem 
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="h-4 w-4 mr-2" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default TaskItem;
