import DashboardNavbar from "@/components/dashboard-navbar";
import { Plus, Leaf, Droplet, Calendar, CheckCircle2, Filter } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function TasksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch upcoming care tasks
  const { data: careTasks } = await supabase
    .from('care_tasks')
    .select('*, plants(name, image_url)')
    .eq('completed', false)
    .order('due_date', { ascending: true });

  // Sample care tasks for initial UI
  const sampleTasks = [
    {
      id: 'task-1',
      task_type: 'water',
      due_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      plants: { 
        name: 'Monstera Deliciosa',
        image_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&q=80'
      }
    },
    {
      id: 'task-2',
      task_type: 'fertilize',
      due_date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
      plants: { 
        name: 'Fiddle Leaf Fig',
        image_url: 'https://images.unsplash.com/photo-1597055181449-b9d2a4598b52?w=400&q=80'
      }
    },
    {
      id: 'task-3',
      task_type: 'water',
      due_date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      plants: { 
        name: 'Snake Plant',
        image_url: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400&q=80'
      }
    },
    {
      id: 'task-4',
      task_type: 'prune',
      due_date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
      plants: { 
        name: 'Pothos',
        image_url: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=400&q=80'
      }
    },
    {
      id: 'task-5',
      task_type: 'water',
      due_date: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
      plants: { 
        name: 'Peace Lily',
        image_url: 'https://images.unsplash.com/photo-1616690248363-76f93926cf6e?w=400&q=80'
      }
    },
  ];

  const displayTasks = careTasks && careTasks.length > 0 ? careTasks : sampleTasks;

  // Group tasks by date
  const groupedTasks = displayTasks.reduce((acc, task) => {
    const date = new Date(task.due_date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  // Get task icon based on type
  const getTaskIcon = (type) => {
    switch (type) {
      case 'water':
        return <Droplet size={20} className="text-blue-500" />;
      case 'fertilize':
        return <Leaf size={20} className="text-amber-500" />;
      case 'prune':
        return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M6 12h12"/><path d="M12 6v12"/></svg>;
      default:
        return <Leaf size={20} className="text-green-500" />;
    }
  };

  // Get task background color based on type
  const getTaskBgColor = (type) => {
    switch (type) {
      case 'water':
        return 'bg-blue-50';
      case 'fertilize':
        return 'bg-amber-50';
      case 'prune':
        return 'bg-purple-50';
      default:
        return 'bg-green-50';
    }
  };

  // Format task type for display
  const formatTaskType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Care Tasks</h1>
              <p className="text-gray-600 mt-1">Keep track of all your plant care activities</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filter
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Plus size={16} />
                Add Task
              </Button>
            </div>
          </header>

          {/* Tasks Calendar View */}
          <section className="mt-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar size={20} />
                  Upcoming Tasks
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Today</Button>
                  <Button variant="outline" size="sm">This Week</Button>
                  <Button variant="outline" size="sm">This Month</Button>
                </div>
              </div>

              {Object.keys(groupedTasks).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedTasks).map(([date, tasks]) => (
                    <div key={date} className="border-t border-gray-100 pt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
                      <div className="space-y-3">
                        {tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTaskBgColor(task.task_type)}`}>
                              {getTaskIcon(task.task_type)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {formatTaskType(task.task_type)} {task.plants?.name}
                                </p>
                                {new Date(task.due_date) < new Date() && (
                                  <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full">Overdue</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">
                                Due: {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <CheckCircle2 size={14} />
                                Complete
                              </Button>
                              <Button variant="ghost" size="sm">
                                Snooze
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <CheckCircle2 size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No Upcoming Tasks</h3>
                  <p className="text-gray-500 mt-1">Your plants are all taken care of!</p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    Create a Task
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Completed Tasks */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-600" />
              Recently Completed
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50">
                        <CheckCircle2 size