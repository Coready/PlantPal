"use client";

import { useState, useRef } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Camera, Image as ImageIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface PlantImageUploadProps {
  userId: string;
  onImageChange: (url: string) => void;
  initialImageUrl?: string;
}

export default function PlantImageUpload({
  userId,
  onImageChange,
  initialImageUrl,
}: PlantImageUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [fileInputKey, setFileInputKey] = useState(uuidv4());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/plants/${uuidv4()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('plants')
        .upload(filePath, file, {
          upsert: true,
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('plants')
        .getPublicUrl(filePath);
      
      // Update local state
      setImageUrl(publicUrl);
      
      // Call the callback
      onImageChange(publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your plant image has been successfully uploaded.",
        variant: "default",
      });
      
      // Reset the file input
      setFileInputKey(uuidv4());
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your plant image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Add a direct click handler for the button
  const triggerFileInput = (e: React.MouseEvent) => {
    e.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    await handleUpload(file);
  };

  return (
    <div className="relative h-[28rem] w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden">
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Plant preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
            <div className="bg-white/90 rounded-lg p-3 flex flex-col items-center space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={triggerFileInput}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-3 w-3 mr-1" />
                    Change Photo
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />
          <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
          <p className="text-base font-medium mb-2 text-center px-6">Upload Photo Here</p>
          <p className="text-xs text-gray-500 mb-4 text-center px-6">
            Click the button below to upload a photo of your plant
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={triggerFileInput}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-3 w-3 mr-1" />
                Upload Photo
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
} 