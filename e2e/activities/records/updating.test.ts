import { activityCategories, activityRecords } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Activity record updating", () => {
  test.each<{
    queryNameAndInput: string
    updatedRecord: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `updateActivityRecord(input: { id: ${activityRecords["5th"].id}, categoryId: 666666 })`,
      updatedRecord: undefined,
      responseError: { fields: { categoryId: "Invalid value." } },
    },
    {
      queryNameAndInput: `updateActivityRecord(input: { id: ${activityRecords["5th"].id}, quantitativeValue: null })`,
      updatedRecord: undefined,
      responseError: {
        fields: {
          categoryId: "Amount should be filled for «Quantitative» activity.",
          quantitativeValue: "Amount should be filled for «Quantitative» activity.",
        },
      },
    },
    {
      queryNameAndInput: `updateActivityRecord(input: { id: ${activityRecords["1st"].id} })`,
      updatedRecord: undefined,
      responseError: { message: "Access denied." },
    },
    {
      queryNameAndInput: `updateActivityRecord(input: { id: ${activityRecords["5th"].id} })`,
      updatedRecord: activityRecords["5th"],
      responseError: undefined,
    },
    {
      queryNameAndInput: `updateActivityRecord(input: { id: ${activityRecords["5th"].id}, comment: "read about CI", date: "2030-01-02", quantitativeValue: 6 })`,
      updatedRecord: {
        booleanValue: null,
        category: activityCategories.reading,
        comment: "read about CI",
        date: "2030-01-02",
        id: 5,
        quantitativeValue: 6,
      },
      responseError: undefined,
    },
    // {
    //   url: `/api/activities/records/${activityRecords["5th"].id}`,
    //   payload: { date: "20_08_10qwer" },
    //   responseBody: { fields: { date: "Should have format YYYY-MM-DD." } },
    //   status: 400,
    // },
  ])("$queryNameAndInput", async ({ queryNameAndInput, updatedRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation UPDATE_ACTIVITY_RECORD {
      ${queryNameAndInput} {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.data?.updateActivityRecord).toEqual(updatedRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("updated record can be found by ID", async () => {
    await fetchGqlApi(`mutation UPDATE_ACTIVITY_RECORD {
      updateActivityRecord(input: { id: ${activityRecords["5th"].id}, comment: "read about CI", date: "2030-01-02", quantitativeValue: 6 }) {
        ${QueryFields.activityRecord}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      activityRecord(id: ${activityRecords["5th"].id}) {
        ${QueryFields.activityRecord}
      }
    }`)
    expect(responseBody.data).toEqual({
      activityRecord: {
        booleanValue: null,
        category: activityCategories.reading,
        comment: "read about CI",
        date: "2030-01-02",
        id: 5,
        quantitativeValue: 6,
      },
    })
  })
})
