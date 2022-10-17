import { activityRecords } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Find an activity record", () => {
  test.each<{
    queryNameAndArgs: string
    foundRecord: unknown
    responseError: unknown
  }>([
    {
      queryNameAndArgs: `activityRecord(id: ${activityRecords["5th"].id})`,
      foundRecord: activityRecords["5th"],
      responseError: undefined,
    },
    {
      queryNameAndArgs: `activityRecord(id: ${activityRecords["1st"].id})`,
      foundRecord: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndArgs: `activityRecord(id: 666666)`,
      foundRecord: undefined,
      responseError: { message: "Not found." },
    },
  ])("$queryNameAndArgs", async ({ queryNameAndArgs, foundRecord, responseError }) => {
    await authorize(users.johnDoe.id)
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.data?.activityRecord).toEqual(foundRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})

describe("Search for activity records", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndArgs: string
    foundRecords: unknown[]
  }>([
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `activityRecords`,
      foundRecords: [activityRecords["7th"], activityRecords["5th"]],
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndArgs: `activityRecords(boardsIds: [${boards.beautifulSportsmen.id}])`,
      foundRecords: [],
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndArgs: `activityRecords(boardsIds: [${boards.beautifulSportsmen.id}])`,
      foundRecords: [
        activityRecords["6th"],
        activityRecords["4th"],
        activityRecords["3rd"],
        activityRecords["2nd"],
        activityRecords["1st"],
      ],
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndArgs: `activityRecords`,
      foundRecords: [
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
      authorizedUserId: users.jessicaStark.id,
      queryNameAndArgs: `activityRecords(boardsIds: [${boards.beautifulSportsmen.id}], dates: ["2022-08-01"], orderingByDate: "ASC", orderingById: "ASC", skip: 1, take: 1)`,
      foundRecords: [activityRecords["2nd"]],
    },
    // {
    //   url: "/api/activities/records/search?dates=2022_01_15",
    //   responseBody: {
    //     query: { dates: "An array of YYYY-MM-DD dates expected." },
    //   },
    //   responseStatus: 400,
    // },
  ])("$queryNameAndArgs", async ({ authorizedUserId, queryNameAndArgs, foundRecords }) => {
    await authorize(authorizedUserId)
    const responseBody = await fetchGqlApi(`{
      ${queryNameAndArgs} {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.data.activityRecords).toEqual(foundRecords)
  })
})
