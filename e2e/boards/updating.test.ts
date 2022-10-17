import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { QueryFields } from "#e2e/helpers/QueryFields"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"

describe("Board updating", () => {
  test.each<{
    authorizedUserId: ITestUserId
    queryNameAndInput: string
    updatedBoard: unknown
    responseError: Record<string, unknown> | undefined
  }>([
    {
      authorizedUserId: users.jessicaStark.id,
      queryNameAndInput: `updateBoard(input: { id: ${boards.cleverBudgetiers.id} })`,
      updatedBoard: undefined,
      responseError: { message: "Access denied." },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateBoard(input: { id: ${boards.cleverBudgetiers.id}, name: "" })`,
      updatedBoard: undefined,
      responseError: { fields: { name: "Required." } },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateBoard(input: { id: ${boards.cleverBudgetiers.id}, subjectId: 666666 })`,
      updatedBoard: undefined,
      responseError: { fields: { subjectId: "Invalid board subject." } },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateBoard(input: { id: ${boards.cleverBudgetiers.id}, name: "${boards.megaEconomists.name}" })`,
      updatedBoard: undefined,
      responseError: {
        fields: {
          name: '"mega-economists" budget board already exists.',
          subjectId: '"mega-economists" budget board already exists.',
        },
      },
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateBoard(input: { id: ${boards.cleverBudgetiers.id} })`,
      updatedBoard: boards.cleverBudgetiers,
      responseError: undefined,
    },
    {
      authorizedUserId: users.johnDoe.id,
      queryNameAndInput: `updateBoard(input: { id: ${boards.cleverBudgetiers.id}, name: "champions", subjectId: ${boardSubjects.activities.id} })`,
      updatedBoard: {
        admins: [users.johnDoe],
        id: boards.cleverBudgetiers.id,
        members: [users.johnDoe, users.jessicaStark],
        name: "champions",
        subject: boardSubjects.activities,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, updatedBoard, responseError }) => {
    await authorize(authorizedUserId)
    const responseBody = await fetchGqlApi(`mutation UPDATE_BOARD {
      ${queryNameAndInput} {
        ${QueryFields.board}
      }
    }`)
    expect(responseBody.data?.updateBoard).toEqual(updatedBoard)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("fetching updated board returns actual data", async () => {
    await authorize(users.johnDoe.id)
    await fetchGqlApi(`mutation UPDATE_BOARD {
      updateBoard(input: { id: ${boards.cleverBudgetiers.id}, name: "champions", subjectId: ${boardSubjects.activities.id} }) {
        ${QueryFields.board}
      }
    }`)
    const responseBody = await fetchGqlApi(`{
      board(id: ${boards.cleverBudgetiers.id}) {
        ${QueryFields.board}
      }
    }`)
    expect(responseBody.data).toEqual({
      board: {
        admins: [users.johnDoe],
        id: boards.cleverBudgetiers.id,
        members: [users.johnDoe, users.jessicaStark],
        name: "champions",
        subject: boardSubjects.activities,
      },
    })
  })
})
