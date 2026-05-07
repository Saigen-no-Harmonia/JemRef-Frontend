import { RecordList } from '@/features/records'

export default async function RecordsPage() {
  return (
    <>
      <h1>書誌情報</h1>
      <div>
        <RecordList />
      </div>
    </>
  )
}
