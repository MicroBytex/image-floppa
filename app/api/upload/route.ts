
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // For auth check & metadata storage

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  // Optional: Add file type/size validation here
  // const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  // if (file.size > MAX_FILE_SIZE) {
  //   return NextResponse.json({ error: `File size exceeds limit of ${MAX_FILE_SIZE / (1024*1024)}MB` }, { status: 400 });
  // }
  // const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  // if (!ALLOWED_TYPES.includes(file.type)) {
  //    return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 });
  // }


  try {
    // Sanitize filename (important!)
    const filename = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const blob = await put(filename, file, {
      access: 'public', // Makes the blob publicly accessible via its URL
      // addRandomSuffix: false, // Consider if you want predictable URLs or unique ones
      // cacheControlMaxAge: 31536000, // Cache for 1 year
    });

    // TODO: Store blob metadata (blob.url, filename, size, type, user_id) in your Supabase 'images' table
    // Example:
    // const { error: dbError } = await supabase.from('images').insert({
    //   user_id: user.id,
    //   name: file.name,
    //   url: blob.url,
    //   pathname: blob.pathname, // Store pathname if you need to delete later
    //   size: file.size,
    //   type: file.type,
    //   // project_id: form.get('projectId') // If uploading to a specific project
    // });
    // if (dbError) {
    //   console.error('Supabase DB error:', dbError);
    //   // Potentially delete the blob if DB insert fails to avoid orphaned files
    //   // await del(blob.url); // Requires careful error handling
    //   return NextResponse.json({ error: 'Failed to save image metadata.' }, { status: 500 });
    // }

    return NextResponse.json(blob); // Returns { url, pathname, contentType, contentDisposition }

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file.' }, { status: 500 });
  }
}
