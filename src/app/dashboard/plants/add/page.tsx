"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Calendar, Sun, Compass } from "lucide-react";
import { createClient } from "../../../../../supabase/client";
import PlantImageWrapper from "@/components/plant-image-wrapper";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddPlantPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("/images/plant-growth.jpg");
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [lightDirection, setLightDirection] = useState("");
  const [lightBrightness, setLightBrightness] = useState("");
  const [acquiredDate, setAcquiredDate] = useState(new Date().toISOString().split('T')[0]); // Today's date

  // Get user ID on component mount
  useEffect(() => {
    async function getUserId() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        router.push("/sign-in");
      }
    }
    getUserId();
  }, [supabase, router]);

  const handleImageChange = (url: string) => {
    setImageUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name field only when submitting
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your plant.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      const { data, error } = await supabase
        .from("plants")
        .insert({
          name,
          location,
          light_direction: lightDirection,
          light_brightness: lightBrightness,
          acquired_date: acquiredDate,
          notes: "", // Empty notes
          image_url: imageUrl,
          user_id: user.id,
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Plant added",
        description: "Your plant has been successfully added.",
        variant: "default",
      });

      router.push("/dashboard/plants");
    } catch (error) {
      console.error("Error adding plant:", error);
      toast({
        title: "Error",
        description: "There was an error adding your plant.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gradient-to-b from-green-50 to-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4 text-center text-green-800">Add Your Green Friend</h1>
              <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">Document your plants and track their growth journey. Each plant tells a story - start capturing yours today.</p>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-5 gap-5">
                  <div className="md:col-span-5 mb-0">
                    <div className="grid md:grid-cols-5 gap-6 items-start">
                      {/* Left column - Image Upload (3/5 width) */}
                      <div className="md:col-span-3">
                        {userId && (
                          <PlantImageWrapper
                            userId={userId}
                            onImageChange={handleImageChange}
                            initialImageUrl={imageUrl}
                            overlayText=""
                          />
                        )}
                      </div>

                      {/* Right column - Form fields (2/5 width) */}
                      <div className="md:col-span-2 flex flex-col h-[28rem] justify-between">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name" className="text-base font-medium text-green-800">Plant Name</Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. My Monstera"
                              className="h-9 text-sm mt-1 border-green-200 focus:border-green-500 focus:ring-green-500 hover:border-green-400 transition-colors"
                            />
                          </div>

                          <div>
                            <Label htmlFor="location" className="text-base font-medium text-green-800">Room</Label>
                            <Input
                              id="location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder="e.g. Living Room"
                              className="h-9 text-sm mt-1 border-green-200 focus:border-green-500 focus:ring-green-500 hover:border-green-400 transition-colors"
                            />
                          </div>

                          <div>
                            <Label htmlFor="light-direction" className="flex items-center gap-2 text-base font-medium text-green-800">
                              <Compass className="h-4 w-4 text-green-600" />
                              Light Direction
                            </Label>
                            <Select value={lightDirection} onValueChange={setLightDirection}>
                              <SelectTrigger className="h-9 text-sm border-green-200 focus:border-green-500 focus:ring-green-500 pl-10 [&>span>svg]:text-green-600 hover:border-green-400 transition-colors">
                                <SelectValue placeholder="Select direction" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="north">North</SelectItem>
                                <SelectItem value="east">East</SelectItem>
                                <SelectItem value="south">South</SelectItem>
                                <SelectItem value="west">West</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="light-brightness" className="flex items-center gap-2 text-base font-medium text-green-800">
                              <Sun className="h-4 w-4 text-green-600" />
                              Light Brightness
                            </Label>
                            <Select value={lightBrightness} onValueChange={setLightBrightness}>
                              <SelectTrigger className="h-9 text-sm border-green-200 focus:border-green-500 focus:ring-green-500 pl-10 [&>span>svg]:text-green-600 hover:border-green-400 transition-colors">
                                <SelectValue placeholder="Select brightness" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low Light</SelectItem>
                                <SelectItem value="medium">Medium Light</SelectItem>
                                <SelectItem value="bright">Bright Light</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="acquired_date" className="text-base font-medium text-green-800">
                              Acquired Date
                            </Label>
                            <div className="relative mt-1">
                              <Input
                                id="acquired_date"
                                value={acquiredDate}
                                onChange={(e) => setAcquiredDate(e.target.value)}
                                type="text" 
                                placeholder="YYYY-MM-DD"
                                className="h-9 text-sm border-green-200 focus:border-green-500 focus:ring-green-500 pr-10 hover:border-green-400 transition-colors"
                                onClick={() => document.getElementById('date_picker')?.click()}
                                readOnly
                              />
                              <input 
                                id="date_picker" 
                                type="date" 
                                value={acquiredDate}
                                onChange={(e) => setAcquiredDate(e.target.value)}
                                className="sr-only"
                              />
                              <button 
                                type="button" 
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => document.getElementById('date_picker')?.click()}
                              >
                                <Calendar className="h-4 w-4 text-green-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons - at the bottom of the right column */}
                        <div className="flex justify-center gap-3 mt-4 mb-1">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => router.push("/dashboard/plants")}
                            className="min-w-28 h-10 text-sm border-green-200 text-green-800 hover:bg-green-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 min-w-28 h-10 text-sm"
                            disabled={loading}
                          >
                            {loading ? (
                              "Adding..."
                            ) : (
                              <>
                                <Leaf className="w-4 h-4 mr-2" />
                                Add Plant
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">Every plant you add helps create your personalized green space library.</p>
            <p className="text-sm text-gray-600 mt-1">Track growth, care schedules, and beautiful moments with PlantPal.</p>
          </div>
        </div>
      </main>
    </>
  );
}
