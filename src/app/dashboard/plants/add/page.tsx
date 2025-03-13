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
          <div className="max-w-2xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6 text-center">Add New Plant</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left column - Form fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Plant Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. My Monstera"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Living Room"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="acquired_date" className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Acquired Date
                      </Label>
                      <Input
                        id="acquired_date"
                        value={acquiredDate}
                        onChange={(e) => setAcquiredDate(e.target.value)}
                        type="date"
                      />
                    </div>
                    
                    {/* Action Buttons - Moved up */}
                    <div className="pt-4 flex gap-3">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => router.push("/dashboard/plants")}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 flex-1"
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

                  {/* Right column - Image Upload */}
                  <div className="flex items-center justify-center">
                    {userId && (
                      <PlantImageWrapper
                        userId={userId}
                        onImageChange={handleImageChange}
                        initialImageUrl={imageUrl}
                      />
                    )}
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
