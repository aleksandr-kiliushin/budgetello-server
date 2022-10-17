import { activityCategories } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Activity record creating", () => {
  test.each<{
    queryNameAndInput: string
    createdRecord: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `createActivityRecord(input: { booleanValue: true, categoryId: ${activityCategories.reading.id}, comment: "read about backend", date: "2022/08/10", quantitativeValue: 123 })`,
      createdRecord: undefined,
      responseError: { fields: { date: "Should have format YYYY-MM-DD." } },
    },
    {
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
  ])("$queryNameAndInput", async ({ queryNameAndInput, createdRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation CREATE_ACTIVITY_RECORD {
      ${queryNameAndInput} {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.data?.createActivityRecord).toEqual(createdRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("created category can be found by ID", async () => {
    await fetchGqlApi(`mutation CREATE_ACTIVITY_RECORD {
      createActivityRecord(input: { booleanValue: null, categoryId: ${activityCategories.reading.id}, comment: "read about backend", date: "2022-08-10", quantitativeValue: 4.5 }) {
        ${QueryFields.activityRecord}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      activityRecord(id: 8) {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.data).toEqual({
      activityRecord: {
        booleanValue: null,
        category: activityCategories.reading,
        comment: "read about backend",
        date: "2022-08-10",
        id: 8,
        quantitativeValue: 4.5,
      },
    })
  })
})
