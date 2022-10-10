import { IActivityCategory } from "#interfaces/activities"

import { activityCategories } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

beforeEach(async () => {
  await authorize(users.jessicaStark.username)
})

describe("Responds with a category found by provided ID", () => {
  test.each<
    | { url: string; responseStatus: 200; responseData: IActivityCategory }
    | { url: string; responseStatus: 403; responseData: Record<string, unknown> }
    | { url: string; responseStatus: 404; responseData: Record<string, never> }
  >([
    {
      url: `/api/activities/categories/${activityCategories.running.id}`,
      responseStatus: 200,
      responseData: activityCategories.running,
    },
    {
      url: `/api/activities/categories/${activityCategories.reading.id}`,
      responseStatus: 200,
      responseData: activityCategories.reading,
    },
    {
      url: "/api/activities/categories/666666",
      responseStatus: 404,
      responseData: {},
    },
  ])("category search for: $url", async ({ url, responseStatus, responseData }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseData)
  })
})

describe("Activity categoires search", () => {
  test.each<{ url: string; searchResult: IActivityCategory[] }>([
    {
      url: `/api/activities/categories/search?id=${activityCategories.running.id}`,
      searchResult: [activityCategories.running],
    },
    {
      url: `/api/activities/categories/search?boardId=${boards.productivePeople.id}`,
      searchResult: [activityCategories.reading, activityCategories.meditate],
    },
    {
      url: `/api/activities/categories/search?boardId=${boards.productivePeople.id},${boards.beautifulSportsmen.id}`,
      searchResult: [
        activityCategories.running,
        activityCategories.pushups,
        activityCategories.noSweets,
        activityCategories.sleep,
        activityCategories.reading,
        activityCategories.meditate,
      ],
    },
    {
      url: `/api/activities/categories/search?id=${activityCategories.noSweets.id},${activityCategories.reading.id}`,
      searchResult: [activityCategories.noSweets, activityCategories.reading],
    },
    {
      url: `/api/activities/categories/search?id=${activityCategories.sleep.id},666666`,
      searchResult: [activityCategories.sleep],
    },
    {
      url: "/api/activities/categories/search",
      searchResult: [
        activityCategories.running,
        activityCategories.pushups,
        activityCategories.noSweets,
        activityCategories.sleep,
        activityCategories.reading,
        activityCategories.meditate,
      ],
    },
  ])("categories search for: $url", async ({ url, searchResult }) => {
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(searchResult)
  })
})
