import { IUser } from "#interfaces/user"

import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Find a user", () => {
  test.each<{ queryNameAndArgs: string; foundUser: unknown; responseError: unknown }>([
    {
      queryNameAndArgs: `user(id: 0)`,
      foundUser: users.johnDoe,
      responseError: undefined,
    },
    {
      queryNameAndArgs: `user(id: ${users.johnDoe.id})`,
      foundUser: users.johnDoe,
      responseError: undefined,
    },
    {
      queryNameAndArgs: `user(username: "${users.johnDoe.username}")`,
      foundUser: users.johnDoe,
      responseError: undefined,
    },
    {
      queryNameAndArgs: `user(id: 666666)`,
      foundUser: undefined,
      responseError: { message: "Not found." },
    },
    {
      queryNameAndArgs: `user(username: "john")`,
      foundUser: undefined,
      responseError: { message: "Not found." },
    },
    {
      queryNameAndArgs: `user(username: "nonexistent-username")`,
      foundUser: undefined,
      responseError: { message: "Not found." },
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundUser, responseError }) => {
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${pickFields.user}
      }
    }`)
    expect(responseBody.data?.user).toEqual(foundUser)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Search users", () => {
  test.each<{ queryNameAndArgs: string; foundUsers: IUser[] }>([
    {
      queryNameAndArgs: `users(ids: [${users.johnDoe.id}])`,
      foundUsers: [users.johnDoe],
    },
    {
      queryNameAndArgs: `users(ids: [${users.johnDoe.id}, ${users.jessicaStark.id}])`,
      foundUsers: [users.johnDoe, users.jessicaStark],
    },
    {
      queryNameAndArgs: `users(username: "${users.johnDoe.username}")`,
      foundUsers: [users.johnDoe],
    },
    {
      queryNameAndArgs: `users(ids: [${users.johnDoe.id}], username: "${users.johnDoe.username}")`,
      foundUsers: [users.johnDoe],
    },
    {
      queryNameAndArgs: `users(username: "john")`,
      foundUsers: [users.johnDoe],
    },
    {
      queryNameAndArgs: `users(username: "doe")`,
      foundUsers: [users.johnDoe],
    },
    {
      queryNameAndArgs: `users(username: "j")`,
      foundUsers: [users.johnDoe, users.jessicaStark],
    },
    {
      queryNameAndArgs: `users(username: "nonexistent-username")`,
      foundUsers: [],
    },
    {
      queryNameAndArgs: `users(ids: [666666])`,
      foundUsers: [],
    },
    {
      queryNameAndArgs: `users`,
      foundUsers: [users.johnDoe, users.jessicaStark],
    },
    // {
    //   url: "/api/users/search?ids=1,hello",
    //   foundUsers: { queryNameAndArgs: { ids: "An array of numbers expected." } },
    //   responseStatus: 400,
    // },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundUsers }) => {
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${pickFields.user}
      }
    }`)
    expect(responseBody.data.users).toEqual(foundUsers)
  })
})
