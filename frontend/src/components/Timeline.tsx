"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Post {
  id: number;
  username: string;
  avatar: string;
  imageUrl: string;
  content: string;
  likes: number;
}

export default function Timeline() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // TODO: Fetch actual posts from the backend
    const mockPosts: Post[] = [
      {
        id: 1,
        username: "johndoe",
        avatar: "/placeholder.svg?height=40&width=40",
        imageUrl: "/placeholder.svg?height=400&width=400",
        content: "Enjoying a beautiful day!",
        likes: 42,
      },
      {
        id: 2,
        username: "janedoe",
        avatar: "/placeholder.svg?height=40&width=40",
        imageUrl: "/placeholder.svg?height=400&width=400",
        content: "Just finished a great workout!",
        likes: 28,
      },
    ];
    setPosts(mockPosts);
  }, []);

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="w-full max-w-md mx-auto">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.avatar} alt={post.username} />
              <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <Link
              to={`/profile/${post.username}`}
              className="font-semibold text-sm"
            >
              {post.username}
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <img src={post.imageUrl} alt="Post" className="w-full h-auto" />
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="w-5 h-5 text-red-500" />
              </Button>
              <span className="text-sm text-gray-600">{post.likes} likes</span>
            </div>
            <p className="text-sm">
              <Link to={`/profile/${post.username}`} className="font-semibold">
                {post.username}
              </Link>{" "}
              {post.content}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
