"use client";

import { useState } from "react";
import PlantImageUpload from "./plant-image-upload";

export interface PlantImageWrapperProps {
  userId: string;
  onImageChange: (url: string) => void;
  initialImageUrl?: string;
  overlayText?: string;
}

export default function PlantImageWrapper({
  userId,
  onImageChange,
  initialImageUrl,
  overlayText = "Upload Photo Here", // Default value
}: PlantImageWrapperProps) {
  return (
    <div className="w-full">
      <PlantImageUpload
        userId={userId}
        onImageChange={onImageChange}
        initialImageUrl={initialImageUrl}
        overlayText={overlayText}
      />
    </div>
  );
} 