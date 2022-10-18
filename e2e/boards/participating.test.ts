import { boardSubjects, boards } from "#e2e/constants/boards"
import { users } from "#e2e/constants/users"
import { ITestUserId, authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

describe("Boards participating", () => {
  describe("Add member", () => {
    test.each<{
      authorizedUserId: ITestUserId
      queryNameAndInput: string
      updatedBoard: unknown
      responseError: unknown
    }>([
      {
        authorizedUserId: users.johnDoe.id,
        queryNameAndInput: `addBoardMember (input: { boardId: ${boards.beautifulSportsmen.id}, userId: ${users.johnDoe.id} })`,
        updatedBoard: undefined,
        responseError: { message: "Access denied." },
      },
      {
        authorizedUserId: users.johnDoe.id,
        queryNameAndInput: `addBoardMember (input: { boardId: ${boards.cleverBudgetiers.id}, userId: ${users.jessicaStark.id} })`,
        updatedBoard: undefined,
        responseError: { message: "The user is already a member of the board." },
      },
      {
        authorizedUserId: users.jessicaStark.id,
        queryNameAndInput: `addBoardMember (input: { boardId: ${boards.beautifulSportsmen.id}, userId: ${users.johnDoe.id} })`,
        updatedBoard: {
          admins: [users.jessicaStark],
          id: boards.beautifulSportsmen.id,
          members: [users.johnDoe, users.jessicaStark],
          name: boards.beautifulSportsmen.name,
          subject: boardSubjects.activities,
        },
        responseError: undefined,
      },
    ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, updatedBoard, responseError }) => {
      await authorize(authorizedUserId)
      const responseBody = await fetchGqlApi(`mutation ADD_MEMBER_TO_BOARD {
        ${queryNameAndInput} {
          ${pickFields.board}
        }
      }`)
      expect(responseBody.data?.addBoardMember).toEqual(updatedBoard)
      expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
    })
  })

  describe("Remove member", () => {
    test.each<{
      authorizedUserId: ITestUserId
      queryNameAndInput: string
      updatedBoard: unknown
      responseError: unknown
    }>([
      {
        authorizedUserId: users.johnDoe.id,
        queryNameAndInput: `removeBoardMember (input: { boardId: ${boards.beautifulSportsmen.id}, memberId: ${users.jessicaStark.id} })`,
        updatedBoard: undefined,
        responseError: { message: "Access denied." },
      },
      {
        authorizedUserId: users.jessicaStark.id,
        queryNameAndInput: `removeBoardMember (input: { boardId: ${boards.productivePeople.id}, memberId: ${users.johnDoe.id} })`,
        updatedBoard: undefined,
        responseError: { message: "Access denied." },
      },
      {
        authorizedUserId: users.johnDoe.id,
        queryNameAndInput: `removeBoardMember (input: { boardId: ${boards.productivePeople.id}, memberId: ${users.jessicaStark.id} })`,
        updatedBoard: {
          admins: [users.johnDoe],
          id: boards.productivePeople.id,
          members: [users.johnDoe],
          name: boards.productivePeople.name,
          subject: boardSubjects.activities,
        },
        responseError: undefined,
      },
    ])("$queryNameAndInput", async ({ authorizedUserId, queryNameAndInput, updatedBoard, responseError }) => {
      await authorize(authorizedUserId)
      const responseBody = await fetchGqlApi(`mutation REMOVE_BOARD_MEMBER {
        ${queryNameAndInput} {
          ${pickFields.board}
        }
      }`)
      expect(responseBody.data?.removeBoardMember).toEqual(updatedBoard)
      expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual(responseError)
    })
  })
})
