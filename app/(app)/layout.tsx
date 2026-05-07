export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <button>ログアウト</button>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}
