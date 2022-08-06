import { IFinanceCategory } from "../../../src/interfaces/finance"
import { logIn } from "../../utils/logIn"

let authToken = ""
beforeEach(async () => {
  authToken = await logIn({ username: "john-doe", password: "john-doe-password" })
})

describe("Finance category creating", () => {
  it("returns a correct response after creating", async () => {
    const categoryCreatingResponse = await fetch("http://localhost:3080/api/finances/categories", {
      body: JSON.stringify({ name: "food", typeId: 1 }),
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    expect(categoryCreatingResponse.status).toEqual(201)
    expect(await categoryCreatingResponse.json()).toEqual<IFinanceCategory>({
      id: 6,
      name: "food",
      type: { id: 1, name: "expense" },
    })
  })
})
