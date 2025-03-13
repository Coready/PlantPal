"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Home, Leaf, Plus, Calendar, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileAvatarUpload from "./profile-avatar-upload";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function getUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          const { data: profile } = await supabase
            .from("users")
            .select("avatar_url")
            .eq("id", user.id)
            .single();
          
          if (profile) {
            setAvatarUrl(profile.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    }
    
    getUserProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/sign-in");
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold flex items-center gap-2"
          >
            <Leaf className="h-6 w-6 text-green-600" />
            <span>PlantPal</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-green-600 flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-green-600 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Care Calendar
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-green-600 flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 ml-2 flex items-center gap-2"
            asChild
          >
            <Link href="/dashboard/plants/add">
              <Plus className="h-4 w-4" />
              Add Plant
            </Link>
          </Button>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0">
                {userId ? (
                  <ProfileAvatarUpload 
                    userId={userId} 
                    avatarUrl={avatarUrl} 
                    size="sm" 
                    editable={false}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-green-100" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
