const config = {
  moduleNameMapper: {
    // "\\.module\\.scss$": "<rootDir>/src/utils/testing/scss-modules-mock.ts",
    // "^#components(.*)$": "<rootDir>/src/components$1",
    // "^#store(.*)$": "<rootDir>/src/store$1",
    // "^#views(.*)$": "<rootDir>/src/views$1",
    // "^#utils(.*)$": "<rootDir>/src/utils$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist", "<rootDir>/node_modules"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testEnvironment: "node",
}

export default config
