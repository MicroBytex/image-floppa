
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout can be simple, or include shared elements for login/signup pages
  return <>{children}</>;
}
