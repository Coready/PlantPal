"use client";

import ProfileAvatarUpload from "./profile-avatar-upload";

interface ProfileAvatarWrapperProps {
  userId: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

export default function ProfileAvatarWrapper({
  userId,
  avatarUrl,
  size = "md",
  editable = true,
}: ProfileAvatarWrapperProps) {
  return (
    <ProfileAvatarUpload
      userId={userId}
      avatarUrl={avatarUrl}
      size={size}
      editable={editable}
    />
  );
} 