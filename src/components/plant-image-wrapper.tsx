"use client";

import PlantImageUpload from "./plant-image-upload";

interface PlantImageWrapperProps {
  userId: string;
  onImageChange: (url: string) => void;
  initialImageUrl?: string;
}

export default function PlantImageWrapper({
  userId,
  onImageChange,
  initialImageUrl,
}: PlantImageWrapperProps) {
  return (
    <PlantImageUpload
      userId={userId}
      onImageChange={onImageChange}
      initialImageUrl={initialImageUrl}
    />
  );
} 