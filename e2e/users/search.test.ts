import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickedFields } from "#e2e/pickedFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Returns a user by their identifier", () => {
  test.each<{ query: string; responseData: unknown; responseError: unknown }>([
    {
      query: `{
        user(id: 0) {
          ${pickedFields.user}
        }
      }`,
      responseData: { user: users.johnDoe },
      responseError: undefined,
    },
    {
      query: `{
        user(id: ${users.johnDoe.id}) {
          ${pickedFields.user}
        }
      }`,
      responseData: { user: users.johnDoe },
      responseError: undefined,
    },
    {
      query: `{
        user(username: "${users.johnDoe.username}") {
          ${pickedFields.user}
        }
      }`,
      responseData: { user: users.johnDoe },
      responseError: undefined,
    },
    {
      query: `{
        user(id: 666666) {
          ${pickedFields.user}
        }
      }`,
      responseData: null,
      responseError: { message: "Not found." },
    },
    {
      query: `{
        user(username: "john") {
          ${pickedFields.user}
        }
      }`,
      responseData: null,
      responseError: { message: "Not found." },
    },
    {
      query: `{
        user(username: "nonexistent-username") {
          ${pickedFields.user}
        }
      }`,
      responseData: null,
      responseError: { message: "Not found." },
    },
  ])("$query", async ({ query, responseData, responseError }) => {
    const responseBody = await fetchGqlApi(query)
    expect(responseBody.data).toEqual(responseData)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Users search", () => {
  test.each<{ query: string; responseData: unknown }>([
    {
      query: `{
        users(ids: [${users.johnDoe.id}]) {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [users.johnDoe] },
    },
    {
      query: `{
        users(ids: [${users.johnDoe.id}, ${users.jessicaStark.id}]) {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [users.johnDoe, users.jessicaStark] },
    },
    {
      query: `{
        users(username: "${users.johnDoe.username}") {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [users.johnDoe] },
    },
    {
      query: `{
        users(ids: [${users.johnDoe.id}], username: "${users.johnDoe.username}") {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [users.johnDoe] },
    },
    {
      query: `{
        users(username: "john") {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [users.johnDoe] },
    },
    {
      query: `{
        users(username: "doe") {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [users.johnDoe] },
    },
    {
      query: `{
        users(username: "j") {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [users.johnDoe, users.jessicaStark] },
    },
    {
      query: `{
        users(username: "nonexistent-username") {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [] },
    },
    {
      query: `{
        users(ids: [666666]) {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [] },
    },
    {
      query: `{
        users {
          ${pickedFields.user}
        }
      }`,
      responseData: { users: [users.johnDoe, users.jessicaStark] },
    },
    // {
    //   url: "/api/users/search?ids=1,hello",
    //   responseData: { query: { ids: "An array of numbers expected." } },
    //   responseStatus: 400,
    // },
  ])("$query", async ({ query, responseData }) => {
    const responseBody = await fetchGqlApi(query)
    expect(responseBody.data).toEqual(responseData)
  })
})
