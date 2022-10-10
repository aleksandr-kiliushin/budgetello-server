import { IActivityRecord } from "#interfaces/activities"

import { activityRecords } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchApi } from "#e2e/helpers/fetchApi"

describe("Get activity record by ID", () => {
  test.each<
    | { authorizedUserUsername: ITestUserUsername; url: string; responseStatus: 200; responseBody: IActivityRecord }
    | { authorizedUserUsername: ITestUserUsername; url: string; responseStatus: 403; responseBody: { message: string } }
    | { authorizedUserUsername: ITestUserUsername; url: string; responseStatus: 404; responseBody: { message: string } }
  >([
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/${activityRecords["5th"].id}`,
      responseStatus: 200,
      responseBody: activityRecords["5th"],
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/${activityRecords["1st"].id}`,
      responseStatus: 403,
      responseBody: { message: "Access denied." },
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: "/api/activities/records/666",
      responseStatus: 404,
      responseBody: { message: "Record with ID '666' not found." },
    },
  ])("find record for: $url", async ({ authorizedUserUsername, url, responseStatus, responseBody }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi(url)
    expect(response.status).toEqual(responseStatus)
    expect(await response.json()).toEqual(responseBody)
  })
})

describe("Budget records search", () => {
  test.each<{ authorizedUserUsername: ITestUserUsername; url: string; responseBody: IActivityRecord[] }>([
    {
      authorizedUserUsername: users.johnDoe.username,
      url: "/api/activities/records/search",
      responseBody: [activityRecords["7th"], activityRecords["5th"]],
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: `/api/activities/records/search?boardId=${boards.beautifulSportsmen.id},666`,
      responseBody: [],
    },
    {
      authorizedUserUsername: users.johnDoe.username,
      url: "/api/activities/records/search?boardId=4",
      responseBody: [activityRecords["7th"], activityRecords["5th"]],
    },
    {
      authorizedUserUsername: users.jessicaStark.username,
      url: "/api/activities/records/search",
      responseBody: [
        activityRecords["7th"],
        activityRecords["6th"],
        activityRecords["5th"],
        activityRecords["4th"],
        activityRecords["3rd"],
        activityRecords["2nd"],
        activityRecords["1st"],
      ],
    },
    {
      authorizedUserUsername: users.jessicaStark.username,
      url: "/api/activities/records/search?boardId=3&date=2022-08-01&orderingByDate=ASC&orderingById=ASC&skip=1&take=1",
      responseBody: [activityRecords["2nd"]],
    },
  ])("find records for: $url", async ({ authorizedUserUsername, url, responseBody }) => {
    await authorize(authorizedUserUsername)
    const response = await fetchApi(url)
    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual(responseBody)
  })
})
