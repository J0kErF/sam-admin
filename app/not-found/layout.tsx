// app/not-found/layout.tsx

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // No layout wrapping
}
