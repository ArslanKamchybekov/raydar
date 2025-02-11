import { ClaimsList } from "./_components/ClaimsList"

export default function ClaimsPage() {
  return (
    <div>
        <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Claims</h1>
        </div>
        <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
            Browse through the items that have been found on campus.
        </p>
        <ClaimsList />
    </div>
  )
}

