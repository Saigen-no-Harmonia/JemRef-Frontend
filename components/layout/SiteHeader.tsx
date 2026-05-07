import Image from 'next/image'
import Link from 'next/link'
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link href="/" aria-label="JemRef ホーム" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="JemRef"
            width={120}
            height={34}
            priority
          />
        </Link>
        <nav className="flex items-center gap-3">
          <GoogleLoginButton className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-500 px-4 text-base font-medium text-white transition-colors hover:bg-primary-700">
            Googleで始める
          </GoogleLoginButton>
        </nav>
      </div>
    </header>
  )
}
