export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#a1a1aa22_1px,transparent_1px),linear-gradient(to_bottom,#a1a1aa22_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative z-10 w-full max-w-md px-4">{children}</div>
    </div>
  );
}
