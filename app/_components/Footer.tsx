import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} JemRef</p>
        <nav className="flex items-center gap-6">
          <Link href="/privacy-policy" className="transition-colors hover:text-slate-700">
            プライバシーポリシー
          </Link>
          <Link href="/terms" className="transition-colors hover:text-slate-700">
            利用規約
          </Link>
        </nav>
      </div>
    </footer>
  )
}
