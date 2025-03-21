import { cn } from "@x7/css";
import { CheckCircleIcon, CheckIcon } from "@x7/icons";
import { Button } from "@x7/ui/button";

const steps = [
  {
    name: "Approve Lending Pool",
    completedStep: "Lending Pool Successfully Approved",
    description:
      "The X7 lending pool must be approved on your contract before you can borrow.",
    href: "#",
    status: "complete",
  },
  {
    name: "Completed",
    description:
      "Congratulations! You have successfully borrowed funds from X7. Your can manage your loan here.",
    href: "#",
    status: "upcoming",
  },
];

// NOTE: initiate loan is just a lazy implementation
export function LoanDeploymentProgress({
  initiateLoan,
}: {
  initiateLoan: () => void;
}) {
  return (
    <ol className="space-y-3 overflow-hidden border-t-2 pt-4">
      {steps.map((step, stepIdx) => (
        <li
          key={step.name}
          className={cn(
            stepIdx !== steps.length - 1 ? "pb-10" : "",
            "relative",
          )}
        >
          {step.status === "complete" ? (
            <>
              {stepIdx !== steps.length - 1 ? (
                <div
                  className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-emerald-600"
                  aria-hidden="true"
                />
              ) : null}
              <a href={step.href} className="group relative flex items-start">
                <span className="flex h-9 items-center">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 group-hover:bg-emerald-800">
                    <CheckIcon
                      className="h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className="mb-2 flex items-center text-sm font-medium text-emerald-600">
                    {step.completedStep}{" "}
                    <span className="ml-2">
                      <CheckCircleIcon className="h-5 w-5" />
                    </span>
                  </span>
                  <span className="text-sm text-zinc-500">
                    {step.description}
                  </span>
                </span>
              </a>
            </>
          ) : step.status === "current" ? (
            <>
              {stepIdx !== steps.length - 1 ? (
                <div
                  className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-zinc-300"
                  aria-hidden="true"
                />
              ) : null}
              <div
                className="group relative flex items-start"
                aria-current="step"
              >
                <span className="flex h-9 items-center" aria-hidden="true">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-600 bg-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className="mb-2 text-sm font-medium text-emerald-600">
                    <Button onClick={initiateLoan} size={"sm"}>
                      {step.name}
                    </Button>
                  </span>
                  <span className="text-sm text-zinc-500">
                    {step.description}
                  </span>
                </span>
              </div>
            </>
          ) : (
            <>
              {stepIdx !== steps.length - 1 ? (
                <div
                  className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-zinc-300"
                  aria-hidden="true"
                />
              ) : null}
              <a href={step.href} className="group relative flex items-start">
                <span className="flex h-9 items-center" aria-hidden="true">
                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-300 bg-white group-hover:border-zinc-400">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-zinc-300" />
                  </span>
                </span>
                <span className="ml-4 flex min-w-0 flex-col">
                  <span className="text-sm font-medium text-zinc-500">
                    {step.name}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {step.description}
                  </span>
                </span>
              </a>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
