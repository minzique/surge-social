
import { useState } from 'react';
import { Button } from './ui/button';
import { PenSquare } from 'lucide-react';
import { CreatePostDialog } from './CreatePostDialog';
import { useAuth } from '../hooks/useAuth';

export default function UserProfile() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div className="space-y-4">

    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#fafafa] overflow-hidden">
          {/* TODO: Add user avatar */}
        </div>
        <div className="ml-4">
          <h2 className="font-semibold text-[#222222]">{user?.username}</h2>
          <p className="text-sm text-[#555555]">{user?.email}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#555555]">Posts</span>
          <span className="font-semibold text-[#222222]">0</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#555555]">Followers</span>
          <span className="font-semibold text-[#222222]">0</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#555555]">Following</span>
          <span className="font-semibold text-[#222222]">0</span>
        </div>
      </div>
    </div>
     <Button 
        onClick={() => setIsCreatePostOpen(true)}
        className="w-full"
        variant="default"
      >
        <PenSquare className="h-4 w-4 mr-2" />
        Create Post
      </Button>

      <CreatePostDialog
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSuccess={() => {
          // Optionally trigger timeline refresh
        }}
      />
    </div>
  );
}