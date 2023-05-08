export default function request(
  url: string,
  options?: RequestInit
): Promise<any> {
  return fetch(
    url,
    (Object as any).assign(
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      options
    )
  )
    .then((response) => {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json().then((json) => {
          if (response.status >= 200 && response.status < 500) {
            return json;
          } else {
            const error = new Error();
            error.name = `${response.status}`;
            error.message = json.error;
            throw error;
          }
        });
      } else {
        return response.text().then((text) => {
          if (response.status >= 200 && response.status < 500) {
            return {
              status: response.status,
              text,
            };
          } else {
            const error = new Error();
            error.name = `${response.status}`;
            throw error;
          }
        });
      }
    })
    .catch((error) => console.error('error: ', error));
}
