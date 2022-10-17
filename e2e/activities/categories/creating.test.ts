import { activityCategoryMeasurementTypes } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Activity category creating", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndInput: string
    createdCategory: unknown
    responseError: unknown
  }>([
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `createActivityCategory(input: { boardId: ${boards.productivePeople.id}, measurementTypeId: ${activityCategoryMeasurementTypes.quantitative.id}, name: "medidate", unit: null })`,
      createdCategory: undefined,
      responseError: {
        fields: {
          measurementTypeId: "Unit is required for «Quantitative» activities.",
          unit: "Unit is required for «Quantitative» activities.",
        },
      },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `createActivityCategory(input: { boardId: ${boards.productivePeople.id}, measurementTypeId: ${activityCategoryMeasurementTypes.quantitative.id}, name: "reading", unit: "page" })`,
      createdCategory: undefined,
      responseError: {
        fields: {
          boardId: "Similar «reading» category already exists in this board.",
          measurementType: "Similar «reading» category already exists in this board.",
          name: "Similar «reading» category already exists in this board.",
          unit: "Similar «reading» category already exists in this board.",
        },
      },
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndInput: `createActivityCategory(input: { boardId: ${boards.productivePeople.id}, measurementTypeId: ${activityCategoryMeasurementTypes.quantitative.id}, name: "reading", unit: "page" })`,
      createdCategory: {
        board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
        id: 7,
        measurementType: activityCategoryMeasurementTypes.quantitative,
        name: "reading",
        owner: users.jessicaStark,
        unit: "page",
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, createdCategory, responseError }) => {
    await authorize(authorizedUserId)
    const responseBody = await fetchGqlApi(`mutation CREATE_ACTIVITY_CATEGORY {
      ${queryNameAndInput} {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.data?.createActivityCategory).toEqual(createdCategory)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("created category can be found by ID", async () => {
    await authorize(users.jessicaStark.id)
    await fetchGqlApi(`mutation CREATE_ACTIVITY_CATEGORY {
      createActivityCategory(input: { boardId: ${boards.productivePeople.id}, measurementTypeId: ${activityCategoryMeasurementTypes.quantitative.id}, name: "reading", unit: "page" }) {
        ${QueryFields.activityCategory}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      activityCategory(id: 7) {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.data).toEqual({
      activityCategory: {
        board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
        id: 7,
        measurementType: activityCategoryMeasurementTypes.quantitative,
        name: "reading",
        owner: users.jessicaStark,
        unit: "page",
      },
    })
  })
})
