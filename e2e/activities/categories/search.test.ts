import { activityCategories } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.jessicaStark)
})

describe("Responds with a category found by provided ID", () => {
  test.each<{ query: string; responseBody: unknown }>([
    {
      query: `{
        activityCategory(id: ${activityCategories.running.id}) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: { data: { activityCategory: activityCategories.running } },
    },
    {
      query: `{
        activityCategory(id: ${activityCategories.reading.id}) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: { data: { activityCategory: activityCategories.reading } },
    },
    // {
    //   query: "/api/activities/categories/666666",
    //   responseBody: {},
    // },
  ])("$query", async ({ query, responseBody }) => {
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

describe("Activity categoires search", () => {
  test.each<{ query: string; responseBody: unknown }>([
    {
      query: `{
        activityCategories(ids: [${activityCategories.running.id}]) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: { data: { activityCategories: [activityCategories.running] } },
    },
    {
      query: `{
        activityCategories(boardsIds: [${boards.productivePeople.id}]) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: { data: { activityCategories: [activityCategories.reading, activityCategories.meditate] } },
    },
    {
      query: `{
        activityCategories(boardsIds: [${boards.productivePeople.id}, ${boards.beautifulSportsmen.id}]) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: {
        data: {
          activityCategories: [
            activityCategories.running,
            activityCategories.pushups,
            activityCategories.noSweets,
            activityCategories.sleep,
            activityCategories.reading,
            activityCategories.meditate,
          ],
        },
      },
    },
    {
      query: `{
        activityCategories(ids: [${activityCategories.noSweets.id}, ${activityCategories.reading.id}]) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: {
        data: {
          activityCategories: [activityCategories.noSweets, activityCategories.reading],
        },
      },
    },
    {
      query: `{
        activityCategories(ids: [${activityCategories.sleep.id}, 666666]) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: {
        data: {
          activityCategories: [activityCategories.sleep],
        },
      },
    },
    {
      query: `{
        activityCategories(ownersIds: [${users.johnDoe.id}]) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: {
        data: {
          activityCategories: [activityCategories.reading],
        },
      },
    },
    {
      query: `{
        activityCategories(boardsIds: [${boards.beautifulSportsmen.id}], ownersIds: [${users.jessicaStark.id}]) {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: {
        data: {
          activityCategories: [
            activityCategories.running,
            activityCategories.pushups,
            activityCategories.noSweets,
            activityCategories.sleep,
          ],
        },
      },
    },
    {
      query: `{
        activityCategories {
          board { id, name }
          id,
          name,
          measurementType { id, name },
          owner { id, password, username },
          unit
        }
      }`,
      responseBody: {
        data: {
          activityCategories: [
            activityCategories.running,
            activityCategories.pushups,
            activityCategories.noSweets,
            activityCategories.sleep,
            activityCategories.reading,
            activityCategories.meditate,
          ],
        },
      },
    },
  ])("$query", async ({ query, responseBody }) => {
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})
