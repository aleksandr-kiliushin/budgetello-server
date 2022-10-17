// import { budgetCategories } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"

// import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

// describe("Find budget category", () => {
//   test.each<{
//     queryNameAndArgs: string
//     foundBoard: unknown
//     responseError: unknown
//   }>([
//     // {
//     //   query: `{
//     //     budgetCategory(id: ${budgetCategories.clothesExpense.id}) {
//     //       board { id, name },
//     //       id,
//     //       name,
//     //       type { id, name }
//     //     }
//     //   }`,
//     //   responseBody: { data: { budgetCategory: budgetCategories.clothesExpense } },
//     // },
//     // {
//     //   query: "/api/budget/categories/3",
//     //   responseBody: { message: "Access denied." },
//     // },
//     // {
//     //   query: "/api/budget/categories/666666",
//     //   responseBody: {},
//     // },
//   ])("$query", async ({ query, responseBody }) => {
//     expect(await fetchGqlApi(query)).toEqual(responseBody)
//   })
// })

// describe("Search budget categories", () => {
//   test.each<{ query: string; responseBody: unknown }>([
//     {
//       query: `{
//         budgetCategories(ids: [${budgetCategories.clothesExpense.id}]) {
//           board { id, name },
//           id,
//           name,
//           type { id, name }
//         }
//       }`,
//       responseBody: { data: { budgetCategories: [budgetCategories.clothesExpense] } },
//     },
//     {
//       query: `{
//         budgetCategories(boardsIds: [${boards.cleverBudgetiers.id}]) {
//           board { id, name },
//           id,
//           name,
//           type { id, name }
//         }
//       }`,
//       responseBody: {
//         data: { budgetCategories: [budgetCategories.clothesExpense, budgetCategories.educationExpense] },
//       },
//     },
//     {
//       query: `{
//         budgetCategories(ids: [${budgetCategories.educationExpense.id}, ${budgetCategories.giftsExpense.id}]) {
//           board { id, name },
//           id,
//           name,
//           type { id, name }
//         }
//       }`,
//       responseBody: {
//         data: { budgetCategories: [budgetCategories.educationExpense] },
//       },
//     },
//     {
//       query: `{
//         budgetCategories(ids: [${budgetCategories.salaryIncome.id}, 666666]) {
//           board { id, name },
//           id,
//           name,
//           type { id, name }
//         }
//       }`,
//       responseBody: {
//         data: { budgetCategories: [] },
//       },
//     },
//     {
//       query: `{
//         budgetCategories {
//           board { id, name },
//           id,
//           name,
//           type { id, name }
//         }
//       }`,
//       responseBody: {
//         data: { budgetCategories: [budgetCategories.clothesExpense, budgetCategories.educationExpense] },
//       },
//     },
//   ])("$query", async ({ query, responseBody }) => {
//     expect(await fetchGqlApi(query)).toEqual(responseBody)
//   })
// })
