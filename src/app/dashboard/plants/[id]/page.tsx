import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Droplet, Edit, Leaf, Plus, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
import Image from "next/image";

export default async function PlantDetailsPage({
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
    // If plant doesn't exist or error, use sample data
    const samplePlant = {
      id: params.id,
      name: "Monstera Deliciosa",
      species: "Monstera Deliciosa",
      image_url:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&q=80",
      location: "Living Room",
      acquired_date: "2023-01-15",
      notes:
        "Thriving in bright indirect light. Repotted in March 2023 with premium soil mix.",
    };

    return (
      <>
        <DashboardNavbar />
        <main className="w-full bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative h-64 w-full bg-gray-100">
                <Image
                  src={samplePlant.image_url}
                  alt={samplePlant.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h1 className="text-3xl font-bold">{samplePlant.name}</h1>
                    <p className="text-gray-600">{samplePlant.species}</p>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Droplet size={16} />
                      Water
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                    >
                      <Leaf size={16} />
                      Fertilize
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                    <p>{samplePlant.location || "Not specified"}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Acquired Date
                    </h3>
                    <p>
                      {samplePlant.acquired_date
                        ? new Date(
                            samplePlant.acquired_date,
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Last Watered
                    </h3>
                    <p>3 days ago</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Notes</h2>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-line">
                      {samplePlant.notes || "No notes yet."}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Growth Timeline</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Entry
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="relative h-48 bg-gray-100">
                            <Image
                              src={`https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80`}
                              alt="Plant growth"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">
                                {new Date(
                                  Date.now() - i * 30 * 24 * 60 * 60 * 1000,
                                ).toLocaleDateString()}
                              </h4>
                              <span className="text-xs text-gray-500">
                                Entry #{i}
                              </span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Height:</span>{" "}
                                {20 + i * 5} cm
                              </div>
                              <div>
                                <span className="text-gray-500">Leaves:</span>{" "}
                                {5 + i} leaves
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Care History</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Task
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-100">
                      {[
                        {
                          type: "water",
                          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                          notes: "Regular watering",
                        },
                        {
                          type: "fertilize",
                          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                          notes: "Used organic fertilizer",
                        },
                        {
                          type: "water",
                          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                          notes: "Light watering",
                        },
                      ].map((task, i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              task.type === "water"
                                ? "bg-blue-50"
                                : "bg-amber-50"
                            }`}
                          >
                            {task.type === "water" ? (
                              <Droplet size={20} className="text-blue-500" />
                            ) : (
                              <Leaf size={20} className="text-amber-500" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {task.type === "water"
                                  ? "Watered"
                                  : "Fertilized"}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {task.date.toLocaleDateString()} - {task.notes}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative h-64 w-full bg-gray-100">
              {plant.image_url ? (
                <Image
                  src={plant.image_url}
                  alt={plant.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-green-50">
                  <Leaf size={64} className="text-green-200" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold">{plant.name}</h1>
                  <p className="text-gray-600">{plant.species}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Droplet size={16} />
                    Water
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                  >
                    <Leaf size={16} />
                    Fertilize
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                  <p>{plant.location || "Not specified"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Acquired Date
                  </h3>
                  <p>
                    {plant.acquired_date
                      ? new Date(plant.acquired_date).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Last Watered
                  </h3>
                  <p>Not available</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-line">
                    {plant.notes || "No notes yet."}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Growth Timeline</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Entry
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No growth entries yet.</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Add First Entry
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Care History</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Task
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No care history yet.</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Record Care Activity
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
