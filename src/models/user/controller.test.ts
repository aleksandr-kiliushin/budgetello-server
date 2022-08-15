import { Test } from "@nestjs/testing"

import { UserController } from "./controller"
import { UserEntity } from "./entities/user.entity"
import { UserService } from "./service"

const users: UserEntity[] = [
  { id: 1, username: "john-doe", password: "8bd309ffba83c3db9a53142b052468007b" },
  { id: 2, username: "jessica-stark", password: "8bd912e2fe84cd93c457142a1d7e77136c3bc954f183" },
]

describe("UserController", () => {
  let userController: UserController
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return { searchUsers: jest.fn().mockResolvedValue(users) }
        }
      })
      .compile()
    userController = moduleRef.get<UserController>(UserController)
  })

  describe("getAll", () => {
    it("should return an array of users", async () => {
      expect(await userController.searchUsers({ id: "1", username: "heh" })).toBe(users)
    })
  })
})
