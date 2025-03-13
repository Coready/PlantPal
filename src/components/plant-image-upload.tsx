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

  // Add a direct click handler for the button
  const triggerFileInput = (e: React.MouseEvent) => {
    // Prevent any form submission
    e.preventDefault();
    e.stopPropagation();
    
    // Find the file input element and click it
    const fileInput = document.getElementById('plant-image-upload');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
      {imageUrl ? (
        <div className="w-full h-full relative group">
          <img 
            src={imageUrl} 
            alt="Plant" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Upload Photo Here</h3>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base bg-white px-6"
              disabled={uploading}
              onClick={triggerFileInput}
              type="button" // Explicitly set type to button to prevent form submission
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ImageIcon className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Upload Photo Here</h3>
          <p className="text-base text-gray-400 mt-1 mb-4">Tap to browse or drag and drop</p>
          <div className="flex gap-4">
            <Button
              type="button" // Explicitly set type to button
              variant="outline"
              size="lg"
              className="cursor-pointer text-base px-6"
              disabled={uploading}
              onClick={triggerFileInput}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-base"
              disabled={true}
            >
              <Camera className="w-5 h-5 mr-2" />
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