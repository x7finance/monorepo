import { CheckCircleIcon } from "icons"

import Image from "next/image"

const supportItems = [
  "Partnerships",
  "Support Questions",
  "Press Inquiries",
  "Request a Demo",
  "General Questions",
  "Other",
]

export function Assistance(props) {
  const { title = "Not any of the above?" } = props
  return (
    <div className=" py-24 sm:py-32">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-white/5 px-6 py-16 ring-1 ring-zinc-600 dark:ring-zinc-800 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
            <Image
              src={`https://img.x7.finance/pioneers/0981.png`}
              alt="Random Pioneer Image"
              width={300}
              height={300}
              className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm"
            />

            <div className="w-full flex-auto">
              <h2 className="text-3xl font-bold tracking-tight dark:text-white text-black sm:text-4xl">
                {title}
              </h2>
              <p className="mt-6 text-lg leading-8 dark:text-slate-300 text-slate-800">
                {`Reach out to the X7 DAO below and we'll be happy to get
            you answers to any of the following and more.`}
              </p>
              <ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 dark:text-white text-black sm:grid-cols-2"
              >
                {supportItems.map((benefit) => (
                  <li key={benefit} className="flex gap-x-3">
                    <CheckCircleIcon
                      className="h-7 w-5 flex-none"
                      aria-hidden="true"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex">
                <a
                  rel="noopener noreferrer"
                  href="mailto:marketing@x7finance.org"
                  className="text-sm font-semibold leading-6 dark:text-indigo-400 text-indigo-700"
                >
                  Shoot us a note <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
          aria-hidden="true"
        >
          <div
            className="aspect-[1318/752] w-[82.375rem] flex-none bg-gradient-to-r from-[#000] to-[#4f46e5] opacity-50"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
