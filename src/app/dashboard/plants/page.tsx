import DashboardNavbar from "@/components/dashboard-navbar";
import { Plus, Leaf, Search, Filter, ArrowUpDown } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";

export default async function PlantsPage() {
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

  // Sample plants for initial UI if no plants exist
  const samplePlants = [
    {
      id: "sample-1",
      name: "Monstera Deliciosa",
      species: "Monstera Deliciosa",
      image_url:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80",
      location: "Living Room",
      acquired_date: "2023-01-15",
    },
    {
      id: "sample-2",
      name: "Snake Plant",
      species: "Sansevieria Trifasciata",
      image_url:
        "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&q=80",
      location: "Bedroom",
      acquired_date: "2023-03-22",
    },
    {
      id: "sample-3",
      name: "Fiddle Leaf Fig",
      species: "Ficus Lyrata",
      image_url:
        "https://images.unsplash.com/photo-1597055181449-b9d2a4598b52?w=400&q=80",
      location: "Office",
      acquired_date: "2022-11-05",
    },
    {
      id: "sample-4",
      name: "Pothos",
      species: "Epipremnum Aureum",
      image_url:
        "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=400&q=80",
      location: "Kitchen",
      acquired_date: "2023-05-10",
    },
    {
      id: "sample-5",
      name: "Peace Lily",
      species: "Spathiphyllum",
      image_url:
        "https://images.unsplash.com/photo-1616690248363-76f93926cf6e?w=400&q=80",
      location: "Bathroom",
      acquired_date: "2023-02-28",
    },
    {
      id: "sample-6",
      name: "ZZ Plant",
      species: "Zamioculcas Zamiifolia",
      image_url:
        "https://images.unsplash.com/photo-1632207691143-7ee8c82f6e9f?w=400&q=80",
      location: "Home Office",
      acquired_date: "2022-12-12",
    },
  ];

  const displayPlants = plants && plants.length > 0 ? plants : samplePlants;

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Plants</h1>
              <p className="text-gray-600 mt-1">
                Manage your entire plant collection
              </p>
            </div>
            <Link href="/dashboard/plants/add">
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Plus size={16} />
                Add New Plant
              </Button>
            </Link>
          </header>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search plants by name or species..."
                className="pl-10 bg-white border-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown size={16} />
                Sort
              </Button>
            </div>
          </div>

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
                    <div className="mt-2 space-y-1">
                      {plant.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="font-medium">Location:</span>{" "}
                          {plant.location}
                        </p>
                      )}
                      {plant.acquired_date && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="font-medium">Acquired:</span>{" "}
                          {new Date(plant.acquired_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Link href={`/dashboard/plants/${plant.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/dashboard/plants/${plant.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Plant Card */}
              <Link href="/dashboard/plants/add" className="block">
                <div className="bg-white rounded-xl overflow-hidden border border-dashed border-gray-300 flex flex-col items-center justify-center h-[320px] hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <Plus size={24} className="text-green-600" />
                  </div>
                  <p className="font-medium text-gray-700">Add New Plant</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Track growth and care
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
