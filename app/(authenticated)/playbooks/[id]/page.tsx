import PlaybookDetailContent from "./playbook-detail-content"

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

interface PlaybookDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PlaybookDetailPage({ params }: PlaybookDetailPageProps) {
  const { id } = await params
  return <PlaybookDetailContent playbookId={id} />
}
