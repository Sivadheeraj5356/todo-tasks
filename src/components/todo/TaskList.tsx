
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos } from '@/lib/slices/todoSlice';
import { RootState } from '@/lib/store';
import TaskItem from './TaskItem';
import { Card } from '@/components/ui/card';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const { todos, status } = useSelector((state: RootState) => state.todos);
  const user = useSelector((state: RootState) => state.auth.user);
  
  useEffect(() => {
    if (user) {
      dispatch(fetchTodos(user.id) as any);
    }
  }, [dispatch, user]);
  
  if (status === 'loading') {
    return (
      <Card className="p-6 animate-pulse glass-card">
        <p className="text-center text-muted-foreground">Loading tasks...</p>
      </Card>
    );
  }
  
  if (todos.length === 0) {
    return (
      <Card className="p-6 glass-card animate-fade-in">
        <div className="text-center py-8">
          <h3 className="text-xl font-medium mb-2">No tasks yet</h3>
          <p className="text-muted-foreground">
            Add your first task to get started
          </p>
        </div>
      </Card>
    );
  }
  
  // Group tasks by priority
  const highPriorityTasks = todos.filter(todo => todo.priority === 'high');
  const mediumPriorityTasks = todos.filter(todo => todo.priority === 'medium');
  const lowPriorityTasks = todos.filter(todo => todo.priority === 'low');
  
  const renderTaskGroup = (tasks: typeof todos, title: string, priorityClass: string) => {
    if (tasks.length === 0) return null;
    
    return (
      <div className="mb-6 animate-fade-in" key={title}>
        <h3 className={`text-lg font-medium mb-3 ${priorityClass}`}>{title}</h3>
        <TransitionGroup>
          {tasks.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="task">
              <div className="mb-3">
                <TaskItem todo={todo} />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      {renderTaskGroup(highPriorityTasks, 'High Priority', 'text-priority-high')}
      {renderTaskGroup(mediumPriorityTasks, 'Medium Priority', 'text-priority-medium')}
      {renderTaskGroup(lowPriorityTasks, 'Low Priority', 'text-priority-low')}
    </div>
  );
};

export default TaskList;
