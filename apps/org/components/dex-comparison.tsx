import { cn } from "utils"

const tiers = [
  {
    name: "Uniswap",
    id: "tier-starter",
    href: "#",
    featured: false,
    description: "The largest DEX on the market today",
    price: { monthly: "$15", annually: "$144" },
    mainFeatures: [
      "Basic invoicing",
      "Easy to use accounting",
      "Mutli-accounts",
    ],
  },
  {
    name: "Xchange",
    id: "tier-scale",
    href: "#",
    featured: true,
    description: "The most decentralized DEX on the market.",
    price: { monthly: "$60", annually: "$576" },
    mainFeatures: [
      "Advanced invoicing",
      "Easy to use accounting",
      "Mutli-accounts",
      "Tax planning toolkit",
      "VAT & VATMOSS filing",
      "Free bank transfers",
    ],
  },
  {
    name: "Other",
    id: "tier-growth",
    href: "#",
    featured: false,
    description:
      "Homegrown pairs that require maintenance, tooling and testing.",
    price: { monthly: "$30", annually: "$288" },
    mainFeatures: [
      "Basic invoicing",
      "Easy to use accounting",
      "Mutli-accounts",
      "Tax planning toolkit",
    ],
  },
]
const sections = [
  {
    name: "Launching a pair",
    features: [
      {
        name: "Fees",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Leverage",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Multi-chain",
        tiers: {
          Starter: "3 accounts",
          Scale: "Unlimited accounts",
          Growth: "7 accounts",
        },
      },
      {
        name: "Privacy",
        tiers: {
          Starter: "3 invoices",
          Scale: "Unlimited invoices",
          Growth: "10 invoices",
        },
      },
      {
        name: "Multiple Loan Options",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
      {
        name: "Fees",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
      {
        name: "Permissionless",
        tiers: { Starter: false, Scale: true, Growth: false },
      },
    ],
  },
  {
    name: "Other perks",
    features: [
      {
        name: "24/7 customer support",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Instant notifications",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Budgeting tools",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Digital receipts",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Pots to separate money",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
      {
        name: "Free bank transfers",
        tiers: { Starter: false, Scale: true, Growth: false },
      },
      {
        name: "Business debit card",
        tiers: { Starter: false, Scale: true, Growth: false },
      },
    ],
  },
]

export function DexComparison() {
  return (
    <div className="relative bg-gray-50 lg:pt-14">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        {/* Feature comparison (up to lg) */}
        <section
          aria-labelledby="mobile-comparison-heading"
          className="lg:hidden"
        >
          <h2 id="mobile-comparison-heading" className="sr-only">
            Feature comparison
          </h2>

          <div className="mx-auto max-w-2xl space-y-16">
            {tiers.map((tier) => (
              <div key={tier.id} className="border-t border-gray-900/10">
                <div
                  className={cn(
                    tier.featured ? "border-indigo-600" : "border-transparent",
                    "-mt-px w-72 border-t-2 pt-10 md:w-80"
                  )}
                >
                  <h3
                    className={cn(
                      tier.featured ? "text-indigo-600" : "text-gray-900",
                      "text-sm font-semibold leading-6"
                    )}
                  >
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {tier.description}
                  </p>
                </div>

                <div className="mt-10 space-y-10">
                  {sections.map((section) => (
                    <div key={section.name}>
                      <h4 className="text-sm font-semibold leading-6 text-gray-900">
                        {section.name}
                      </h4>
                      <div className="relative mt-6">
                        {/* Fake card background */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-y-0 right-0 hidden w-1/2 rounded-lg bg-white shadow-sm sm:block"
                        />

                        <div
                          className={cn(
                            tier.featured
                              ? "ring-2 ring-indigo-600"
                              : "ring-1 ring-gray-900/10",
                            "relative rounded-lg bg-white shadow-sm sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0"
                          )}
                        ></div>

                        {/* Fake card border */}
                        <div
                          aria-hidden="true"
                          className={cn(
                            tier.featured
                              ? "ring-2 ring-indigo-600"
                              : "ring-1 ring-gray-900/10",
                            "pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-lg sm:block"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="comparison-heading"
          className="hidden lg:block"
        >
          <h2 id="comparison-heading" className="sr-only">
            Feature comparison
          </h2>

          <div className="grid grid-cols-4 gap-x-8 border-t border-gray-900/10 before:block">
            {tiers.map((tier) => (
              <div key={tier.id} aria-hidden="true" className="-mt-px">
                <div
                  className={cn(
                    tier.featured ? "border-indigo-600" : "border-transparent",
                    "border-t-2 pt-10"
                  )}
                >
                  <p
                    className={cn(
                      tier.featured ? "text-indigo-600" : "text-gray-900",
                      "text-sm font-semibold leading-6"
                    )}
                  >
                    {tier.name}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {tier.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="-mt-6 space-y-16">
            {sections.map((section) => (
              <div key={section.name}>
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  {section.name}
                </h3>
                <div className="relative -mx-8 mt-10">
                  <div
                    className="absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                    aria-hidden="true"
                  >
                    <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                    <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                    <div className="h-full w-full rounded-lg bg-white shadow-sm" />
                  </div>

                  <table className="relative w-full border-separate border-spacing-x-8">
                    <thead>
                      <tr className="text-left">
                        <th scope="col">
                          <span className="sr-only">Feature</span>
                        </th>
                        {tiers.map((tier) => (
                          <th key={tier.id} scope="col">
                            <span className="sr-only">{tier.name} tier</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.features.map((feature, featureIdx) => (
                        <tr key={feature.name}>
                          <th
                            scope="row"
                            className="w-1/4 py-3 pr-4 text-left text-sm font-normal leading-6 text-gray-900"
                          >
                            {feature.name}
                            {featureIdx !== section.features.length - 1 ? (
                              <div className="absolute inset-x-8 mt-3 h-px bg-gray-200" />
                            ) : null}
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div
                    className="pointer-events-none absolute inset-x-8 inset-y-0 grid grid-cols-4 gap-x-8 before:block"
                    aria-hidden="true"
                  >
                    {tiers.map((tier) => (
                      <div
                        key={tier.id}
                        className={cn(
                          tier.featured
                            ? "ring-2 ring-indigo-600"
                            : "ring-1 ring-gray-900/10",
                          "rounded-lg"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
