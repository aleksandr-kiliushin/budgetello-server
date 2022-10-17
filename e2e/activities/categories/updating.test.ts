import { activityCategories, activityCategoryMeasurementTypes } from "#e2e/constants/activities"
import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Activity category updating", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndInput: string
    updatedCategory: unknown
    responseError: unknown
  }>([
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateActivityCategory(input: { id: ${activityCategories.reading.id}, name: "" })`,
      updatedCategory: undefined,
      responseError: {
        fields: {
          name: "Required.",
        },
      },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateActivityCategory(input: { id: ${activityCategories.reading.id}, unit: "" })`,
      updatedCategory: undefined,
      responseError: {
        fields: {
          measurementTypeId: "Unit is required for «Quantitative» activities.",
          unit: "Unit is required for «Quantitative» activities.",
        },
      },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateActivityCategory(input: { id: ${activityCategories.reading.id}, unit: null })`,
      updatedCategory: undefined,
      responseError: {
        fields: {
          measurementTypeId: "Unit is required for «Quantitative» activities.",
          unit: "Unit is required for «Quantitative» activities.",
        },
      },
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndInput: `updateActivityCategory(input: { id: ${activityCategories.running.id}, name: "${activityCategories.pushups.name}", unit: "${activityCategories.pushups.unit}" })`,
      updatedCategory: undefined,
      responseError: {
        fields: {
          boardId: "Similar «pushups» category already exists in this board.",
          measurementType: "Similar «pushups» category already exists in this board.",
          name: "Similar «pushups» category already exists in this board.",
          unit: "Similar «pushups» category already exists in this board.",
        },
      },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateActivityCategory(input: { id: ${activityCategories.running.id}, name: "writing conspects" })`,
      updatedCategory: undefined,
      responseError: { message: "Access denied." },
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndInput: `updateActivityCategory(input: { id: ${activityCategories.reading.id} })`,
      updatedCategory: undefined,
      responseError: { message: "Access denied." },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateActivityCategory(input: { id: ${activityCategories.reading.id} })`,
      updatedCategory: activityCategories.reading,
      responseError: undefined,
    },
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndInput: `updateActivityCategory(input: { id: ${activityCategories.sleep.id}, boardId: ${boards.productivePeople.id}, measurementTypeId: ${activityCategoryMeasurementTypes.boolean.id}, name: "meditate", unit: null })`,
      updatedCategory: {
        board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
        id: 4,
        measurementType: activityCategoryMeasurementTypes.boolean,
        name: "meditate",
        owner: users.jessicaStark,
        unit: null,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, updatedCategory, responseError }) => {
    await authorize(authorizedUserId)
    const responseBody = await fetchGqlApi(`mutation UPDATE_ACTIVITY_CATEGORY {
      ${queryNameAndInput} {
        ${QueryFields.activityCategory}
      }
    }`)
    expect(responseBody.data?.updateActivityCategory).toEqual(updatedCategory)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })
})
