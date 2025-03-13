import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Mail, Calendar } from "lucide-react";
import ProfileAvatarUpload from "@/components/profile-avatar-upload";

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // If no user is found, redirect to login page
  if (!user || error) {
    return redirect("/sign-in");
  }
  
  // Get additional user data from the users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  
  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <ProfileAvatarUpload 
                    userId={user.id} 
                    avatarUrl={profile?.avatar_url} 
                    size="lg"
                    editable={true}
                  />
                  <div>
                    <CardTitle className="text-2xl">{profile?.full_name || "Plant Lover"}</CardTitle>
                    <CardDescription>Member since {new Date(user.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Account created on
                    </div>
                    <div className="font-medium">{new Date(user.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">About me</h3>
                  <p className="text-gray-600">
                    {profile?.bio || "No biography available. Edit your profile to tell more about yourself."}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/profile/edit">Edit Profile</Link>
                  </Button>
                  <form action={signOutAction}>
                    <Button variant="destructive" type="submit">Sign Out</Button>
                  </form>
                </div>
              </CardFooter>
            </Card>
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">My Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {profile?.plants_count || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Plants</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {profile?.watering_count || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Waterings</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">
                        {profile?.fertilizing_count || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Fertilizations</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 