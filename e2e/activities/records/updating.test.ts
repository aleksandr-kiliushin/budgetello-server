import { activityCategories, activityRecords } from "#e2e/constants/activities"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

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
      queryNameAndInput: `updateActivityRecord(input: { id: ${activityRecords["5th"].id}, date: "20_08_10qwer" })`,
      updatedRecord: undefined,
      responseError: { fields: { date: "Should have format YYYY-MM-DD." } },
    },
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
  ])("$queryNameAndInput", async ({ queryNameAndInput, updatedRecord, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation UPDATE_ACTIVITY_RECORD {
      ${queryNameAndInput} {
        ${pickFields.activityRecord}
      }
    }`)
    expect(responseBody.data?.updateActivityRecord).toEqual(updatedRecord)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("updated record can be found by ID", async () => {
    await fetchGqlApi(`mutation UPDATE_ACTIVITY_RECORD {
      updateActivityRecord(input: { id: ${activityRecords["5th"].id}, comment: "read about CI", date: "2030-01-02", quantitativeValue: 6 }) {
        ${pickFields.activityRecord}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      activityRecord(id: ${activityRecords["5th"].id}) {
        ${pickFields.activityRecord}
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
