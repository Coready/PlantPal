import DashboardNavbar from "@/components/dashboard-navbar";
import { InfoIcon, Plus, Leaf, Droplet, Search } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's plants
  const { data: plants, error } = await supabase
    .from("plants")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch upcoming care tasks
  const { data: careTasks } = await supabase
    .from("care_tasks")
    .select("*, plants(name)")
    .eq("completed", false)
    .order("due_date", { ascending: true })
    .limit(5);

  // Sample plants for initial UI if no plants exist
  const samplePlants = [
    {
      id: "sample-1",
      name: "Monstera Deliciosa",
      species: "Monstera Deliciosa",
      image_url:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80",
      location: "Living Room",
    },
    {
      id: "sample-2",
      name: "Snake Plant",
      species: "Sansevieria Trifasciata",
      image_url:
        "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&q=80",
      location: "Bedroom",
    },
    {
      id: "sample-3",
      name: "Fiddle Leaf Fig",
      species: "Ficus Lyrata",
      image_url:
        "https://images.unsplash.com/photo-1597055181449-b9d2a4598b52?w=400&q=80",
      location: "Office",
    },
  ];

  // Sample care tasks
  const sampleTasks = [
    {
      id: "task-1",
      task_type: "water",
      due_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      plants: { name: "Monstera Deliciosa" },
    },
    {
      id: "task-2",
      task_type: "fertilize",
      due_date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
      plants: { name: "Fiddle Leaf Fig" },
    },
  ];

  const displayPlants = plants && plants.length > 0 ? plants : samplePlants;
  const displayTasks =
    careTasks && careTasks.length > 0 ? careTasks : sampleTasks;

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Plant Collection</h1>
              <p className="text-gray-600 mt-1">
                Track and manage your plants in one place
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Search size={16} />
                Search Plants
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Plus size={16} />
                Add New Plant
              </Button>
            </div>
          </header>

          {/* Plants Grid */}
          <section className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 w-full bg-gray-100">
                    {plant.image_url ? (
                      <Image
                        src={plant.image_url}
                        alt={plant.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-green-50">
                        <Leaf size={48} className="text-green-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{plant.name}</h3>
                    <p className="text-sm text-gray-600">
                      {plant.species || "Unknown species"}
                    </p>
                    {plant.location && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <span>Location:</span> {plant.location}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Droplet size={14} className="mr-1" />
                        Water
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Plant Card */}
              <div className="bg-white rounded-xl overflow-hidden border border-dashed border-gray-300 flex flex-col items-center justify-center h-[320px] hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <Plus size={24} className="text-green-600" />
                </div>
                <p className="font-medium text-gray-700">Add New Plant</p>
                <p className="text-sm text-gray-500 mt-1">
                  Track growth and care
                </p>
              </div>
            </div>
          </section>

          {/* Upcoming Care Tasks */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Care Tasks</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {displayTasks.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {displayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${task.task_type === "water" ? "bg-blue-50" : "bg-amber-50"}`}
                        >
                          {task.task_type === "water" ? (
                            <Droplet size={20} className="text-blue-500" />
                          ) : (
                            <Leaf size={20} className="text-amber-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {task.task_type === "water" ? "Water" : "Fertilize"}{" "}
                            {task.plants?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Mark Complete
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Droplet size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">
                    No Upcoming Tasks
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Your plants are all taken care of!
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Tips */}
          <section className="mt-8 bg-green-50 rounded-xl p-6 border border-green-100">
            <h2 className="text-xl font-semibold mb-3">Plant Care Tips</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800">Watering Basics</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Most houseplants prefer to dry out slightly between waterings.
                  Check soil moisture before watering.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800">
                  Light Requirements
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Pay attention to each plant's light needs. Most plants prefer
                  bright, indirect light.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800">Seasonal Changes</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Adjust care routines with the seasons. Most plants need less
                  water in winter.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
