import { useState, FormEvent } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Board } from '@/types';

interface BoardFormProps {
  board?: Board | null;
  userId: number;
  onSubmit: (data: { name: string; description: string; user_id: number }) => Promise<void>;
  onCancel: () => void;
}

export const BoardForm = ({ board, userId, onSubmit, onCancel }: BoardFormProps) => {
  const [name, setName] = useState(board?.name || '');
  const [description, setDescription] = useState(board?.description || '');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Board name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Board name must be at least 3 characters';
    } else if (name.trim().length > 50) {
      newErrors.name = 'Board name must be less than 50 characters';
    }
    
    if (description.trim().length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        user_id: userId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Board Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
        placeholder="e.g. Platform Launch"
        error={errors.name}
        disabled={isSubmitting}
      />
      
      <Textarea
        label="Description (Optional)"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (errors.description) setErrors({ ...errors, description: undefined });
        }}
        placeholder="e.g. This board tracks the platform launch tasks"
        error={errors.description}
        disabled={isSubmitting}
      />
      
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : board ? 'Update Board' : 'Create Board'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
