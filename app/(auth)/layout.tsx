export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-center items-center font-inter bg-gray-25">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  );
}
