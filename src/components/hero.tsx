import Link from "next/link";
import { ArrowUpRight, Camera, Droplet, Leaf, Flower } from "lucide-react";
import Image from "next/image";
import { createClient } from "../../supabase/server";

export default async function Hero() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                Your Personal{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Plant Care
                </span>{" "}
                Companion
              </h1>

              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Track growth, get care reminders, and watch your plants thrive
                with our AI-powered plant journal app.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={user ? "/dashboard" : "/sign-up"}
                  className="inline-flex items-center px-8 py-4 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                >
                  {user ? "Go to Dashboard" : "Start Your Garden"}
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="#features"
                  className="inline-flex items-center px-8 py-4 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
                >
                  Learn More
                </Link>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-green-500" />
                  <span>AI Plant Recognition</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-green-500" />
                  <span>Smart Care Reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flower className="w-5 h-5 text-green-500" />
                  <span>Growth Timeline</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative mt-12 lg:mt-0">
              <div className="relative w-full max-w-md mx-auto">
                <Image
                  src="https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80"
                  width={600}
                  height={500}
                  alt="Plant care app"
                  className="rounded-xl shadow-xl z-10 relative"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-green-100 rounded-full z-0"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-emerald-100 rounded-full z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
