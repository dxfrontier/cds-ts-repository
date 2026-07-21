# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@dxfrontier/cds-ts-repository` — an npm library that gives SAP CAP TypeScript projects a typed `BaseRepository<T>` / `BaseRepositoryDraft<T>` data-access layer on top of CDS-QL. Source lives in `lib/`, the package is published from `dist/` (CJS + ESM + bundled d.ts, built with tsup). Peer dependency `@sap/cds ^9 || ^10`, Node.js >= 22.

## Commands

- `npm test` — Jest unit/integration suites. No build step needed first: tests import `lib/` sources directly (transpiled by `@swc/jest`), and each suite boots the CAP fixture app `test/bookshop` in-memory via `@cap-js/cds-test` (SQLite).
- `npx jest test/unit/active-entity/SELECT.test.ts` — single file; add `-t 'name'` for a single test.
- `npm run test:e2e` — starts the bookshop server plus a mocked `API_BUSINESS_PARTNER` service, then runs the Newman collection in `test/e2e/collection.json`.
- `npm run build` — cleans `dist/` and rebuilds with tsup.
- `npm run lint:format:fix` — ESLint `--fix`, then Prettier `--write` (note: `*.md` is prettier-ignored).

Commit messages must follow Conventional Commits (commitlint via husky; `npm run commit` gives a prompted flow). Releases are fully automated when a PR merges to `main` (`dxfrontier/gh-action-release` + git-cliff): never bump `version` in `package.json` and never edit `CHANGELOG.md` by hand.

## Architecture

- `lib/index.ts` is the public surface: `BaseRepository`, `BaseRepositoryDraft`, the `@ExternalService` decorator, `Filter`, all types, and a re-export of `Mixin` from ts-mixer (consumers combine both repositories via `class X extends Mixin(BaseRepository<T>, BaseRepositoryDraft<T>)`).
- `BaseRepository<T>` and `BaseRepositoryDraft<T>` (`lib/core/`) are thin typed facades: every method delegates to `CoreRepository` (`lib/core/CoreRepository.ts`), which builds CDS-QL queries with the global `INSERT / SELECT / UPDATE / UPSERT / DELETE` from `@sap/cds`. The draft variant is the same `CoreRepository` typed as `Draft<T>` (adds `IsActiveEntity` etc.), with `*Draft`-suffixed method names.
- Dual execution path: every `CoreRepository` method branches on whether an external service is attached — plain awaited CDS-QL against the primary database, or `externalService.run(query)` for remote OData services. `@ExternalService('NAME')` (`lib/decorators/class.ts`) resolves `cds.connect.to(NAME)` and stores the connected service on the class constructor; `BaseRepository`'s constructor picks it up and re-resolves the entity from that service's entity set (`lib/util/util.ts`). A new `CoreRepository` method must handle both branches — or throw explicitly, as `getLocaleTexts` / `updateOrCreate` do for the external path.
- `.builder()` returns `FindBuilder` / `FindOneBuilder` (`lib/util/find/`), the chainable query API (`columns`, `columnsFormatter`, `getExpand`, `orderAsc`, `paginate`, …). Shared state lives in `BaseFind`; column aggregation/formatting and deep-expand processing live in `lib/util/find/helper/`.
- `Filter<T>` (`lib/util/filter/Filter.ts`) is a typed filter tree (field/operator/value, combinable with `'AND'`/`'OR'`). `coreRepositoryUtils.buildQueryKeys` converts either a plain keys object or a `Filter` into a CDS-QL where clause — that is why most repository methods are overloaded on `keys | Filter`.
- The type layer (`lib/types/types.ts`) carries much of the API contract: `ExtractSingular` (lets repositories accept plural cds-typer types), `Draft<T>`, `NumericKeys` / `IncrementFields` (constrain increment/decrement to numeric columns), `ShowOnlyColumns`, `InsertResult`, …

## Test fixture

`test/bookshop` is an npm workspace containing a full CAP app (CDS schema, services, CSV data). The `#cds-models/*` alias resolves to its committed cds-typer output — wired in root `package.json` `imports` (runtime) and `tsconfig.json` `paths` (types). Regenerate `@cds-models` with cds-typer when `test/bookshop/db/schema.cds` changes. External-service behavior is tested against `test/util/fakeExternalService.ts`, not a live connection.

## TypeScript pin

`typescript` is intentionally pinned to `~6.0.3` — do not upgrade to TS 7 (typescript-eslint, typedoc, and tsup's dts bundler don't support it yet; decision from 2026-07). Related: `ignoreDeprecations: '6.0'` in `tsup.config.ts` works around rollup-plugin-dts forcing the deprecated `baseUrl` onto the dts build — keep it when touching that file.
