
import { createClient } from "@/lib/supabase/server"; // You'll create this
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you add button from shadcn/ui

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Imagee Floppa!
        </h1>
        <p className="text-xl text-muted-foreground">
          Your new favorite place to upload and share images.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
