
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

export function QuickUploadWidget() {
  // This could be a simplified version of the /dashboard/upload page logic
  // or just a link to it.
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Upload</CardTitle>
        <CardDescription>Drag & drop files here or click to select.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {/* Placeholder for a mini drag-and-drop area */}
        <div className="p-6 border-2 border-dashed rounded-md mb-4">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            This is a placeholder. Implement drag & drop or link to the full upload page.
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
          <Link href="/dashboard/upload">
            <Upload className="w-4 h-4 mr-2" /> Go to Upload Page
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
