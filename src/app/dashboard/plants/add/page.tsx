"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Calendar } from "lucide-react";
import { createClient } from "../../../../../supabase/client";
import PlantImageWrapper from "@/components/plant-image-wrapper";
import { toast } from "@/components/ui/use-toast";

export default function AddPlantPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80");
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
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
          <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-8 text-center">Add New Plant</h1>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-5 gap-8">
                  {/* Left column - Image Upload (3/5 width) */}
                  <div className="md:col-span-3 flex items-center justify-center">
                    {userId && (
                      <PlantImageWrapper
                        userId={userId}
                        onImageChange={handleImageChange}
                        initialImageUrl={imageUrl}
                      />
                    )}
                  </div>

                  {/* Right column - Form fields (2/5 width) */}
                  <div className="md:col-span-2 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-lg">Plant Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. My Monstera"
                        className="h-10 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-lg">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Living Room"
                        className="h-10 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="acquired_date" className="flex items-center gap-1 text-lg">
                        <Calendar className="h-5 w-5" />
                        Acquired Date
                      </Label>
                      <Input
                        id="acquired_date"
                        value={acquiredDate}
                        onChange={(e) => setAcquiredDate(e.target.value)}
                        type="date"
                        className="h-10 text-base"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons - Centered at the bottom */}
                <div className="pt-6 flex justify-center gap-4 mt-8">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.push("/dashboard/plants")}
                    className="w-32 h-12 text-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 w-32 h-12 text-lg"
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
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
