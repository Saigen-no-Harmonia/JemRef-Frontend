export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
    </main>
  )
}
