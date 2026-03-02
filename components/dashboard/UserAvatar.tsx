"use client";

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-28',
};

const fallbackSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-3xl',
};

export default function UserAvatar({ avatarUrl, firstName, lastName, size = 'md', className }: UserAvatarProps) {
  const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'U';

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile" />}
      <AvatarFallback
        className={cn(
          'bg-blue-100 text-blue-600 font-bold',
          fallbackSizeClasses[size]
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
