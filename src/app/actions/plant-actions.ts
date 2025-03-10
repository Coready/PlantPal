"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export async function deletePlant(plantId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // First delete any related care tasks
  await supabase.from("care_tasks").delete().eq("plant_id", plantId);

  // Then delete any plant entries
  await supabase.from("plant_entries").delete().eq("plant_id", plantId);

  // Finally delete the plant
  const { error } = await supabase.from("plants").delete().eq("id", plantId);

  if (error) {
    console.error("Error deleting plant:", error);
    return { success: false, error: error.message };
  }

  return redirect("/dashboard/plants");
}

export async function recordCareTask(formData: FormData) {
  const supabase = await createClient();

  const plantId = formData.get("plant_id") as string;
  const taskType = formData.get("task_type") as string;
  const notes = formData.get("notes") as string;
  const completed = true;
  const completedDate = new Date().toISOString();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { error } = await supabase.from("care_tasks").insert({
    plant_id: plantId,
    task_type: taskType,
    notes,
    completed,
    completed_date: completedDate,
    due_date: completedDate, // Since it's completed immediately
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error recording care task:", error);
    return { success: false, error: error.message };
  }

  return redirect(`/dashboard/plants/${plantId}`);
}

export async function addGrowthEntry(formData: FormData) {
  const supabase = await createClient();

  const plantId = formData.get("plant_id") as string;
  const height = parseFloat(formData.get("height") as string) || null;
  const numLeaves = parseInt(formData.get("num_leaves") as string) || null;
  const notes = formData.get("notes") as string;
  const imageUrl = (formData.get("image_url") as string) || null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { error } = await supabase.from("plant_entries").insert({
    plant_id: plantId,
    height,
    num_leaves: numLeaves,
    notes,
    image_url: imageUrl,
    entry_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error adding growth entry:", error);
    return { success: false, error: error.message };
  }

  return redirect(`/dashboard/plants/${plantId}`);
}
