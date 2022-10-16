export const fetchGqlApi = async (query: string) => {
  const response = await fetch("http://localhost:3080/graphql", {
    body: JSON.stringify({ query }),
    headers: {
      Accept: "application/json",
      Authorization: globalThis.authorizationToken,
      "Content-Type": "application/json",
    },
    method: "POST",
  })
  return await response.json()
}
