import { ImageResponse } from "@vercel/og"

import { ogImageSchema } from "@/lib/validations/og"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function getRandomPioneerNumber(): string {
  let min: number = 1
  let max: number = 641
  let number: number = Math.floor(Math.random() * (max - min + 1)) + min
  return number.toString().padStart(4, "0")
}

export const runtime = "edge"

const interBold = fetch(
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

const pioneers = [1, 2, 3, 4]

const sectionThemes = {
  default: "#712fdd",
  docs: "#0184a2",
  dashboard: "#ff2e6e",
}

const MANTRA = "Trust No One. Trust Code. Long Live DeFi."

export async function GET(req: Request) {
  try {
    const fontBold = await interBold

    const url = new URL(req.url)

    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams))
    const heading =
      values.heading.length > 140
        ? `${values.heading.substring(0, 140)}...`
        : values.heading

    const { mode } = values
    const paint = mode === "dark" ? "#fff" : "#000"

    const isMain = values.heading === MANTRA

    const fontSize = heading.length > 100 ? "46px" : isMain ? "72px" : "80px"

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-10 w-full h-full items-start"
          style={{
            color: paint,
            background: mode === "dark" ? "black" : "white",
          }}
        >
          <ul role="list" tw="absolute p-4">
            {pioneers.map((person) => (
              <li key={person}>
                <img
                  tw={classNames(
                    [1, 2].includes(person) ? "opacity-0" : "",
                    "rounded w-[280px] h-[280px] mr-4"
                  )}
                  src={`https://img.x7.finance/pioneers/${getRandomPioneerNumber()}.png`}
                  alt=""
                />
              </li>
            ))}
          </ul>
          <ul role="list" tw="absolute bottom-0 p-4">
            {pioneers.map((person) => (
              <li key={person}>
                <img
                  tw={classNames(
                    [4].includes(person) ? "opacity-0" : "",
                    "rounded w-[280px] h-[280px] mr-4"
                  )}
                  src={`https://img.x7.finance/pioneers/${getRandomPioneerNumber()}.png`}
                  alt=""
                />
              </li>
            ))}
          </ul>
          <div tw="flex flex-col flex-1">
            {!isMain && (
              <div
                tw="flex"
                style={{
                  width: "150px",
                  height: "10px",
                  background:
                    sectionThemes[values?.type] ?? sectionThemes.default,
                }}
              />
            )}

            <div
              tw="flex leading-[1.1] font-bold max-w-[600px]"
              style={{
                fontFamily: "Cal Sans",
                fontWeight: "bold",
                marginLeft: "-3px",
                fontSize,
              }}
            >
              {heading}
            </div>
          </div>
          <div tw="w-full flex justify-end">
            <div tw="flex flex-col justify-center relative left-5 top-3">
              <svg
                width="270"
                height="106"
                viewBox="0 0 270 106"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M165.948 1.39581L121.699 60.9504H103.844V59.5546L139.036 11.7481H131.015L121.311 24.3104L104.103 1.86108V0H165.948V1.39581Z"
                  fill="white"
                />
                <path
                  d="M148.223 35.3631L138.778 48.0417L148.094 60.9529H165.949V59.5571L148.223 35.3631Z"
                  fill="white"
                />
                <path
                  d="M0 106V89.9351H27.8934V93.7982H3.8571V106H0ZM0 77.7333H32.362V81.5964H0V77.7333Z"
                  fill="white"
                />
                <path
                  d="M41.283 77.7333H45.1401V106H41.283V77.7333Z"
                  fill="white"
                />
                <path
                  d="M54.0861 77.7333H60.0128L84.3313 102.561V77.7333H88.1884V106H82.3087L57.9432 81.1724V106H54.0861V77.7333Z"
                  fill="white"
                />
                <path
                  d="M110.614 106L113.06 102.137H133.098L118.799 81.3609L101.818 106H97.1146L116.635 77.7333H121.01L140.483 106H110.614Z"
                  fill="white"
                />
                <path
                  d="M149.422 77.7333H155.349L179.667 102.561V77.7333H183.524V106H177.645L153.279 81.1724V106H149.422V77.7333Z"
                  fill="white"
                />
                <path
                  d="M192.451 95.6356V88.0978C192.451 85.2397 193.454 82.8056 195.461 80.7956C197.499 78.7541 199.945 77.7333 202.799 77.7333H218.415C220.171 77.7333 221.802 78.1573 223.307 79.0053C224.844 79.8219 226.083 80.9526 227.023 82.3973C227.995 83.8107 228.56 85.381 228.717 87.1084H224.813C224.562 85.5381 223.825 84.2347 222.602 83.1982C221.41 82.1304 220.015 81.5964 218.415 81.5964H202.799C201.639 81.5964 200.557 81.8948 199.553 82.4916C198.55 83.0569 197.75 83.8421 197.154 84.8471C196.59 85.8521 196.308 86.9357 196.308 88.0978V95.6356C196.308 97.4258 196.935 98.9647 198.189 100.252C199.475 101.509 201.011 102.137 202.799 102.137H218.415C220.015 102.137 221.41 101.619 222.602 100.582C223.825 99.5144 224.562 98.1953 224.813 96.6249H228.717C228.466 99.2631 227.353 101.493 225.377 103.315C223.401 105.105 221.081 106 218.415 106H202.799C199.945 106 197.499 104.995 195.461 102.985C193.454 100.943 192.451 98.4936 192.451 95.6356Z"
                  fill="white"
                />
                <path
                  d="M237.638 102.137H270V106H237.638V102.137ZM237.638 89.9351H265.531V93.7982H237.638V89.9351ZM237.638 77.7333H270V81.5964H237.638V77.7333Z"
                  fill="white"
                />
              </svg>
              <div tw="flex flex-col items-start mt-4">
                <div
                  style={{
                    color: "#f85026",
                    fontFamily: "Cal Sans",
                    fontWeight: "bold",
                    marginLeft: "-3px",
                    fontSize: "40px",
                  }}
                >
                  Trade.
                </div>
                <div
                  style={{
                    color: "#5c3e78",
                    fontFamily: "Cal Sans",
                    fontWeight: "black",
                    marginLeft: "-3px",
                    fontSize: "40px",
                  }}
                >
                  Borrow.
                </div>
                <div
                  style={{
                    color: "#11f39e",
                    fontFamily: "Cal Sans",
                    fontWeight: "black",
                    marginLeft: "-3px",
                    fontSize: "40px",
                  }}
                >
                  Fund.
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Cal Sans",
            data: fontBold,
            weight: 700,
            style: "normal",
          },
        ],
      }
    )
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
