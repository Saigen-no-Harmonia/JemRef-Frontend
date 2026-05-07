import { LogoutButton } from "@/features/auth"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <LogoutButton />
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}
