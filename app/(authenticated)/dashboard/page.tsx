import DashboardContent from "./dashboard-content"

export const dynamic = "force-dynamic"
export const dynamicParams = true
export const revalidate = 0

export default function DashboardPage() {
  return <DashboardContent />
}
