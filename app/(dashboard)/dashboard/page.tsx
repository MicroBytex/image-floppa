
import { requireAuth, UserProfile } from "@/lib/auth"; // Updated auth import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming shadcn/ui
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Images, FolderOpen, HardDrive, Activity, Upload, Eye, Heart, Share2, Sparkles, BarChart3, Clock, Star, Copy, Download, Link as LinkIcon, UserCircle, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { QuickUploadWidget } from "@/components/quick-upload-widget";
import { StorageAnalytics } from "@/components/storage-analytics";
import { formatBytes } from "@/lib/utils"; // Moved formatBytes to utils
import { createClient } from "@/lib/supabase/server"; // For server-side data fetching
import AuthButton from "@/components/auth-button"; // For logout

export const dynamic = "force-dynamic";
export const revalidate = 0; // Revalidate on every request

// Placeholder types for stats - you'll define these based on your Supabase queries
interface ImageStats {
  total_images: number;
  total_size: number;
  avg_size: number;
  recent_uploads: number; // e.g., in last 7 days
}

interface ProjectStats {
  total_projects: number;
  recent_projects: number; // e.g., in last 7 days
}

interface RecentImage {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
  // Add other relevant fields
}

// Mocked user data for now, replace with actual data from Supabase
const MOCK_USER_PROFILE: UserProfile = {
    id: "mock-user-id",
    email: "user@example.com",
    name: "Mock User",
    plan: "pro", // 'free', 'pro', 'enterprise'
    storage_limit: 10 * 1024 * 1024 * 1024, // 10 GB
    storage_used: 2 * 1024 * 1024 * 1024, // 2 GB
};


async function getDashboardData(userId: string): Promise<{
  imageStats: ImageStats;
  projectStats: ProjectStats;
  recentImages: RecentImage[];
}> {
  const supabase = createClient();

  // TODO: Implement actual Supabase queries
  // Example: Fetch total images and size for the user
  // const { count: totalImagesCount, error: imagesError } = await supabase
  //   .from('images')
  //   .select('*', { count: 'exact', head: true })
  //   .eq('user_id', userId);

  // const { data: totalSizeData, error: sizeError } = await supabase
  //   .rpc('get_user_total_storage', { p_user_id: userId }); // Assuming a PG function

  // For now, returning mock data
  const imageStats: ImageStats = {
    total_images: 125,
    total_size: 5 * 1024 * 1024 * 1024, // 5 GB
    avg_size: (5 * 1024 * 1024 * 1024) / 125,
    recent_uploads: 15,
  };

  const projectStats: ProjectStats = {
    total_projects: 5,
    recent_projects: 1,
  };

  const recentImages: RecentImage[] = [
    { id: "1", name: "sunset.jpg", url: "https://placehold.co/600x400/orange/white?text=Sunset", size: 1024 * 500, created_at: new Date().toISOString() },
    { id: "2", name: "mountains.png", url: "https://placehold.co/600x400/blue/white?text=Mountains", size: 1024 * 800, created_at: new Date().toISOString() },
    // Add more mock images
  ];

  console.log(\`Fetching data for user: \${userId}\`); // Keep this for debugging

  return { imageStats, projectStats, recentImages };
}


export default async function DashboardPage() {
  const userProfile = await requireAuth(); // This should fetch enriched user profile

  // If requireAuth only returns basic user, fetch profile details separately
  // For now, we'll merge with mock data or assume requireAuth provides it
  const user = { ...MOCK_USER_PROFILE, ...userProfile };


  // Fetch stats using Supabase (or use mock data for now)
  const { imageStats, projectStats, recentImages } = await getDashboardData(user.id);

  const totalImages = imageStats.total_images || 0;
  const totalSize = imageStats.total_size || 0;
  // const avgSize = imageStats.avg_size || 0; // Calculate if needed
  // const recentUploads = imageStats.recent_uploads || 0;
  const totalProjects = projectStats.total_projects || 0;
  // const recentProjects = projectStats.recent_projects || 0;

  const storagePercentage = user.storage_limit > 0 ? (user.storage_used / user.storage_limit) * 100 : 0;
  const planColor =
    user.plan === "enterprise"
      ? "from-yellow-500 to-orange-500"
      : user.plan === "pro"
      ? "from-purple-500 to-pink-500"
      : "from-blue-500 to-cyan-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Welcome back, {user.name || user.email}! 👋
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Upload images and get direct links instantly.
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge className={`bg-gradient-to-r ${planColor} text-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold`}>
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> {user.plan.toUpperCase()} PLAN
              </Badge>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" asChild>
                <Link href="/dashboard/upload">
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Link>
              </Button>
              <AuthButton type="icon" />
            </div>
          </div>
        </div>

        {/* Quick Upload Widget - Placeholder */}
        <div className="mb-8">
          <QuickUploadWidget />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
            <TabsTrigger value="overview"><BarChart3 className="w-4 h-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="my-images"><Images className="w-4 h-4 mr-2" />My Images</TabsTrigger>
            <TabsTrigger value="projects"><FolderOpen className="w-4 h-4 mr-2" />Projects</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                  <Images className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalImages}</div>
                  <p className="text-xs text-muted-foreground">Across all your projects</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Storage Used</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatBytes(totalSize)}</div>
                  <p className="text-xs text-muted-foreground">Out of {formatBytes(user.storage_limit)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProjects}</div>
                  <p className="text-xs text-muted-foreground">Manage your image collections</p>
                </CardContent>
              </Card>
            </div>

            {/* Storage Usage Progress */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>You've used {formatBytes(user.storage_used)} of {formatBytes(user.storage_limit)}.</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={storagePercentage} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{storagePercentage.toFixed(2)}%</span>
                  <Link href="/settings/billing" className="text-purple-600 hover:underline">Upgrade Plan</Link>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder for StorageAnalytics component */}
            <StorageAnalytics userId={user.id} />
          </TabsContent>

          <TabsContent value="my-images">
            <Card>
              <CardHeader>
                <CardTitle>My Recent Images</CardTitle>
                <CardDescription>Your latest uploads. Click to manage.</CardDescription>
              </CardHeader>
              <CardContent>
                {recentImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {recentImages.map((img) => (
                      <div key={img.id} className="group relative">
                        <img src={img.url} alt={img.name} className="aspect-square w-full rounded-md object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                          <p className="text-white text-xs text-center truncate w-full">{img.name}</p>
                          <div className="flex space-x-2 mt-1">
                            <Button size="icon" variant="ghost" className="text-white hover:text-purple-300 h-6 w-6"><Copy className="h-3 w-3"/></Button>
                            <Button size="icon" variant="ghost" className="text-white hover:text-purple-300 h-6 w-6"><LinkIcon className="h-3 w-3"/></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent images. <Link href="/dashboard/upload" className="text-purple-600 hover:underline">Upload some now!</Link></p>
                )}
                <div className="mt-6 text-center">
                    <Button variant="outline">View All Images</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
             <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Organize your images into projects. (Feature coming soon!)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Project management functionality will be here. You'll be able to create, view, and manage your image projects.</p>
                 <Button className="mt-4">Create New Project</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
             <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account, plan, and preferences. (Feature coming soon!)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Account settings, billing information, API keys, and other preferences will be managed here.</p>
                <div className="space-y-4 mt-4">
                    <div><Link href="/settings/profile"><Button variant="outline" className="w-full justify-start"><UserCircle className="mr-2 h-4 w-4"/> Profile Settings</Button></Link></div>
                    <div><Link href="/settings/billing"><Button variant="outline" className="w-full justify-start"><Star className="mr-2 h-4 w-4"/> Plan & Billing</Button></Link></div>
                    <div><Link href="/settings/api-keys"><Button variant="outline" className="w-full justify-start"><HardDrive className="mr-2 h-4 w-4"/> API Keys</Button></Link></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
