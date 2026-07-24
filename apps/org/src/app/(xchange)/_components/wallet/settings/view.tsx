/* oxlint-disable @typescript-eslint/no-non-null-assertion */

import type { FC } from "react"
import { useState } from "react"
import { useAccount } from "wagmi"

import { cn } from "@x7/css"
import { CheckIcon, TrashIcon } from "@x7/icons"
import { Button } from "@x7/ui/button"
import { CopyButton } from "@x7/ui/copy-button"
import { LinkInternal } from "@x7/ui/link"
import { TextField } from "@x7/ui/text-field"
import type { ChainId } from "@x7/utils"
import { useWeb3Config } from "~/lib/providers/web3"

export const SettingsView: FC = () => {
  const { transports, updateTransports } = useWeb3Config()
  const { chain } = useAccount()
  const [newRpc, setNewRpc] = useState<string>("")
  const [showAddRpc, setShowAddRpc] = useState<boolean>(false)

  const chainId = chain?.id as ChainId

  const handleAddRpc = () => {
    const updatedTransports = {
      ...transports,
      [chainId]: [newRpc, ...transports[chainId]!],
    }
    updateTransports(updatedTransports)
    setNewRpc("")
    setShowAddRpc(false)
  }

  const handleRemoveRpc = (rpcUrl: string) => {
    const rpcExists = transports[chainId]?.includes(rpcUrl)

    if (!rpcExists) {
      setShowAddRpc(false)
    } else {
      const updatedTransports = {
        ...transports,
        [chainId]: transports[chainId]!.filter((url: string) => url !== rpcUrl),
      }

      updateTransports(updatedTransports)
    }
  }

  return (
    <div>
      <div className="mb-4 flex w-full flex-col gap-4">
        <>
          <div className="flex w-full">
            <h4 className="font-heading text-secondary-foreground">
              RPC Settings
            </h4>
          </div>
          <p className="text-xs text-zinc-800 dark:text-zinc-200">
            Xchange can connect to a custom provided RPC, it is built to be
            decentralized and permissionless.{" "}
            <LinkInternal
              prefetch={true}
              className="block text-emerald-600"
              target="_blank"
              href="/docs/guides/custom-rpc"
            >
              Learn More <span aria-hidden="true">&rarr;</span>
            </LinkInternal>
          </p>

          <div className="flex flex-col items-center">
            {showAddRpc ? (
              <div className="flex w-full">
                <TextField
                  type="text"
                  placeholder={"Add a custom RPC URL"}
                  value={newRpc}
                  onChange={(e) => setNewRpc(e.target.value)}
                  className="grow"
                />
                <div className="ml-0.5 flex gap-0.5">
                  <Button
                    name="add-rpc"
                    className="hover:bg-emerald-700/20 hover:text-emerald-500"
                    size="sm"
                    variant={"ghost"}
                    onClick={handleAddRpc}
                    disabled={!newRpc}
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    name="cancel-add-rpc"
                    icon={TrashIcon}
                    className="hover:bg-red-700/20 hover:text-red-500"
                    size="sm"
                    variant={"ghost"}
                    onClick={() => setShowAddRpc(false)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                size={"sm"}
                className="w-full"
                onClick={() => setShowAddRpc(true)}
              >
                Add Custom RPC
              </Button>
            )}

            {transports[chainId]
              ?.slice(0, -2) // omit the last item in the rpc array which is the Xchange public RPC
              .map((rpcUrl: string, index: number) => (
                <div key={rpcUrl} className="mt-2 flex w-full flex-col">
                  <div className="flex w-full">
                    <TextField
                      type="text"
                      value={rpcUrl}
                      className="grow"
                      disabled
                    />
                    <Button
                      name="remove-rpc-listed"
                      className="ml-1 hover:bg-red-700/20 hover:text-red-500"
                      size="sm"
                      variant={"ghost"}
                      onClick={() => handleRemoveRpc(rpcUrl)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <div className="mt-0.5 flex items-center">
                      <span
                        className="relative flex h-5 w-5 shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        <span
                          className={cn(
                            `absolute h-2 w-2 animate-ping rounded-full ${
                              index === 0 ? "bg-emerald-600" : "bg-orange-600"
                            } [animation-duration:2s]`
                          )}
                        />
                        <span
                          className={cn(
                            `relative block h-1 w-1 rounded-full ${
                              index === 0 ? "bg-emerald-700" : "bg-orange-700"
                            }`
                          )}
                        />
                      </span>
                      <span
                        className={cn(
                          `mr-3 ml-1 w-20 text-[12px] ${
                            index === 0 ? "text-emerald-500" : "text-orange-500"
                          }`
                        )}
                      >
                        {index === 0 ? "Active RPC" : "Fallback RPC"}
                      </span>
                      <span className="text-zinc-200 dark:text-zinc-800">
                        |
                      </span>
                      <div className="">
                        <CopyButton title="RPC" size={4} content={rpcUrl} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-500">
            Note: please use caution when adding a custom RPC, this will be used
            to make transactions and interact with smart contracts on Xchange.
          </p>
        </>
      </div>
    </div>
  )
}
