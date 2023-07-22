import { setAuthorizationToken } from "#e2e/helpers/authorization-token"

const { execSync } = require("child_process")

beforeEach(async () => {
  execSync(
    'echo "bash /var/app/database/scripts/restore-db-from-testing-template.sh" | docker exec -i budgetello-database bash;'
  )
})

afterEach(() => {
  setAuthorizationToken("")
})

afterAll(() => {
  execSync(
    'echo "bash /var/app/database/scripts/restore-db-from-testing-template.sh" | docker exec -i budgetello-database bash;'
  )
})
