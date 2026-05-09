import { SettingsPanel } from '@/features/auth'

export const metadata = {
  title: 'アカウント設定 — JemRef',
}

export default function SettingsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold text-slate-900">アカウント設定</h1>
      <div className="mt-8">
        <SettingsPanel />
      </div>
    </>
  )
}
