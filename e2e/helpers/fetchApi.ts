export const fetchApi = (url: string, options?: RequestInit) => {
  return fetch("http://localhost:3080" + url, {
    ...options,
    headers: {
      Authorization: globalThis.authorizationToken,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
}
