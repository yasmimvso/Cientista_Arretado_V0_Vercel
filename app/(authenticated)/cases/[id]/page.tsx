import CaseDetailContent from "./case-detail-content"

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

export default async function CaseDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CaseDetailContent caseId={id} />
}
