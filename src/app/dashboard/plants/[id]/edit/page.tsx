import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Leaf, Upload } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../../supabase/server";
import Image from "next/image";

export default async function EditPlantPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch plant details
  const { data: plant, error } = await supabase
    .from("plants")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !plant) {
    return redirect("/dashboard/plants");
  }

  async function updatePlant(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const location = formData.get("location") as string;
    const acquired_date = formData.get("acquired_date") as string;
    const notes = formData.get("notes") as string;
    const image_url = formData.get("image_url") as string;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    const { data, error } = await supabase
      .from("plants")
      .update({
        name,
        species,
        location,
        acquired_date,
        notes,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select();

    if (error) {
      console.error("Error updating plant:", error);
      return;
    }

    return redirect(`/dashboard/plants/${params.id}`);
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Edit Plant</h1>

              <form action={updatePlant} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden">
                      {plant.image_url ? (
                        <>
                          <Image
                            src={plant.image_url}
                            alt={plant.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-medium">
                              Change Photo
                            </p>
                            <div className="mt-2 flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-xs bg-white/80 hover:bg-white"
                              >
                                <Upload className="w-3 h-3 mr-1" />
                                Browse
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                      <Input
                        type="hidden"
                        name="image_url"
                        defaultValue={plant.image_url}
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
                        defaultValue={plant.name}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="species">Species</Label>
                      <Input
                        id="species"
                        name="species"
                        placeholder="e.g. Monstera Deliciosa"
                        defaultValue={plant.species || ""}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="e.g. Living Room"
                          defaultValue={plant.location || ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="acquired_date">Acquired Date</Label>
                        <Input
                          id="acquired_date"
                          name="acquired_date"
                          type="date"
                          defaultValue={plant.acquired_date || ""}
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
                    defaultValue={plant.notes || ""}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Leaf className="w-4 h-4 mr-2" />
                    Save Changes
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
