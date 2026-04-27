export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Navbar /> will go here in Step 5 */}
      <main className="flex-1">{children}</main>
      {/* <Footer /> will go here in Step 5 */}
    </div>
  );
}
