export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      {/* Auth guard + admin sidebar will go here in Step 8 */}
      {children}
    </div>
  );
}