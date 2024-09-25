// jest.config.ts
import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./src/test/jest.startup.ts",
  globalTeardown: "./src/test/jest.teardown.ts",
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@test/(.*)$": "<rootDir>/src/test/$1",
  },
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { diagnostics: true }],
  },
};

export default config;
