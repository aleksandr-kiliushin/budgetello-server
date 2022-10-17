import { activityCategories } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Activity record creating", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndInput: string
    createdRecord: unknown
    responseError: unknown
  }>([
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `createActivityRecord(input: { booleanValue: true, categoryId: ${activityCategories.reading.id}, comment: "read about backend", date: "2022-08-10", quantitativeValue: null })`,
      createdRecord: undefined,
      responseError: {
        fields: {
          categoryId: "Amount should be filled for «Quantitative» activity.",
          quantitativeValue: "Amount should be filled for «Quantitative» activity.",
        },
      },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `createActivityRecord(input: { booleanValue: null, categoryId: ${activityCategories.reading.id}, comment: "read about backend", date: "2022-08-10", quantitativeValue: 4.5 })`,
      createdRecord: {
        booleanValue: null,
        category: activityCategories.reading,
        comment: "read about backend",
        date: "2022-08-10",
        id: 8,
        quantitativeValue: 4.5,
      },
      responseError: undefined,
    },

    // {
    //   authorizedUserId: users.johnDoe.id,
    //   payload: {},
    //   responseBody: {
    //     fields: {
    //       categoryId: "Required.",
    //       date: "Required.",
    //       comment: "Required.",
    //     },
    //   },
    //   status: 400,
    // },
    // {
    //   authorizedUserId: users.johnDoe.id,
    //   payload: {
    //     booleanValue: null,
    //     categoryId: activityCategories.reading.id,
    //     comment: "read about backend",
    //     date: "2022/08/10",
    //     quantitativeValue: 4.5,
    //   },
    //   responseBody: { fields: { date: "Should have format YYYY-MM-DD." } },
    //   status: 400,
    // },
  ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, createdRecord, responseError }) => {
    await authorize(authorizedUserId)
    const responseBody = await fetchGqlApi(`mutation CREATE_ACTIVITY_RECORD {
      ${queryNameAndInput} {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.data?.createActivityRecord).toEqual(createdRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})
