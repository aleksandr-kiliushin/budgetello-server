import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickedFields } from "#e2e/pickedFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Returns a user by their identifier", () => {
  test.each<{ query: string; responseBody: unknown }>([
    {
      query: `{
        user(id: 0) {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { user: users.johnDoe } },
    },
    {
      query: `{
        user(id: ${users.johnDoe.id}) {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { user: users.johnDoe } },
    },
    {
      query: `{
        user(username: "${users.johnDoe.username}") {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { user: users.johnDoe } },
    },
    // {
    //   url: "/api/users/123456789",
    //   responseStatus: 404,
    //   responseBody: {},
    // },
    // {
    //   url: "/api/users/john",
    //   responseStatus: 404,
    //   responseBody: {},
    // },
    // {
    //   url: "/api/users/nonexistent-username",
    //   responseStatus: 404,
    //   responseBody: {},
    // },
  ])("$query", async ({ query, responseBody }) => {
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

describe("Users search", () => {
  test.each<{ query: string; responseBody: unknown }>([
    {
      query: `{
        users(ids: [${users.johnDoe.id}]) {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { users: [users.johnDoe] } },
    },
    {
      query: `{
        users(ids: [${users.johnDoe.id}, ${users.jessicaStark.id}]) {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { users: [users.johnDoe, users.jessicaStark] } },
    },
    {
      query: `{
        users(username: "${users.johnDoe.username}") {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { users: [users.johnDoe] } },
    },
    {
      query: `{
        users(ids: [${users.johnDoe.id}], username: "${users.johnDoe.username}") {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { users: [users.johnDoe] } },
    },
    {
      query: `{
        users(username: "john") {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { users: [users.johnDoe] } },
    },
    {
      query: `{
        users(username: "doe") {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { users: [users.johnDoe] } },
    },
    {
      query: `{
        users(username: "j") {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { users: [users.johnDoe, users.jessicaStark] } },
    },
    {
      query: `{
        users {
          ${pickedFields.user}
        }
      }`,
      responseBody: { data: { users: [users.johnDoe, users.jessicaStark] } },
    },
    // { url: "/api/users/search?username=nonexistent-username", responseBody: [], responseStatus: 200 },
    // { url: "/api/users/search?ids=666666", responseBody: [], responseStatus: 200 },
    // { url: "/api/users/search", responseBody: [users.johnDoe, users.jessicaStark], responseStatus: 200 },
    // {
    //   url: "/api/users/search?ids=1,hello",
    //   responseBody: { query: { ids: "An array of numbers expected." } },
    //   responseStatus: 400,
    // },
  ])("$query", async ({ query, responseBody }) => {
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})
