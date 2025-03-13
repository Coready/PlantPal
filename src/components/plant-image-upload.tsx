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
  overlayText?: string;
}

export default function PlantImageUpload({
  userId,
  onImageChange,
  initialImageUrl,
  overlayText = "Upload Photo Here",
}: PlantImageUploadProps) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [fileInputKey, setFileInputKey] = useState(uuidv4());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Handle drag and drop
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleUpload(file);
    }
  };

  return (
    <div 
      className={`relative h-[28rem] w-full rounded-lg border-2 border-dashed ${isDragging ? 'border-green-400 bg-green-50' : 'border-green-300 bg-green-50'} flex flex-col items-center justify-center overflow-hidden transition-colors duration-200`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt="Plant preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-white mb-4 text-center px-4">{overlayText}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs bg-transparent text-white border-white hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput(e);
              }}
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
          <div className="absolute inset-0 bg-gradient-to-b from-green-600/80 to-green-800/80 flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 mb-3 text-white/90" />
            <h3 className="text-3xl font-bold text-white mb-2 text-center px-4">{overlayText}</h3>
            <p className="text-sm text-white/90 mb-6 text-center max-w-xs px-4">
              Drag & drop a photo here or click to browse
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs bg-transparent text-white border-white hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput(e);
              }}
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
          </div>
        </>
      )}
    </div>
  );
} 