"use client";

import type { Abi } from "viem";
import { decodeFunctionData } from "viem";

import { X7R } from "@x7/contracts";
import { cn } from "@x7/css";
import { shortenAddress } from "@x7/utils";

interface ProposalAction {
  address: string;
  calldata: `0x${string}`;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  actions: ProposalAction[];
  votes: {
    for: number;
    against: number;
    obstained: number;
  };
}

const ARBITRARY_DATA: Proposal[] = [
  {
    id: "0x030",
    title: "Increase Fees on X7R",
    description:
      "Increase fees for a reason here talk more about said reason etc...",
    actions: [
      {
        address: "0x70008f18fc58928dce982b0a69c2c21ff80dca54",
        calldata:
          "0xa45db9110000000000000000000000000000000000000000000000000000000000000190",
      },
    ],
    votes: {
      for: 89230,
      against: 31023,
      obstained: 0,
    },
  },
];

const GOVERNANCE_CONTRACTS: Record<string, { name: string; abi: Abi }> = {
  "0x70008f18fc58928dce982b0a69c2c21ff80dca54": {
    name: "X7R",
    abi: X7R as Abi,
  },
};

const BUTTON_SETUP = {
  for: {
    title: "Vote For",
    className: "border-emerald-500 bg-emerald-500/10 text-white",
  },
  against: {
    title: "Vote Against",
    className: "border-red-500 bg-red-500/10 text-white",
  },
  obstain: {
    title: "Obstain",
    className: "border-white bg-black/10",
  },
};

interface VoteButtonProps {
  buttonType: "for" | "against" | "obstain";
}

const VoteButton = (props: VoteButtonProps) => {
  const buttonDetails = BUTTON_SETUP[props.buttonType];
  return (
    <a
      className={cn(
        "cursor-pointer border p-1 text-xs font-bold text-white hover:border-white hover:bg-white/20",
        buttonDetails.className,
      )}
    >
      {buttonDetails.title}
    </a>
  );
};

const Proposal = ({ proposal }: { proposal: Proposal }) => {
  const totalVotes =
    proposal.votes.for + proposal.votes.against + proposal.votes.obstained;

  return (
    <div
      className={cn(
        "grid grid-cols-5 rounded-lg border p-4",
        proposal.votes.for > proposal.votes.against
          ? "border-emerald-500/10 bg-emerald-500/10"
          : proposal.votes.against > proposal.votes.obstained
            ? "border-red-500/10 bg-red-500/10"
            : "bg-black/10",
      )}
    >
      <div className="col-span-3">
        <h1 className="text-lg font-bold">{proposal.title}</h1>
        <p className="mx-2 text-xs text-white/70">{proposal.description}</p>
        <div className="flex flex-col">
          <p className="text-sm font-bold">Proposed Actions:</p>
          <div className="mx-2 flex flex-row items-center gap-1">
            {proposal.actions.map((action: ProposalAction) => {
              const { functionName, args } = decodeFunctionData({
                abi: GOVERNANCE_CONTRACTS[action.address]?.abi ?? X7R,
                data: action.calldata,
              });

              return (
                <div className="rounded-sm border bg-black/10 px-2 py-1 text-xs font-bold">
                  {GOVERNANCE_CONTRACTS[action.address]?.name ??
                    shortenAddress(action.address)}
                  : {functionName}({args.join(",")})
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-col">
        <div className="w-full border">
          <div className="flex h-2 flex-row">
            <div
              className="border border-emerald-500/10 bg-emerald-500/50"
              style={{ width: `${(proposal.votes.for / totalVotes) * 100}%` }}
            />
            <div
              className="border border-red-500/10 bg-red-500/50"
              style={{
                width: `${(proposal.votes.against / totalVotes) * 100}%`,
              }}
            />
            <div
              className="border border-white/10 bg-white/50"
              style={{
                width: `${(proposal.votes.obstained / totalVotes) * 100}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-3 divide-x">
            <div className="flex flex-col gap-1 text-center">
              <div className="flex flex-col gap-1 p-2 text-center">
                <h1 className="text-sm font-bold">For</h1>
                <p className="text-xs text-white/70">{proposal.votes.for}</p>
              </div>
              <VoteButton buttonType="for" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <div className="flex flex-col gap-1 p-2 text-center">
                <h1 className="text-sm font-bold">Against</h1>
                <p className="text-xs text-white/70">
                  {proposal.votes.against}
                </p>
              </div>
              <VoteButton buttonType="against" />
            </div>
            <div className="flex flex-col gap-1 text-center">
              <div className="flex flex-col gap-1 p-2 text-center">
                <h1 className="text-sm font-bold">Obstained</h1>
                <p className="text-xs text-white/70">
                  {proposal.votes.obstained}
                </p>
              </div>
              <VoteButton buttonType="obstain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function X7Proposals() {
  // const [open, setOpen] = useState(false);
  // const { address, isConnected } = useAccount();

  return (
    <div className="flex w-full flex-col gap-2">
      {ARBITRARY_DATA.map((proposal) => {
        return <Proposal key={proposal.id} proposal={proposal} />;
      })}
    </div>
  );
}
