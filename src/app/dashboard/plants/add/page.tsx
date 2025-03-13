"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Leaf } from "lucide-react";
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
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [acquiredDate, setAcquiredDate] = useState("");
  const [notes, setNotes] = useState("");

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
          species,
          location,
          acquired_date: acquiredDate,
          notes,
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
              <h1 className="text-2xl font-bold mb-6">Add New Plant</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    {userId && (
                      <PlantImageWrapper
                        userId={userId}
                        onImageChange={handleImageChange}
                        initialImageUrl={imageUrl}
                      />
                    )}
                  </div>

                  <div className="md:w-2/3 space-y-4">
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
                      <Label htmlFor="species">Species</Label>
                      <Input
                        id="species"
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                        placeholder="e.g. Monstera Deliciosa"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <Label htmlFor="acquired_date">Acquired Date</Label>
                        <Input
                          id="acquired_date"
                          value={acquiredDate}
                          onChange={(e) => setAcquiredDate(e.target.value)}
                          type="date"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about your plant here..."
                    rows={4}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => router.push("/dashboard/plants")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
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
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
