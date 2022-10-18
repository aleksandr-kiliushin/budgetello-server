import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("Board creating", () => {
  test.each<{
    queryNameAndInput: string
    createdBoard: unknown
    responseError: unknown
  }>([
    {
      queryNameAndInput: `createBoard(input: { name: "food", subjectId: 1234123 })`,
      createdBoard: undefined,
      responseError: { fields: { subjectId: "Invalid subject." } },
    },
    {
      queryNameAndInput: `createBoard(input: { name: "${boards.cleverBudgetiers.name}", subjectId: ${boards.cleverBudgetiers.subject.id} })`,
      createdBoard: undefined,
      responseError: {
        fields: {
          name: '"clever-budgetiers" budget board already exists.',
          subjectId: '"clever-budgetiers" budget board already exists.',
        },
      },
    },
    {
      queryNameAndInput: `createBoard(input: { name: "champions", subjectId: ${boardSubjects.activities.id} })`,
      createdBoard: {
        admins: [users.johnDoe],
        id: 5,
        members: [users.johnDoe],
        name: "champions",
        subject: boardSubjects.activities,
      },
      responseError: undefined,
    },
  ])("$queryNameAndInput", async ({ queryNameAndInput, createdBoard, responseError }) => {
    const responseBody = await fetchGqlApi(`mutation CREATE_BOARD {
      ${queryNameAndInput} {
        ${pickFields.board}
      }
    }`)
    expect(responseBody.data?.createBoard).toEqual(createdBoard)
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
  })

  it("created board is found successfully", async () => {
    await fetchGqlApi(`mutation CREATE_BOARD {
      createBoard(input: { name: "champions", subjectId: ${boardSubjects.activities.id} }) {
        ${pickFields.board}
      }
    }`)
    const fetchCreatedBoardResponseBody = await fetchGqlApi(`{
      board(id: 5) {
        ${pickFields.board}
      }
    }`)
    expect(fetchCreatedBoardResponseBody.data).toEqual({
      board: {
        admins: [users.johnDoe],
        id: 5,
        members: [users.johnDoe],
        name: "champions",
        subject: boardSubjects.activities,
      },
    })
  })
})
