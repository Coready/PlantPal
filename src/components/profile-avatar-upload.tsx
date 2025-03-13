"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, UserCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface ProfileAvatarUploadProps {
  userId: string;
  avatarUrl?: string | null;
  onAvatarChange?: (url: string) => void;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

export default function ProfileAvatarUpload({
  userId,
  avatarUrl,
  onAvatarChange,
  size = "md",
  editable = true,
}: ProfileAvatarUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [avatarPath, setAvatarPath] = useState<string | null>(avatarUrl || null);
  const [fileInputKey, setFileInputKey] = useState(uuidv4());

  // Size classes for different avatar sizes
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
  };

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the user's avatar_url in the database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
        
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setAvatarPath(publicUrl);
      
      // Call the callback if provided
      if (onAvatarChange) {
        onAvatarChange(publicUrl);
      }
      
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
        variant: "default",
      });
      
      // Reset the file input
      setFileInputKey(uuidv4());
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Avatar className={`${sizeClasses[size]} bg-green-100`}>
        <AvatarImage src={avatarPath || ""} alt="Profile" />
        <AvatarFallback className="bg-green-100">
          <UserCircle className="h-full w-full text-green-600" />
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <div className="flex items-center">
          <input
            type="file"
            id="avatar-upload"
            key={fileInputKey}
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          <label htmlFor="avatar-upload">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs cursor-pointer"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-3 w-3" />
                    Change Photo
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      )}
    </div>
  );
} 