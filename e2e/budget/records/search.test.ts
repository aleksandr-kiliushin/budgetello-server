import { boards } from "#e2e/constants/boards"
import { budgetCategories, budgetRecords } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

beforeEach(async () => {
  await authorize(users.johnDoe.username)
})

describe("Get budget record by ID", () => {
  test.each<{ query: string; responseBody: unknown }>([
    {
      query: `{
        budgetRecord(id: ${budgetRecords["1st"].id}) {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecord: budgetRecords["1st"] } },
    },
    // {
    //   query: `/api/budget/records/${budgetRecords["4th"].id}`,
    //   responseBody: { message: "Access denied." },
    // },
    // {
    //   query: "/api/budget/records/666",
    //   responseBody: { message: "Record with ID '666' not found." },
    // },
  ])("$query", async ({ query, responseBody }) => {
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})

describe("Budget records search", () => {
  test.each<{ query: string; responseBody: unknown }>([
    {
      query: `{
        budgetRecords {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecords: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]] } },
    },
    {
      query: `{
        budgetRecords(boardsIds: [${boards.cleverBudgetiers.id}, 666666]) {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecords: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]] } },
    },
    {
      query: `{
        budgetRecords(boardsIds: [666666]) {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecords: [] } },
    },
    {
      query: `{
        budgetRecords(boardsIds: [${boards.megaEconomists.id}]) {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecords: [] } },
    },
    {
      query: `{
        budgetRecords(categoriesIds: [${budgetCategories.educationExpense.id}]) {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecords: [budgetRecords["3rd"], budgetRecords["2nd"]] } },
    },
    {
      query: `{
        budgetRecords(dates: ["2022-08-01"]) {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecords: [budgetRecords["3rd"], budgetRecords["2nd"], budgetRecords["1st"]] } },
    },
    {
      query: `{
        budgetRecords(amount: ${budgetRecords["2nd"].amount}) {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecords: [budgetRecords["2nd"]] } },
    },
    {
      query: `{
        budgetRecords(orderingByDate: "ASC", orderingById: "ASC", isTrashed: true, skip: 1, take: 1) {
          amount,
          category {
            board {id, name},
            id,
            name,
            type { id, name }
          },
          date,
          id,
          isTrashed
        }
      }`,
      responseBody: { data: { budgetRecords: [budgetRecords["2nd"]] } },
    },
    // {
    //   url: `/api/budget/records/search?isTrashed=hehe`,
    //   responseBody: {
    //     query: {
    //       isTrashed: "Should be a boolean.",
    //     },
    //   },
    //   responseStatus: 400,
    // },
  ])("$query", async ({ query, responseBody }) => {
    expect(await fetchGqlApi(query)).toEqual(responseBody)
  })
})
