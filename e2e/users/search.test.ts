import { IUser } from "#interfaces/user"

import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Returns a user by their identifier", () => {
  test.each<
    | {
        url: string
        responseStatus: 200
        responseData: IUser
      }
    | {
        url: string
        responseStatus: 404
        responseData: Record<string, never>
      }
  >([
    { url: "/api/users/0", responseStatus: 200, responseData: users.johnDoe },
    { url: "/api/users/1", responseStatus: 200, responseData: users.johnDoe },
    { url: "/api/users/john-doe", responseStatus: 200, responseData: users.johnDoe },
    { url: "/api/users/john", responseStatus: 404, responseData: {} },
    { url: "/api/users/nonexistent-username", responseStatus: 404, responseData: {} },
    { url: "/api/users/123456789", responseStatus: 404, responseData: {} },
  ])("user: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Users search", () => {
  test.each<{ url: string; responseBody: unknown; responseStatus: number }>([
    { url: "/api/users/search?ids=1", responseBody: [users.johnDoe], responseStatus: 200 },
    { url: "/api/users/search?ids=1,2", responseBody: [users.johnDoe, users.jessicaStark], responseStatus: 200 },
    { url: "/api/users/search?username=john-doe", responseBody: [users.johnDoe], responseStatus: 200 },
    { url: "/api/users/search?ids=1&username=john-doe", responseBody: [users.johnDoe], responseStatus: 200 },
    { url: "/api/users/search?username=john", responseBody: [users.johnDoe], responseStatus: 200 },
    { url: "/api/users/search?username=doe", responseBody: [users.johnDoe], responseStatus: 200 },
    { url: "/api/users/search?username=j", responseBody: [users.johnDoe, users.jessicaStark], responseStatus: 200 },
    { url: "/api/users/search?username=nonexistent-username", responseBody: [], responseStatus: 200 },
    { url: "/api/users/search?ids=666666", responseBody: [], responseStatus: 200 },
    { url: "/api/users/search", responseBody: [users.johnDoe, users.jessicaStark], responseStatus: 200 },
    {
      url: "/api/users/search?ids=1,hello",
      responseBody: { query: { ids: "An array of numbers expected." } },
      responseStatus: 400,
    },
  ])("case: $url", async ({ url, responseBody, responseStatus }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseBody)
  })
})
