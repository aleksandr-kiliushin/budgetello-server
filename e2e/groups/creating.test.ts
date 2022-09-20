import { authorize } from "../helpers/authorize"
import { fetchApi } from "../helpers/fetchApi"

beforeEach(async () => {
  await authorize("john-doe")
})

describe("Group creating", () => {
  test.each<{
    payload: Record<string, unknown>
    response: Record<string, unknown>
    status: number
  }>([
    {
      payload: { name_WITH_A_TYPO: "food", subjectId: 1 },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "", subjectId: 1 },
      response: { fields: { name: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "food", subjectId_WITH_A_TYPO: 1 },
      response: { fields: { subjectId: "Required field." } },
      status: 400,
    },
    {
      payload: { name: "food", subjectId: 1234123 },
      response: { fields: { subjectId: "Invalid subject." } },
      status: 400,
    },
    {
      payload: { name: "clever-financiers", subjectId: 1 },
      response: {
        fields: {
          name: '"clever-financiers" finances group already exists.',
          subjectId: '"clever-financiers" finances group already exists.',
        },
      },
      status: 400,
    },
    {
      payload: { name: "champions", subjectId: 2 },
      response: { id: 3, name: "champions", subject: { id: 2, name: "habits" }, users: [] },
      status: 201,
    },
  ])("Group creating case #%#", async ({ payload, response, status }) => {
    const groupResponse = await fetchApi("/api/groups", {
      body: JSON.stringify(payload),
      method: "POST",
    })
    expect(groupResponse.status).toEqual(status)
    expect(await groupResponse.json()).toEqual(response)
  })

  // it("a newly created group is presented in all groups list", async () => {
  //   await fetchApi("/api/groups", { body: JSON.stringify({ name: "food", typeId: 1 }), method: "POST" })
  //   const getAllCategoriesResponse = await fetchApi("/api/finances/categories/search")
  //   expect(await getAllCategoriesResponse.json()).toContainEqual<IFinanceCategory>({
  //     id: 6,
  //     name: "food",
  //     type: { id: 1, name: "expense" },
  //   })
  // })

  // it("a newly created category can be found by ID", async () => {
  //   await fetchApi("/api/finances/categories", { body: JSON.stringify({ name: "food", typeId: 1 }), method: "POST" })
  //   const getNewlyCreatedCategoryResponse = await fetchApi("/api/finances/categories/6")
  //   expect(await getNewlyCreatedCategoryResponse.json()).toEqual<IFinanceCategory>({
  //     id: 6,
  //     name: "food",
  //     type: { id: 1, name: "expense" },
  //   })
  // })
})
