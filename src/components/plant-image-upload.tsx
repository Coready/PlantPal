"use client";

import { useState } from "react";
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

  // Handle file upload
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
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

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
      {imageUrl ? (
        <div className="w-full h-full relative group">
          <img 
            src={imageUrl} 
            alt="Plant" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label htmlFor="plant-image-upload" className="cursor-pointer">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs bg-white"
                disabled={uploading}
              >
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
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <>
          <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-base text-gray-500 font-medium">Upload Plant Photo</p>
          <p className="text-sm text-gray-400 mt-1 mb-3">Tap to browse or drag and drop</p>
          <div className="flex gap-3">
            <label htmlFor="plant-image-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </>
                )}
              </Button>
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={true}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
          </div>
        </>
      )}
      
      <input
        type="file"
        id="plant-image-upload"
        key={fileInputKey}
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
} 