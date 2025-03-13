"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../../supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard-navbar";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/sign-in");
          return;
        }
        
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setFullName(profile.full_name || "");
          setBio(profile.bio || "");
        }
      } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    
    loadUserProfile();
  }, [supabase, router]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/sign-in");
        return;
      }
      
      const { error } = await supabase
        .from("users")
        .update({ 
          full_name: fullName,
          bio: bio,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profil aktualisiert",
        description: "Deine Profilinformationen wurden erfolgreich aktualisiert.",
        variant: "default",
      });
      
      router.push("/dashboard/profile");
      router.refresh();
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Profils:", error);
      toast({
        title: "Fehler",
        description: "Beim Aktualisieren des Profils ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <>
        <DashboardNavbar />
        <main className="w-full bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
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
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Profil bearbeiten</h1>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Persönliche Informationen</CardTitle>
                <CardDescription>
                  Aktualisiere deine Profilinformationen
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Name</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dein vollständiger Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Über mich</Label>
                    <Textarea 
                      id="bio" 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Erzähle etwas über dich und deine Pflanzen..."
                      rows={4}
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/profile">Abbrechen</Link>
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Wird gespeichert...
                      </>
                    ) : (
                      "Speichern"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
} 