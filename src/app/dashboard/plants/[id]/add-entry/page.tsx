import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Leaf, Upload } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../../supabase/server";
import { addGrowthEntry } from "@/app/actions/plant-actions";

export default async function AddGrowthEntryPage({
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

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">Add Growth Entry</h1>
              <p className="text-gray-600 mb-6">
                Record the current state of {plant.name}
              </p>

              <form action={addGrowthEntry} className="space-y-6">
                <input type="hidden" name="plant_id" value={params.id} />

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload Photo</p>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          name="height"
                          type="number"
                          step="0.1"
                          placeholder="e.g. 25.5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="num_leaves">Number of Leaves</Label>
                        <Input
                          id="num_leaves"
                          name="num_leaves"
                          type="number"
                          placeholder="e.g. 8"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Describe any changes or observations..."
                        rows={4}
                      />
                    </div>
                  </div>
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
                    Save Entry
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
