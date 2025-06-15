
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Assuming shadcn/ui

interface AuthButtonProps {
  user?: { email?: string | null } | null; // Pass user if already fetched server-side
  type?: "button" | "icon";
}

export default function AuthButton({ user, type = "button" }: AuthButtonProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // Ensure server components re-render
  };

  // If user prop is not passed, this component would need to fetch it client-side
  // or be part of a context provider. For simplicity, assuming it might be passed or
  // this button is used where user status is known (e.g. on dashboard).

  if (type === "icon") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user?.email && <DropdownMenuLabel>{user.email}</DropdownMenuLabel>}
          {!user?.email && <DropdownMenuLabel>My Account</DropdownMenuLabel>}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
            Billing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={handleSignOut} variant="outline">
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  );
}
