import { users } from "#e2e/constants/users"

describe("Authorization", () => {
  it("invalid username", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation AUTHORIZE {
          authorize (input: { username: "nonexistent-username", password: "some-password" })
        }`,
      }),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody.errors[0].extensions.exception.response).toEqual({
      fields: { username: "User not found." },
    })
  })

  it("invalid password", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation AUTHORIZE {
          authorize (input: { username: "john-doe", password: "some-password" })
        }`,
      }),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody.errors[0].extensions.exception.response).toEqual({
      fields: { password: "Invalid password." },
    })
  })

  it("returns an authorization token on success", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation AUTHORIZE {
          authorize (input: { username: "${users.johnDoe.username}", password: "john-doe-password" })
        }`,
      }),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody).toEqual({ data: { authorize: expect.stringMatching(".+") } })
  })

  it("validates authorization inputs", async () => {
    const response = await fetch("http://localhost:3080/graphql", {
      body: JSON.stringify({
        query: `mutation AUTHORIZE {
          authorize (input: { username: "", password: "" })
        }`,
      }),
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      method: "POST",
    })
    const responseBody = await response.json()
    expect(responseBody.errors?.[0]?.extensions?.exception?.response).toEqual({
      fields: { username: "Required.", password: "Required." },
    })
  })
})
