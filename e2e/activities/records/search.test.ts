import { activityRecords } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Get activity record by ID", () => {
  test.each<{
    authorizedUserId: ITestUserId
    query: string
    responseBody: unknown
  }>([
    {
      authorizedUserId: users.johnDoe.id,
      query: `{
        activityRecord(id: ${activityRecords["5th"].id}) {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, },
            unit
          }
          comment,
          date,
          id,
          quantitativeValue,
        }
      }`,
      responseBody: { data: { activityRecord: activityRecords["5th"] } },
    },
    // {
    //   authorizedUserId: users.johnDoe,
    //   url: `/api/activities/records/${activityRecords["1st"].id}`,
    //   responseStatus: 403,
    //   responseBody: { message: "Access denied." },
    // },
    // {
    //   authorizedUserId: users.johnDoe,
    //   url: "/api/activities/records/666",
    //   responseStatus: 404,
    //   responseBody: { message: "Record with ID '666' not found." },
    // },
  ])("$url", async ({ authorizedUserId, query, responseBody }) => {
    await authorize(authorizedUserId)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

describe("Activity records search", () => {
  test.each<{ authorizedUserId: ITestUserId; query: string; responseBody: unknown }>([
    {
      authorizedUserId: users.johnDoe.id,
      query: `{
        activityRecords {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, },
            unit
          }
          comment,
          date,
          id,
          quantitativeValue,
        }
      }`,
      responseBody: { data: { activityRecords: [activityRecords["7th"], activityRecords["5th"]] } },
    },
    {
      authorizedUserId: users.johnDoe.id,
      query: `{
        activityRecords(boardsIds: [${boards.beautifulSportsmen.id}, 666666]) {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, },
            unit
          }
          comment,
          date,
          id,
          quantitativeValue,
        }
      }`,
      responseBody: { data: { activityRecords: [] } },
    },
    {
      authorizedUserId: users.jessicaStark.id,
      query: `{
        activityRecords(boardsIds: [${boards.beautifulSportsmen.id}]) {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, },
            unit
          }
          comment,
          date,
          id,
          quantitativeValue,
        }
      }`,
      responseBody: {
        data: {
          activityRecords: [
            activityRecords["6th"],
            activityRecords["4th"],
            activityRecords["3rd"],
            activityRecords["2nd"],
            activityRecords["1st"],
          ],
        },
      },
    },
    {
      authorizedUserId: users.jessicaStark.id,
      query: `{
        activityRecords {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, },
            unit
          }
          comment,
          date,
          id,
          quantitativeValue,
        }
      }`,
      responseBody: {
        data: {
          activityRecords: [
            activityRecords["7th"],
            activityRecords["6th"],
            activityRecords["5th"],
            activityRecords["4th"],
            activityRecords["3rd"],
            activityRecords["2nd"],
            activityRecords["1st"],
          ],
        },
      },
    },
    {
      authorizedUserId: users.jessicaStark.id,
      query: `{
        activityRecords(boardsIds: [${boards.beautifulSportsmen.id}], dates: ["2022-08-01"], orderingByDate: "ASC", orderingById: "ASC", skip: 1, take: 1) {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, },
            unit
          }
          comment,
          date,
          id,
          quantitativeValue,
        }
      }`,
      responseBody: { data: { activityRecords: [activityRecords["2nd"]] } },
    },
    // {
    //   url: "/api/activities/records/search?dates=2022_01_15",
    //   responseBody: {
    //     query: { dates: "An array of YYYY-MM-DD dates expected." },
    //   },
    //   responseStatus: 400,
    // },
  ])("$url", async ({ authorizedUserId, query, responseBody }) => {
    await authorize(authorizedUserId)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})
