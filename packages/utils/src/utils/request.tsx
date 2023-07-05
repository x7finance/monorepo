/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
interface ResponseError extends Error {
  name: string
}

export default function request(
  url: string,
  options?: RequestInit
): Promise<unknown> {
  return fetch(
    url,
    Object.assign(
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
      options
    )
  )
    .then((response: Response) => {
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then((json: any) => {
          if (response.status >= 200 && response.status < 500) {
            return json
          } else {
            const error: ResponseError = new Error()
            error.name = `${response.status}`
            error.message = json?.error
            throw error
          }
        })
      } else {
        return response.text().then((text) => {
          if (response.status >= 200 && response.status < 500) {
            return {
              status: response.status,
              text,
            }
          } else {
            const error: ResponseError = new Error()
            error.name = `${response.status}`
            throw error
          }
        })
      }
    })
    .catch((error: ResponseError) => console.error("error: ", error))
}
