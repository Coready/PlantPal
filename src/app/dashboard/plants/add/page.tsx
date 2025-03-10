import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Leaf, Upload } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";

export default async function AddPlantPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  async function addPlant(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const location = formData.get("location") as string;
    const acquired_date = formData.get("acquired_date") as string;
    const notes = formData.get("notes") as string;
    const image_url =
      (formData.get("image_url") as string) ||
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    const { data, error } = await supabase
      .from("plants")
      .insert({
        name,
        species,
        location,
        acquired_date,
        notes,
        image_url,
        user_id: user.id,
      })
      .select();

    if (error) {
      console.error("Error adding plant:", error);
      return;
    }

    return redirect("/dashboard/plants");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Add New Plant</h1>

              <form action={addPlant} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Upload Plant Photo
                      </p>
                      <p className="text-xs text-gray-400 mt-1">or</p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Browse
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Camera className="w-3 h-3 mr-1" />
                          Take Photo
                        </Button>
                      </div>
                      <Input
                        type="hidden"
                        name="image_url"
                        value="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80"
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Plant Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. My Monstera"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="species">Species</Label>
                      <Input
                        id="species"
                        name="species"
                        placeholder="e.g. Monstera Deliciosa"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g. Living Room"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="acquired_date">Acquired Date</Label>
                        <Input
                          id="acquired_date"
                          name="acquired_date"
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
                    name="notes"
                    placeholder="Add any notes about your plant here..."
                    rows={4}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Leaf className="w-4 h-4 mr-2" />
                    Add Plant
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
