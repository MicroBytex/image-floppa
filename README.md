
# imagee-floppa-nextjs

Image hosting platform inspired by Uploadcare, built with Next.js, Supabase, and Vercel Blob.

## Getting Started

1.  **Clone the repository (or use this generated structure).**

2.  **Set up Supabase:**
    *   Create a new project on [Supabase](https://supabase.com/).
    *   In your Supabase project, go to "Authentication" -> "Providers" and enable Google (or other providers you want).
    *   You'll need your project's URL and anon key.
    *   Consider creating tables for:
        *   `profiles` (to store user-specific data like plan, storage limits, linked to `auth.users`).
        *   `images` (to store metadata about uploaded images: user_id, name, url, size, type, created_at).
        *   `projects` (if you implement project functionality: user_id, name, created_at).

3.  **Set up Vercel Blob:**
    *   Integrate Vercel Blob with your Vercel project.
    *   Obtain a `BLOB_READ_WRITE_TOKEN`.

4.  **Configure Environment Variables:**
    *   Copy `.env.local.example` to `.env.local`.
    *   Fill in your Supabase URL, anon key, and Vercel Blob token.
    *   `cp .env.local.example .env.local`

5.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

6.  **Set up Shadcn/UI (Optional, but recommended for the desired style):**
    *   Initialize Shadcn/UI:
        ```bash
        npx shadcn-ui@latest init
        ```
    *   Follow the prompts. You can choose your preferred style and base color.
    *   Add components as needed, for example:
        ```bash
        npx shadcn-ui@latest add button card input label progress badge tabs
        ```

7.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Open http://localhost:3000 with your browser.

## Project Structure

*   `app/`: Next.js App Router.
    *   `(auth)/`: Routes related to authentication.
    *   `(dashboard)/`: Protected routes for logged-in users.
    *   `api/`: API routes (e.g., for image uploads).
*   `components/`: React components.
    *   `ui/`: Shadcn/UI components (after running `npx shadcn-ui@latest add ...`).
*   `lib/`: Helper functions, Supabase client, Vercel Blob utilities.
*   `public/`: Static assets.

## Next Steps

*   Implement Supabase authentication (login, signup, Google OAuth).
*   Develop the image upload functionality using Vercel Blob (`@vercel/blob`).
*   Build out the UI components (`QuickUploadWidget`, `StorageAnalytics`, etc.).
*   Create database schemas and queries in Supabase for storing image metadata, user data, and project data.
*   Implement the "projects" feature.
*   Style the application using Tailwind CSS and Shadcn/UI.
