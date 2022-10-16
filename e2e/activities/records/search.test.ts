import { activityRecords } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserUsername, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Get activity record by ID", () => {
  test.each<{
    authorizedUserUsername: ITestUserUsername
    query: string
    responseBody: unknown
  }>([
    {
      authorizedUserUsername: users.johnDoe.username,
      query: `{
        activityRecord(id: ${activityRecords["5th"].id}) {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, username },
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
    //   authorizedUserUsername: users.johnDoe.username,
    //   url: `/api/activities/records/${activityRecords["1st"].id}`,
    //   responseStatus: 403,
    //   responseBody: { message: "Access denied." },
    // },
    // {
    //   authorizedUserUsername: users.johnDoe.username,
    //   url: "/api/activities/records/666",
    //   responseStatus: 404,
    //   responseBody: { message: "Record with ID '666' not found." },
    // },
  ])("$url", async ({ authorizedUserUsername, query, responseBody }) => {
    await authorize(authorizedUserUsername)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

describe("Activity records search", () => {
  test.each<{ authorizedUserUsername: ITestUserUsername; query: string; responseBody: unknown }>([
    {
      authorizedUserUsername: users.johnDoe.username,
      query: `{
        activityRecords {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, username },
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
      authorizedUserUsername: users.johnDoe.username,
      query: `{
        activityRecords(boardsIds: [${boards.beautifulSportsmen.id}, 666666]) {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, username },
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
      authorizedUserUsername: users.jessicaStark.username,
      query: `{
        activityRecords(boardsIds: [${boards.beautifulSportsmen.id}]) {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, username },
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
      authorizedUserUsername: users.jessicaStark.username,
      query: `{
        activityRecords {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, username },
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
      authorizedUserUsername: users.jessicaStark.username,
      query: `{
        activityRecords(boardsIds: [${boards.beautifulSportsmen.id}], dates: ["2022-08-01"], orderingByDate: "ASC", orderingById: "ASC", skip: 1, take: 1) {
          booleanValue,
          category {
            board { id, name },
            id,
            measurementType { id, name },
            name,
            owner { id, password, username },
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
  ])("$url", async ({ authorizedUserUsername, query, responseBody }) => {
    await authorize(authorizedUserUsername)
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})
