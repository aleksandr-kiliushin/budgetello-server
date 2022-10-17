import { activityCategories } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Find an activity category", () => {
  test.each<{
    queryNameAndArgs: string
    foundCategory: unknown
    responseError: unknown
  }>([
    {
      queryNameAndArgs: `activityCategory(id: ${activityCategories.reading.id})`,
      foundCategory: activityCategories.reading,
      responseError: undefined,
    },
    {
      queryNameAndArgs: `activityCategory(id: ${activityCategories.running.id})`,
      foundCategory: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndArgs: `activityCategory(id: 666666)`,
      foundCategory: undefined,
      responseError: { message: "Not found." },
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundCategory, responseError }) => {
    await authorize(users.johnDoe.id)
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.data?.activityCategory).toEqual(foundCategory)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Search for activity categories", () => {
  test.each<{
    queryNameAndArgs: string
    foundCategories: unknown[]
  }>([
    {
      queryNameAndArgs: `activityCategories(ids: [${activityCategories.running.id}])`,
      foundCategories: [activityCategories.running],
    },
    {
      queryNameAndArgs: `activityCategories(boardsIds: [${boards.productivePeople.id}])`,
      foundCategories: [activityCategories.reading, activityCategories.meditate],
    },
    {
      queryNameAndArgs: `activityCategories(boardsIds: [${boards.productivePeople.id}, ${boards.beautifulSportsmen.id}])`,
      foundCategories: [
        activityCategories.running,
        activityCategories.pushups,
        activityCategories.noSweets,
        activityCategories.sleep,
        activityCategories.reading,
        activityCategories.meditate,
      ],
    },
    {
      queryNameAndArgs: `activityCategories(ids: [${activityCategories.noSweets.id}, ${activityCategories.reading.id}])`,
      foundCategories: [activityCategories.noSweets, activityCategories.reading],
    },
    {
      queryNameAndArgs: `activityCategories(ids: [${activityCategories.sleep.id}, 666666])`,
      foundCategories: [activityCategories.sleep],
    },
    {
      queryNameAndArgs: `activityCategories(ownersIds: [${users.johnDoe.id}])`,
      foundCategories: [activityCategories.reading],
    },
    {
      queryNameAndArgs: `activityCategories(boardsIds: [${boards.beautifulSportsmen.id}], ownersIds: [${users.jessicaStark.id}])`,
      foundCategories: [
        activityCategories.running,
        activityCategories.pushups,
        activityCategories.noSweets,
        activityCategories.sleep,
      ],
    },
    {
      queryNameAndArgs: `activityCategories`,
      foundCategories: [
        activityCategories.running,
        activityCategories.pushups,
        activityCategories.noSweets,
        activityCategories.sleep,
        activityCategories.reading,
        activityCategories.meditate,
      ],
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundCategories }) => {
    await authorize(users.jessicaStark.id)
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.data.activityCategories).toEqual(foundCategories)
  })
})
