import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

export const metadata = {
  title: '利用規約 — JemRef',
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-8 sm:py-20">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          利用規約
        </h1>
        <p className="mt-2 text-sm text-slate-500">最終更新日: 2026-05-07</p>

        <p className="mt-10 text-base leading-relaxed text-body">
          （仮）本規約は、JemRef（以下「本サービス」）の提供条件およびユーザーと運営者の
          間の権利義務関係を定めるものです。
        </p>

        <p className="mt-6 text-base leading-relaxed text-body">
          （仮）ユーザーは、Google アカウントを用いて本サービスに登録するものとします。
          登録時に提供された情報の真正性については、ユーザー自身が責任を負うものとします。
        </p>

        <p className="mt-6 text-base leading-relaxed text-body">
          （仮）法令違反、他者の権利侵害、サービスの不正利用、システムへの過度な負荷を
          かける行為などを禁止します。
        </p>

        <p className="mt-6 text-base leading-relaxed text-body">
          （仮）本サービスはベータ版として提供されており、運営者は本サービスの利用により
          生じた損害について、法令で定められた範囲を除き責任を負いません。
        </p>

        <p className="mt-6 text-base leading-relaxed text-body">
          （仮）運営者は、必要と判断した場合に本規約を変更することがあります。変更後の
          規約は、サービス上で告知した時点から効力を生じるものとします。
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
