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
  const [imageUrl, setImageUrl] = useState<string>("https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80");
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
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-10">
              <h1 className="text-4xl font-bold mb-10 text-center">Add New Plant</h1>

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-5 gap-10">
                  {/* Left column - Image Upload (3/5 width) */}
                  <div className="md:col-span-3 flex flex-col items-center">
                    <p className="text-lg text-gray-600 mb-4 text-center">Upload pictures of your plant to identify</p>
                    <div className="w-full">
                      {userId && (
                        <PlantImageWrapper
                          userId={userId}
                          onImageChange={handleImageChange}
                          initialImageUrl={imageUrl}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right column - Form fields (2/5 width) with exact height matching */}
                  <div className="md:col-span-2 flex flex-col justify-between h-[28rem]">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name" className="text-xl">Plant Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. My Monstera"
                          className="h-11 text-lg mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="location" className="text-xl">Room</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Living Room"
                          className="h-11 text-lg mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="light-direction" className="flex items-center gap-2 text-xl">
                          <Compass className="h-5 w-5" />
                          Light Direction
                        </Label>
                        <Select value={lightDirection} onValueChange={setLightDirection}>
                          <SelectTrigger className="h-11 text-lg mt-1">
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
                        <Label htmlFor="light-brightness" className="flex items-center gap-2 text-xl">
                          <Sun className="h-5 w-5" />
                          Light Brightness
                        </Label>
                        <Select value={lightBrightness} onValueChange={setLightBrightness}>
                          <SelectTrigger className="h-11 text-lg mt-1">
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
                        <Label htmlFor="acquired_date" className="flex items-center gap-2 text-xl">
                          <Calendar className="h-5 w-5" />
                          Acquired Date
                        </Label>
                        <Input
                          id="acquired_date"
                          value={acquiredDate}
                          onChange={(e) => setAcquiredDate(e.target.value)}
                          type="date"
                          className="h-11 text-lg mt-1"
                        />
                      </div>
                    </div>
                    
                    {/* Action Buttons - Right aligned at the bottom */}
                    <div className="flex justify-end gap-4">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => router.push("/dashboard/plants")}
                        className="min-w-36 h-12 text-lg"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 min-w-36 h-12 text-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          "Adding..."
                        ) : (
                          <>
                            <Leaf className="w-5 h-5 mr-2" />
                            Add Plant
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
