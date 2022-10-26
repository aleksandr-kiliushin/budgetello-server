import { currencies } from "#e2e/constants/currencies"
import { users } from "#e2e/constants/users"
import { authorize } from "#e2e/helpers/authorize"
import { fetchGqlApi } from "#e2e/helpers/fetchGqlApi"
import { pickFields } from "#e2e/helpers/pickFields"

beforeEach(async () => {
  await authorize(users.johnDoe.id)
})

describe("get currencies", () => {
  it("responds with all currencies list", async () => {
    const response = await fetchGqlApi(`{
      currencies {
        ${pickFields.currency}
      }
    }`)
    expect(response.data).toEqual({ currencies: [currencies.gel, currencies.usd] })
  })

  it("responds with a currency for a given slug", async () => {
    const response = await fetchGqlApi(`{
      currency(slug: "${currencies.usd.slug}") {
        ${pickFields.currency}
      }
    }`)
    expect(response.data).toEqual({ currency: currencies.usd })
  })
})
