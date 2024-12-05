"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  posts: {
    id: number;
    imageUrl: string;
  }[];
}

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // TODO: Fetch actual user profile from the backend
    const mockProfile: UserProfile = {
      username: userId || "johndoe",
      email: "johndoe@example.com",
      avatar: "/placeholder.svg?height=100&width=100",
      posts: [
        { id: 1, imageUrl: "/placeholder.svg?height=200&width=200" },
        { id: 2, imageUrl: "/placeholder.svg?height=200&width=200" },
        { id: 3, imageUrl: "/placeholder.svg?height=200&width=200" },
      ],
    };
    setProfile(mockProfile);
  }, [userId]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.avatar} alt={profile.username} />
            <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{profile.username}</h2>
            <p className="text-sm text-gray-600">{profile.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {profile.posts.map((post) => (
              <img
                key={post.id}
                src={post.imageUrl}
                alt="Post"
                className="w-full h-auto rounded"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
