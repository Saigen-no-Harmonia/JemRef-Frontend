import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export const metadata = {
  title: 'プライバシーポリシー — JemRef',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-8 sm:py-20">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          プライバシーポリシー
        </h1>
        <p className="mt-2 text-sm text-slate-500">最終更新日: 2026-05-07</p>

        <p className="mt-10 text-base leading-relaxed text-body">
          （仮）本サービスは、Google ログインを通じてユーザーの基本プロフィール
          （メールアドレス、表示名、アバター画像 URL）を取得します。また、本サービス内で
          ユーザーが登録した書誌情報を保存します。
        </p>

        <p className="mt-6 text-base leading-relaxed text-body">
          （仮）取得した情報は、本人確認、書誌情報の管理機能の提供、およびサービス改善の
          ために利用します。法令に基づく場合を除き、本人の同意なく取得した情報を第三者に
          提供することはありません。
        </p>

        <p className="mt-6 text-base leading-relaxed text-body">
          （仮）本ポリシーに関するお問い合わせは、サービス運営者までご連絡ください。
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
