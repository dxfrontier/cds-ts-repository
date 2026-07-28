# Testing

How to run the test suites of `cds-ts-repository`. All commands run from the repository root; the suites exercise the CAP fixture app in `test/bookshop` (installed as an npm workspace).

## Installation

```bash
npm install
```

## Unit / integration tests

```bash
npm test
```

Runs the Jest suites in `test/unit`; each suite boots the `bookshop` app in-memory (`@cap-js/cds-test` + SQLite). Run a single file with:

```bash
npx jest test/unit/active-entity/SELECT.test.ts
```

## e2e tests

```bash
npm run test:e2e
```

Starts the `bookshop` server together with a mocked `API_BUSINESS_PARTNER` service, then runs the Newman collection from `test/e2e/collection.json` against `http://localhost:4004`.
