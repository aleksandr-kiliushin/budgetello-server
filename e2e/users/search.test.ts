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
  ])("user search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Users search", () => {
  test.each<{ url: string; searchResult: IUser[] }>([
    { url: "/api/users/search?id=1", searchResult: [users.johnDoe] },
    { url: "/api/users/search?username=john-doe", searchResult: [users.johnDoe] },
    { url: "/api/users/search?id=1&username=john-doe", searchResult: [users.johnDoe] },
    { url: "/api/users/search?username=john", searchResult: [users.johnDoe] },
    { url: "/api/users/search?username=doe", searchResult: [users.johnDoe] },
    { url: "/api/users/search?username=j", searchResult: [users.johnDoe, users.jessicaStark] },
    { url: "/api/users/search?username=nonexistent-username", searchResult: [] },
    { url: "/api/users/search?id=123456789", searchResult: [] },
    { url: "/api/users/search", searchResult: [users.johnDoe, users.jessicaStark] },
  ])("user search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})
