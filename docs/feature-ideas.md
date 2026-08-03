# Feature Ideas & Roadmap

Living backlog of candidate functionalities for `@dxfrontier/cds-ts-repository`, based on a scouting pass (2026-07-28) across:

- **CDS-QL / CAP Node.js release notes** — CDS 9.x (May 2025 → Apr 2026) and CDS 10 (Jun 2026)
- **CAP ecosystem** — cap-js plugins, `cds-ts-dispatcher`, community projects (no direct competitor found: nothing else offers a typed repository over CDS-QL)
- **Mainstream TS ORMs** — TypeORM, Prisma, MikroORM, Drizzle (feature inspiration)

**How to use this doc:** pick an idea, move its status forward, brainstorm the API shape, then spec + implement. Update the status line when work starts/ships. Statuses: `idea` → `design` → `in progress` → `shipped` / `rejected`.

---

## Cross-cutting design constraints

Apply to *every* feature below:

1. **External service branch** — each new `CoreRepository` method must define behavior for the `@ExternalService` path: either implement via `externalService.run(query)` or throw explicitly (pattern: `getLocaleTexts` / `updateOrCreate`). Streaming and locking features will almost certainly throw there.
2. **Draft parity** — decide per feature whether a `*Draft` variant makes sense in `BaseRepositoryDraft`.
3. **Type layer first** — the API contract lives in `lib/types/types.ts` (`NumericKeys`-style constraints); new features should constrain columns at the type level the same way.
4. **Testability** — must be testable against the `test/bookshop` SQLite fixture (this is why vector search only became a candidate once SQLite emulation landed).

---

## Tier 1 — recommended next

### 1. Streaming API — `status: shipped` (2026-07-31, `feat/tier1-roadmap-pack`)

Stream large result sets without materializing them in memory.

```ts
await repo.builder().find(filter).stream();          // Readable stream
await repo.builder().find(filter).forEach(row => …); // async iteration
await repo.builder().find(filter).pipeline(res);     // pipe into HTTP response
```

- **Source:** new cds-ql `SELECT ... .stream()` / `.pipeline()` / `for await` (CDS 9); MikroORM/Drizzle async iterators.
- **Notes:** terminal builder methods next to `execute()`. External-service branch: throw.

### 2. Filter v2 — path expressions & EXISTS — `status: shipped` (2026-07-31, `feat/tier1-roadmap-pack`)

Extend `Filter<T>` beyond flat fields:

- Path expressions across associations: `new Filter<Book>({ field: 'author.name', operator: 'EQUALS', value: 'Poe' })`
- Association existence: `EXISTS` / `NOT EXISTS` operators with an inner filter (CQL `exists books[year = 2000]`).

- **Source:** CQL exists predicates + infix filters; Prisma relation filters (`some`/`none`/`every`).
- **Notes:** biggest type-level effort (dotted-path typing against cds-typer types). `buildQueryKeys` in `coreRepositoryUtils` is the conversion point.

### 3. Builder completions — `having`, `findAndCount`, cursor pagination — `status: shipped` (2026-07-31, `feat/tier1-roadmap-pack`; shipped as `.having()` and `.executeAndCount()`; cursor pagination was implemented but descoped on 2026-07-31 by user decision — removed before release)

- `.having(filter)` after `.groupBy(...)` — exists in CQL today, missing in `FindBuilder`.
- `.executeAndCount()` → `{ rows, total }` — every surveyed ORM has it; saves the second round-trip pattern.
- Keyset/cursor pagination beside offset `paginate` (stable iteration under concurrent writes; offset `.limit()` may skip/duplicate rows).

- **Source:** all four ORMs; cds-ql `.limit()` semantics note in capire.

### 4. Draft parity pack — `status: shipped` (2026-07-31, `feat/tier1-roadmap-pack`; `createDraft` / `createManyDrafts` / `updateOrCreateDraft`, external services throw)

`BaseRepositoryDraft` currently has **no create at all**. Add: `createDraft`, `createManyDrafts`, `updateOrCreateDraft`.

- **Source:** gap analysis; unblocked by CDS 9 "direct CRUD on draft entities" (beta, Dec 2025).
- **Notes:** beta dependency — verify behavior on current `@sap/cds` before committing to the API; drafts normally originate via the `NEW` draft event.

### 5. Vector similarity search — `status: idea`

Support `cds.Vector` columns + a similarity query API (cosine / L2, top-K):

```ts
await repo.builder().find().similarity('embedding', vec, 'COSINE').topK(10).execute();
```

- **Source:** HANA Vector Engine; `CQL.cosineSimilarity()` / `CQL.l2Distance()`; PostgreSQL beta + **SQLite emulation (Apr 2026)** → testable in the bookshop fixture.
- **Notes:** differentiator feature; pairs with `@cap-js/ai-core` for embedding generation. Needs a `VectorKeys<T>` type constraint.

---

## Tier 2 — worth having, lower urgency

| Feature | Sketch | Notes | Status |
|---|---|---|---|
| Transaction helper | `repo.transaction(async (txRepo) => …)` wrapping `cds.tx()` | Mainly for usage *outside* service handlers (inside handlers CAP provides the ambient tx via `cds.context`) | idea |
| Raw escape hatch | `repo.run(query)` / expose typed entity ref for hand-built CQN | Cheap; every ORM has one | idea |
| Soft delete + restore | `softDelete(keys)`, `restore(keys)`, auto-filtering finds; typed flag/timestamp column | CAP has nothing built in → real differentiator; TypeORM/MikroORM pattern | idea |
| Repository hooks | `beforeCreate`/`afterUpdate`… at repository level | Overlaps with `cds-ts-dispatcher` handler decorators — scope strictly to data-layer concerns or reject | idea |
| Window functions | `columnsFormatter` support for `.over(partition)` | CDS 9 `.over()`; extends existing aggregate catalog | idea |
| Hierarchy queries | Tree/recursive helper for parent-child entities | Cross-DB since CDS 9 (Jun 2025); `@hierarchy` annotation is beta | idea |
| Full-text search | `repo.search(term)` honoring `@cds.search` annotations | Verify Node.js runtime API surface for search first | idea |

---

## Ecosystem & compatibility items

- **Plugin compatibility proof** — integration tests + README section showing repository writes are captured by `@cap-js/change-tracking` and `@cap-js/audit-logging` (both intercept at DB/service level, so it should just work — prove it). `status: idea`
- **`updateOrCreate` docs warning** — native UPSERT (CDS 9 default) has *PATCH semantics* and **skips generic handlers**: no `@cds.on.insert`, no default values/UUID generation, no audit logging. Legacy `replace` strategy is deprecated. Document this on `updateOrCreate`. `status: idea`
- **CDS 10 `node:sqlite` driver** — CDS 10 (Apr 2026) moves default SQLite driver from `better-sqlite3` to native `node:sqlite` (Node 22.5+, beta). Watch for test-fixture impact. `status: watch` — **confirmed impact 2026-07-31**: `node:sqlite` on Node 22 breaks cds-ql streaming (`stmt.setReturnArrays is not a function`); the streaming test suite forces `better-sqlite3` (devDependency) via `cds_requires_db_driver`. Re-check when Node floor moves past 22.

---

## CDS-QL capability watchlist

New runtime capabilities not (yet) wrapped, with version stamps — re-check on each `@sap/cds` upgrade:

- `.stream()` / `.pipeline()` / async iteration — CDS 9
- `CQL.cosineSimilarity()` / `CQL.l2Distance()`, `cds.Vector` — CDS 9 (Apr 2026: PostgreSQL beta, SQLite emulated)
- Hierarchies across SQLite/PostgreSQL/HANA — CDS 9 (Jun 2025); `@hierarchy` beta (Dec 2025)
- Direct CRUD on draft entities — beta (Dec 2025)
- `having()`, window `.over()`, EXISTS predicates, path expressions — CQL, partially wrapped
- Transactional event queues (exactly-once) — beta (May 2025)
- Declarative constraints GA / status-transition flows (gamma) — Dec 2025–Apr 2026
- Already wrapped ✔: `hints()`, `forUpdate({ wait })`, `forShareLock()`, `elements`

Deprecations relevant to this lib: UPSERT `replace` strategy; function-based reflection API (use `.entities`/`.types`); CDS 10 requires Node ≥ 22 (already our floor).

## Sources

- Release notes: <https://cap.cloud.sap/docs/releases/> (May 2025 → Jun 2026)
- cds-ql: <https://cap.cloud.sap/docs/node.js/cds-ql> · CQL: <https://cap.cloud.sap/docs/cds/cql>
- Vector embeddings: <https://cap.cloud.sap/docs/guides/databases/vector-embeddings>
- Plugins: <https://cap.cloud.sap/docs/plugins/>
- ORM survey: TypeORM Repository API, Prisma Client API, MikroORM EntityRepository, Drizzle query API docs
