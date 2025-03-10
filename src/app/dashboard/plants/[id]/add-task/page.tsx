import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Droplet, Leaf, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../../supabase/server";
import { recordCareTask } from "@/app/actions/plant-actions";

export default async function AddCareTaskPage({
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
              <h1 className="text-2xl font-bold mb-2">Record Care Activity</h1>
              <p className="text-gray-600 mb-6">
                Log a care task for {plant.name}
              </p>

              <form action={recordCareTask} className="space-y-6">
                <input type="hidden" name="plant_id" value={params.id} />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Task Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="task_type"
                          value="water"
                          className="mr-3"
                          defaultChecked
                        />
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <Droplet size={16} className="text-blue-500" />
                          </div>
                          <span>Water</span>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="task_type"
                          value="fertilize"
                          className="mr-3"
                        />
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                            <Leaf size={16} className="text-amber-500" />
                          </div>
                          <span>Fertilize</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Add any details about this care activity..."
                      rows={4}
                    />
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
                    <Calendar className="w-4 h-4 mr-2" />
                    Record Activity
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
