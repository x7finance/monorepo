import { CopyButton } from "./copy-button"

export function ContractCopy(props: { contract: string; name?: string }) {
  const { contract, name = "Contract" } = props

  return (
    <span className="flex items-center">
      <span className="mr-1 dark:opacity-40 opacity-60">{name}:</span>
      <span className="dark:opacity-50 opacity-70 flex items-center">
        <span className="hidden sm:block">{contract}</span>
        <span className="ml-1 relative inline-block top-0.5">
          <CopyButton title="" size={4} content={contract} />
        </span>
      </span>
    </span>
  )
}
