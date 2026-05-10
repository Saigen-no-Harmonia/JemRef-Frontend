import Image from 'next/image'
import Link from 'next/link'
import { getIDToken } from '@/lib/auth/session'
import { GoogleLoginButton } from '@/features/auth/components/GoogleLoginButton'
import { AccountMenu } from '@/features/auth/components/AccountMenu'

export async function Header() {
  const IDToken = await getIDToken()
  const isAuthed = !!IDToken

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        <Link
          href={isAuthed ? '/records' : '/'}
          aria-label="JemRef ホーム"
          className="flex items-center"
        >
          <Image src="/logo.svg" alt="JemRef" width={120} height={34} priority />
        </Link>

        {isAuthed ? (
          <nav aria-label="ユーザーメニュー" className="flex items-center gap-3">
            <AccountMenu />
            <Link
              href="/records/new"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary-500 pl-3 pr-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m-8-8h16" />
              </svg>
              書誌情報を登録
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-3">
            <GoogleLoginButton className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-500 px-4 text-base font-medium text-white transition-colors hover:bg-primary-700">
              Googleで始める
            </GoogleLoginButton>
          </nav>
        )}
      </div>
    </header>
  )
}
