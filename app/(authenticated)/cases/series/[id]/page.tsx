import { SerieDetailContent } from "./serie-detail-content"

export default async function SerieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <SerieDetailContent id={id} />
}
