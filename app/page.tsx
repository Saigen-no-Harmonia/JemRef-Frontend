import Image from "next/image"
import { redirect } from 'next/navigation'
import { getIDToken } from "@/lib/auth/session"
import { GoogleLoginButton } from "@/features/auth/components/GoogleLoginButton"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { SiteFooter } from "@/components/layout/SiteFooter"

export default async function Home() {
  const IDToken = await getIDToken()
  if (IDToken) redirect('/records')

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="order-2 md:order-1">
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                和文文献を、
                <br />
                はやく、正確に、
                <br />
                ストレスなく。
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-body">
                JemRef は和文文献に特化した文献管理サービスです。
                メモ帳・Excel・Notion より速く、
                研究のための書誌情報を整理・検索・共有できます。
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <GoogleLoginButton className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-500 px-4 text-base font-medium text-white transition-colors hover:bg-primary-700">
                  Googleで始める
                </GoogleLoginButton>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src="/top.webp"
                alt="文献を整理する人々のイラスト"
                width={640}
                height={640}
                priority
                className="mx-auto h-auto w-full max-w-md md:max-w-none"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                JemRef が大切にする 3 つのこと
              </h2>
              <p className="mt-3 text-base leading-relaxed text-body">
                和文研究の現場で、文献管理を本来の研究のための時間に変えるために。
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-medium text-primary-600">01</div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  和文文献に特化
                </h3>
                <p className="mt-3 text-base leading-relaxed text-body">
                  既存ツールが手薄だった日本語の書誌情報に正面から向き合い、
                  迷わず登録・検索できる設計にしています。
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-medium text-primary-600">02</div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  研究の裾野を広げる
                </h3>
                <p className="mt-3 text-base leading-relaxed text-body">
                  大学契約に依らず、学生もアマチュア研究者も、
                  本格的な文献管理ツールを使いはじめられます。
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-medium text-primary-600">03</div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  良質な文献を共有財産に
                </h3>
                <p className="mt-3 text-base leading-relaxed text-body">
                  専門領域での読書情報の交換を、所属や面識の壁を越えて、
                  ゆるやかに行えるハブを目指します。
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              あなたの研究を、文献整理から変える。
            </h2>
            <p className="mt-4 text-base leading-relaxed text-body">
              アカウント登録は数十秒。今すぐ JemRef をはじめましょう。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <GoogleLoginButton className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-500 px-4 text-base font-medium text-white transition-colors hover:bg-primary-700">
                Googleで始める
              </GoogleLoginButton>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
