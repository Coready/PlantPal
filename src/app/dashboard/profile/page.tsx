import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import DashboardNavbar from "@/components/dashboard-navbar";
import { UserCircle, Mail, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  
  // Hole den aktuellen Benutzer
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // Wenn kein Benutzer gefunden wurde, zur Login-Seite umleiten
  if (!user || error) {
    return redirect("/sign-in");
  }
  
  // Hole zusätzliche Benutzerdaten aus der users-Tabelle
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
            <h1 className="text-3xl font-bold mb-6">Mein Profil</h1>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <UserCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{profile?.full_name || "Pflanzenfreund"}</CardTitle>
                    <CardDescription>Mitglied seit {new Date(user.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-Mail
                    </div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Konto erstellt am
                    </div>
                    <div className="font-medium">{new Date(user.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Über mich</h3>
                  <p className="text-gray-600">
                    {profile?.bio || "Keine Biografie vorhanden. Bearbeite dein Profil, um mehr über dich zu erzählen."}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Zurück zum Dashboard</Link>
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/profile/edit">Profil bearbeiten</Link>
                  </Button>
                  <form action={signOutAction}>
                    <Button variant="destructive" type="submit">Abmelden</Button>
                  </form>
                </div>
              </CardFooter>
            </Card>
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Meine Statistiken</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {profile?.plants_count || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Pflanzen</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {profile?.watering_count || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Bewässerungen</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">
                        {profile?.fertilizing_count || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Düngungen</p>
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