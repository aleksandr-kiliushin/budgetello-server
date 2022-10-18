import { budgetRecords } from "#e2e/constants/budget"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Budget record deleting", () => {
  it("deleting returns a correct response", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_BUDGET_RECORD {
      deleteBudgetRecord(id: ${budgetRecords["2nd"].id}) {
        ${pickFields.budgetRecord}
      }
    }`)
    expect(responseBody.data).toEqual({ deleteBudgetRecord: budgetRecords["2nd"] })
  })

  it("deleted record not found", async () => {
    await fetchGqlApi(`mutation DELETE_BUDGET_RECORD {
      deleteBudgetRecord(id: ${budgetRecords["2nd"].id}) {
        ${pickFields.budgetRecord}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      budgetRecord(id: ${budgetRecords["2nd"].id}) {
        ${pickFields.budgetRecord}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual({ message: "Not found." })
  })

  it("a user cannot delete a record of a board that they is not a member of", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_BUDGET_RECORD {
      deleteBudgetRecord(id: ${budgetRecords["5th"].id}) {
        ${pickFields.budgetRecord}
      }
    }`)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual({ message: "Access denied." })
  })
})
