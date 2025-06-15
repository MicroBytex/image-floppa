
"use client"; // This page will be highly interactive

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // For file input styling if needed
import { Progress } from '@/components/ui/progress';
import { UploadCloud, FileImage, XCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"; // Assuming shadcn/ui toaster

interface UploadedFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).map(file => ({
        file,
        progress: 0,
        status: 'pending' as 'pending' | 'uploading' | 'success' | 'error',
      }));
      setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(prevFiles => prevFiles.filter(f => f.file.name !== fileName));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast({ title: "No files selected", description: "Please select some images to upload.", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    // Update status for all pending files to 'uploading'
    setSelectedFiles(prevFiles => 
      prevFiles.map(f => f.status === 'pending' ? { ...f, status: 'uploading' } : f)
    );

    for (let i = 0; i < selectedFiles.length; i++) {
      const currentFile = selectedFiles[i];
      // Skip already processed files
      if (currentFile.status !== 'pending' && currentFile.status !== 'uploading') continue;
      // If it was pending, mark as uploading
      if (currentFile.status === 'pending') {
         setSelectedFiles(prevFiles =>
            prevFiles.map((f, index) =>
              index === i ? { ...f, status: 'uploading' } : f
            )
          );
      }


      try {
        const formData = new FormData();
        formData.append('file', currentFile.file);

        // Simulate progress for demo. Replace with actual progress from XHR if possible.
        // For Vercel Blob, progress might be harder to track client-side without custom logic.
        // We'll update progress in chunks.
        for (let p = 0; p <= 100; p += 20) {
            await new Promise(res => setTimeout(res, 100)); // Simulate network latency
            setSelectedFiles(prevFiles =>
                prevFiles.map((f, index) =>
                  index === i ? { ...f, progress: p } : f
                )
            );
        }

        const response = await fetch('/api/upload', { // Your API endpoint
          method: 'POST',
          body: formData,
          // Headers might be needed if you pass tokens, etc.
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json(); // Expect { url: '...' } from Vercel Blob

        setSelectedFiles(prevFiles =>
          prevFiles.map((f, index) =>
            index === i ? { ...f, status: 'success', url: result.url, progress: 100 } : f
          )
        );
        toast({ title: "Upload Successful!", description: `${currentFile.file.name} uploaded.` });

      } catch (error: any) {
        setSelectedFiles(prevFiles =>
          prevFiles.map((f, index) =>
            index === i ? { ...f, status: 'error', error: error.message, progress: 0 } : f
          )
        );
        toast({ title: "Upload Failed", description: `${currentFile.file.name}: ${error.message}`, variant: "destructive" });
      }
    }
    setIsUploading(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upload New Images</CardTitle>
          <CardDescription>Select multiple images to upload to Vercel Blob.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-muted/20"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP up to 10MB (configurable)</p>
              </div>
              <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} accept="image/png, image/jpeg, image/gif, image/webp" />
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Selected Files:</h3>
              {selectedFiles.map((uploadedFile, index) => (
                <div key={index} className="p-3 border rounded-md bg-muted/30 dark:bg-muted/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileImage className="w-6 h-6 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-xs sm:max-w-md">{uploadedFile.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(uploadedFile.file.size / 1024)} KB
                        </p>
                      </div>
                    </div>
                    {uploadedFile.status === 'pending' && (
                       <Button variant="ghost" size="icon" onClick={() => removeFile(uploadedFile.file.name)} disabled={isUploading}>
                        <XCircle className="w-5 h-5 text-red-500" />
                      </Button>
                    )}
                    {uploadedFile.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {uploadedFile.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                  {(uploadedFile.status === 'uploading' || uploadedFile.status === 'success') && uploadedFile.progress > 0 && (
                    <Progress value={uploadedFile.progress} className="mt-2 h-2" />
                  )}
                  {uploadedFile.status === 'error' && uploadedFile.error && (
                    <p className="text-xs text-red-500 mt-1">{uploadedFile.error}</p>
                  )}
                   {uploadedFile.status === 'success' && uploadedFile.url && (
                    <p className="text-xs text-blue-500 mt-1 truncate">
                      URL: <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{uploadedFile.url}</a>
                    </p>
                  )}
                </div>
              ))}
              <Button onClick={handleUpload} disabled={isUploading || selectedFiles.every(f => f.status === 'success' || f.status === 'error')} className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                {isUploading ? 'Uploading...' : `Upload ${selectedFiles.filter(f=>f.status === 'pending').length} File(s)`}
              </Button>
            </div>
          )}
           <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
