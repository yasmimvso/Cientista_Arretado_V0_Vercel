import { Suspense } from "react"
import InvestigacaoDetailContent from "./investigacao-detail-content"

export default function InvestigacaoDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96">Carregando...</div>}>
      <InvestigacaoDetailContent />
    </Suspense>
  )
}
