import { boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Board deleting", () => {
  it("restricts deleting others' boards", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_BOARD {
      deleteBoard(id: ${boards.beautifulSportsmen.id}) {
        ${pickFields.board}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Access denied." })
  })

  it("deleting returns a correct response", async () => {
    const responseBody = await fetchGqlApi(`mutation DELETE_BOARD {
      deleteBoard(id: ${boards.cleverBudgetiers.id}) {
        ${pickFields.board}
      }
    }`)
    expect(responseBody.data).toEqual({ deleteBoard: boards.cleverBudgetiers })
  })

  it("the deleted board is not found", async () => {
    await fetchGqlApi(`mutation DELETE_BOARD {
      deleteBoard(id: ${boards.cleverBudgetiers.id}) {
        ${pickFields.board}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      board(id: ${boards.cleverBudgetiers.id}) {
        ${pickFields.board}
      }
    }`)
    expect(responseBody.errors[0].extensions.exception.response).toEqual({ message: "Not found." })
  })
})
