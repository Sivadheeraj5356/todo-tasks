
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo } from '@/lib/slices/todoSlice';
import { RootState } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { PriorityLevel } from '@/lib/slices/todoSlice';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TaskInput: React.FC = () => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [isOutdoorActivity, setIsOutdoorActivity] = useState(false);
  
  const dispatch = useDispatch();
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast({
        title: 'Empty Task',
        description: 'Please enter a task description',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to add tasks',
        variant: 'destructive',
      });
      return;
    }
    
    dispatch(
      addTodo({
        text: text.trim(),
        userId: user.id,
        priority,
        isOutdoorActivity,
      }) as any
    );
    
    // Reset form
    setText('');
    setPriority('medium');
    setIsOutdoorActivity(false);
    
    toast({
      title: 'Task Added',
      description: 'Your task has been added successfully',
    });
  };
  
  return (
    <Card className="p-6 mb-6 glass-card animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="task" className="text-base font-medium">
            New Task
          </Label>
          <div className="flex mt-1.5">
            <Input
              id="task"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-grow transition-all duration-200 focus:ring-2 ring-primary/20"
            />
            <Button type="submit" className="ml-2 transition-all duration-200">
              <PlusCircle className="h-5 w-5 mr-1" />
              Add
            </Button>
          </div>
        </div>
  
        <div>
          <Label className="text-base font-medium mb-2 block">Priority</Label>
          <RadioGroup 
            value={priority} 
            onValueChange={(value) => setPriority(value as PriorityLevel)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="text-priority-high font-medium">High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="text-priority-medium font-medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="text-priority-low font-medium">Low</Label>
            </div>
          </RadioGroup>
        </div>
  
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isOutdoor" 
            checked={isOutdoorActivity}
            onCheckedChange={(checked) => setIsOutdoorActivity(!!checked)}
          />
          <Label htmlFor="isOutdoor">This is an outdoor activity</Label>
        </div>
      </form>
    </Card>
  );
};

export default TaskInput;
