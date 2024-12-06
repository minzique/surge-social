import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Post } from "../types/shared/post.types";
import { format } from "date-fns";
import { postsApi } from "../api/posts";

const LOGO_URL = "https://apirequest.app/api/public/logo?site_address=launchpad.surge.global";

function PostCard({ post, onLike }: { post: Post; onLike: (postId: string) => void }) {
  const { user } = useAuth();
  const isLiked = post.likedBy.includes(user?.id || "");
  const formattedDate = format(new Date(post.createdAt), "MMM d, yyyy");

  return (
    <div className="bg-white border border-[#dddddd] rounded-[1px] mb-6">
      {/* Post Header */}
      <div className="flex items-center p-3">
        <div className="w-8 h-8 rounded-full bg-[#fafafa] overflow-hidden">
          {/* TODO: Add user avatar */}
        </div>
        <span className="ml-3 font-semibold text-[#222222]">{post.author.username}</span>
        <span className="ml-auto text-xs text-[#999999]">{formattedDate}</span>
      </div>

      {/* Post Content */}
      <div className="relative pt-[100%]">
        {post.content && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#fafafa] text-[#555555]">
            {post.content}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onLike(post.id)}
            className={`p-2 rounded-full hover:bg-[#fafafa] transition-colors ${
              isLiked ? "text-[#de4548]" : "text-[#222222]"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <span className="text-sm text-[#555555]">{post.likes} likes</span>
        </div>

        {/* Post Content */}
        <div className="mt-2">
          <span className="font-semibold text-[#222222] mr-2">{post.author.username}</span>
          <span className="text-[#555555]">{post.content}</span>
        </div>
      </div>
    </div>
  );
}

export default function Timeline() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postsApi.getPosts();
      if (response.success && response.data) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isLiked = post.likedBy.includes(user?.id || "");
      const response = isLiked 
        ? await postsApi.unlikePost(postId)
        : await postsApi.likePost(postId);

      if (response.success && response.data) {
        setPosts(currentPosts => 
          currentPosts.map(p => {
            if (p.id === postId && response.data) {
              return response.data;
            }
            return p;
          })
        );
      }
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#dddddd] z-50">
        <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
          <img src={LOGO_URL} alt="Surge Social" className="h-8" />
          
          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#555555]">{user?.username}</span>
            <div className="w-8 h-8 rounded-full bg-[#fafafa] overflow-hidden">
              {/* TODO: Add user avatar */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto pt-24 px-4 pb-8">
        {isLoading ? (
          <div className="text-center text-[#999999]">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-[#999999]">No posts yet</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
