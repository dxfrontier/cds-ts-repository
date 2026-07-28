# Changelog

All notable changes to this project will be documented in this file.

## [7.0.0] - 2026-07-28

### ⚙️ Miscellaneous Tasks

- *(workflows)* Publish with org-level NPM_ORG_TOKEN secret
- Bump version, CHANGELOG.md generated

## [6.2.0] - 2026-01-13

### 🚀 Features

- *(methods)* New filter methods added to the cds-ts-repository
- *(repository)* Count(*) aggregates and temporal columnsFormatter functions

### 🐛 Bug Fixes

- *(filter)* Filter doesn't treats anymore boolean as string
- *(builder)* Fail fast on getExpand called without arguments

### 📚 Documentation

- *(readme)* Updated readme for newly added methods
- *(readme)* Document temporal formatter functions and count(*) behavior
- *(readme)* Document cds 10 peer dependency and rewrite test guide

### 🧪 Testing

- *(bookshop)* Updated tests for the newly added methods
- *(coverage)* External-service, draft increment and builder edge cases

### ⚙️ Miscellaneous Tasks

- Bump version, CHANGELOG.md generated
- *(prettier)* Prettied files
- *(docs)* Remove generated docs and typedoc tooling
- *(prettier)* Prettied generated cds-typer model files
- *(claude)* Add project Claude Code settings and DocsExplorer agent
- *(claude)* Add CLAUDE.md repository guide

## [6.1.0] - 2025-10-14

### 🚀 Features

- *(findOneAndUpdate)* New method for finding one instance and update it with according fields

### 🧪 Testing

- *(unit)* Updated test for newly added method
- *(catalog-service)* Fixed by exporting default instead of old common js style

### ⚙️ Miscellaneous Tasks

- Bump version, CHANGELOG.md generated
- *(readme)* Updated documentation for newly added method

## [6.0.2] - 2025-08-22

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(workflows)* Changes to use the standard dxfrontier release

## [6.0.1] - 2025-07-07

### 📚 Documentation

- *(readme)* Adde export to all MyRepository classes

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased

## [6.0.0] - 2025-07-02

### 🚀 Features

- *(cds)* Migration to cds v9

### 🧪 Testing

- *(schema)* Updated association
- *(tsconfig.json)* Updates tsconfig to stick to cds guidelines
- *(sqlite)* Removed sqilite as it is already installed on root
- *(find)* Refactored test due to jest major version
- *(bookshop)* Updated devDependency to have dispatcher

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(package)* Removed --watchAll from jest
- *(readme)* Made clear that repository uses v9

## [5.2.1] - 2025-04-15

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(package)* Fixed desincronization of package-lock with package.json

## [5.2.0] - 2025-04-15

### 🚜 Refactor

- *(getExpand)* Refactored the `builder getExpand` for better performance

### 🧪 Testing

- *(unit)* Updated

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(readme)* Updated with documentation for `hints`

## [5.1.6] - 2025-02-10

### 🐛 Bug Fixes

- *(filter)* Fix multidimensional `Filter` when Filter contained 2 filters and logical OR / AND

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(readme)* Updated

## [5.1.5] - 2025-02-06

### 🐛 Bug Fixes

- *(typed_request)* Fix TypedRequest was replaced by Request

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(readme)* Updated readme

## [5.1.4] - 2025-02-06

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(readme)* Updated

## [5.1.3] - 2025-01-09

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(readme)* Fixed table readme

## [5.1.2] - 2025-01-09

### 🐛 Bug Fixes

- *(readme)* Fix table filter readme

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased

## [5.1.1] - 2025-01-09

### 📚 Documentation

- *(readme)* Fixed readme

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased

## [5.1.0] - 2025-01-09

### 🚀 Features

- *(is-null)* Added as operator `IS NULL` and `IS NOT NULL` to Filter to check for null

### 📚 Documentation

- *(readme)* Added is-null and is-not-null documentation

### 🧪 Testing

- *(unit)* Updates tests for `is null` and `is not null`

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(gitignore)* Added some config files to gitignore
- *(config)* Added generated @dispatcher to eslint ignore

## [5.0.1] - 2024-12-18

### ⚙️ Miscellaneous Tasks

- *(release)* Updated CHANGELOG.md and bump version increased
- *(readme)* Small changes to Readme.md

## [5.0.0] - 2024-12-10

### 🚀 Features

- *(Filter)* `Filter` accepts a new overload to supply multiple filders to `.find()` and `findOne`

### 🚜 Refactor

- *(core)* Removed string from `find` and `findOne` as it was not needed
- *(workflows)* Refactored workflows to be in guideline with cds-ts-dispatcher

### ⚙️ Miscellaneous Tasks

- *(readme)* Updated readme with `Filter` overload for multidimension
- *(test)* Updated tests for `Filter` multidimension

## [4.0.0] - 2024-11-07

### 🐛 Bug Fixes

- *(create)* Create response now returns InserResults which actually expose the inserted id

### ⚙️ Miscellaneous Tasks

- *(tests)* Updated tests for `.create` and `.createMany`
- Version bump to 4.0.0

## [3.0.2] - 2024-11-06

### 🐛 Bug Fixes

- *(draft)* Draft builder now is finding a draft and is returning the correct type for draft

### ⚙️ Miscellaneous Tasks

- *(gitattributes)* Added gitattributes to have the corrent stats on github
- *(test)* Updated drafts tests for better catching of errors
- Version bump to 3.0.2

## [3.0.1] - 2024-10-29

### ⚙️ Miscellaneous Tasks

- *(gitignore)* Removed @cds-models from gitingore
- *(tests)* Added the cds-modesl of the API_BUSINESS_PARTNER
- *(tests)* Regenerated cds-models
- Version bump to 3.0.1

## [3.0.0] - 2024-10-29

### 🚀 Features

- *(deps)* Added packages needed for e2e tests and updated versions
- *(externalService)* New ExternalService decorator to bind external service to the BaseRepository

### 🐛 Bug Fixes

- *(jest)* Increased jest time

### 🚜 Refactor

- *(commitlint)* Removed the mandatory scopes

### 🧪 Testing

- *(e2e)* Added e2e tests for ExternalService decorator

### ⚙️ Miscellaneous Tasks

- *(readme)* Added documentation for ExternalService decorator
- *(build)* Updated tests workflow with e2e tests
- Version bump to 3.0.0
- *(tests)* Fixed the tests workflow
- *(delete)* Deleted unused files
- *(e2e)* Fixed e2e tests by adding the testing in another job in the workflow

## [2.0.5] - 2024-09-09

### 🐛 Bug Fixes

- *(active-entity)* Removed deprecated limit from the Find builder

### 🧪 Testing

- *(unit)* Removed limit and addaed paginate to test

### ⚙️ Miscellaneous Tasks

- Version bump to 2.0.5

## [2.0.4] - 2024-09-04

### 🐛 Bug Fixes

- *(active-entity)* Enforce singular type for active/draft entities in BaseRepository<T>

### ⚙️ Miscellaneous Tasks

- *(build)* Added deployment workflow and changed release yml
- *(unit)* Updated unit tests
- Version bump to 2.0.4

## [2.0.3] - 2024-09-02

### 📚 Documentation

- *(readme)* Updated readme

### ⚙️ Miscellaneous Tasks

- Version bump to 2.0.3

## [2.0.2] - 2024-08-23

### 🐛 Bug Fixes

- *(filter)* Now Filter accepts as value 'true / false' (boolean)

### ⚙️ Miscellaneous Tasks

- Version bump to 2.0.2

## [2.0.1] - 2024-08-23

### 🐛 Bug Fixes

- *(filter)* Now Filter accepts as value also 'null'

### ⚙️ Miscellaneous Tasks

- *(unit)* Updated unit tests with 'not equals null'
- *(types)* Removed eslint and Service type as it was not needed
- Version bump to 2.0.1

## [2.0.0] - 2024-08-21

### 🚜 Refactor

- *(types)* Some types have been refactored after ESLint was triggered

### ⚙️ Miscellaneous Tasks

- *(build)* Migrated to ESLint v9
- *(build)* Commitlintrc adapted with new type enums
- *(readme)* Readme updated
- *(build)* Husky commit-msg and pre-commit updated
- *(unit)* Cds-typer new generated entities
- *(e2e)* Added 2 instead of cents for the minorUnit as deployed it failed
- Version bump to 2.0.0

## [1.1.3] - 2024-07-18

### 📚 Documentation

- *(docs)* Readme updated

### ⚙️ Miscellaneous Tasks

- Version bump to 1.1.3

## [1.1.2] - 2024-07-11

### 📚 Documentation

- *(docs)* Created technical documentation

### ⚙️ Miscellaneous Tasks

- Version bump to 1.1.2

## [1.1.1] - 2024-07-10

### ⚙️ Miscellaneous Tasks

- *(config)* Release workflow now shows the full changelog
- *(config)* Fixing release workflow
- *(config)* Fixing release workflow
- *(tests)* Updated tests after cds-typer version increased
- *(config)* Added docs and .md to be excluded from prettier and eslint
- *(docs)* Created technical docs out of typedoc descriptions
- *(config)* Added typedoc to tsconfig
- *(docs)* Added to all components typedoc descriptions
- Version bump to 1.1.1

## [1.1.0] - 2024-06-27

### 🚜 Refactor

- *(filter)* All properties except field of the filter are now optional

### ⚙️ Miscellaneous Tasks

- *(build)* Added git cliff for release changelogs
- *(build)* Fixed the release workflow
- *(build)* Fixed release workflow
- *(build)* Added creation of pr after changelog.md was created
- *(config)* Type enum now supports same categories as git cliff
- *(config)* Added publish to internal git npm
- Version bump to 1.1.0

## [1.0.22] - 2024-06-14

### ⚙️ Miscellaneous Tasks

- *(config)* Commitlint packages
- *(config)* Commitlint configuration file and commitlint added to husky
- *(docs)* Updated readme with some new changes
- Version bump to 1.0.23

## [1.0.21] - 2024-05-31

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.22

### FIX

- SAP moved/deleted some types

## [1.0.20] - 2024-05-31

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.21

### FEATURE

- Deprecated `limit` and added `paginate`, reworked some code as SAP changed / deleted some types.

## [1.0.19] - 2024-05-28

### ⚙️ Miscellaneous Tasks

- Package versions bump
- Version bump to 1.0.20

## [1.0.18] - 2024-05-14

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.19

## [1.0.17] - 2024-05-14

### ⚙️ Miscellaneous Tasks

- Added to release workflow publish to github npm
- Version bump to 1.0.18

### Update

- Added to readme a TIP for cds typer

## [1.0.16] - 2024-05-02

### ⚙️ Miscellaneous Tasks

- Reordering structure of folders, updating the package.json versions.
- Version bump to 1.0.17

## [1.0.15] - 2024-04-17

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.16

## [1.0.14] - 2024-04-17

### ⚙️ Miscellaneous Tasks

- Package versions.
- Version bump to 1.0.15

## [1.0.13] - 2024-04-03

### 🚀 Features

- New `.elements` property on builder to get the metadata of the fields and new `updateOrCreate` method similar tu `UPSERT`

### ⚙️ Miscellaneous Tasks

- Reorder of the imports based on type and non type
- Version bump to 1.0.14

### Update

- Tests
- README.md with new `.elements` and `updateOrCreate` method

## [1.0.12] - 2024-04-01

### ⚙️ Miscellaneous Tasks

- .devcontainer added for easy dev around teams.
- Version bump to 1.0.13

### Created

- Vscode/settings.json

### Update

- Gitignore

## [1.0.11] - 2024-03-18

### 🚀 Features

- Implemented new method `deleteAll`, this new method deletes all items in a table.

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.12

### Update

- Tests for the new method deleteAll
- Readme

## [1.0.10] - 2024-03-14

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.10
- Version bump to 1.0.11

### Update

- Readme.md and updated workflows versions
- Readme.md

## [1.0.9] - 2024-03-12

### 🚀 Features

- New overload for the getExpand method, this new overload can be used to auto expand associations without the need to specify which associations should be expanded.

### ⚙️ Miscellaneous Tasks

- Updated versions
- Version bump to 1.0.9

### Chore

- Added auto expand of getExpand documentation.

### Feature

- Tests updated for auto expand of getExpand method

### Updated

- Tests for getExpand

## [1.0.8] - 2024-03-05

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.8

### Feature

- New findOne builder.

## [1.0.7] - 2024-02-27

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.7

### FIX

- GetExpand auto-expose entities when select? is omitted.

## [1.0.6] - 2024-02-26

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.6

### Update

- Readme

## [1.0.5] - 2024-02-26

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.5

## [1.0.4] - 2024-02-26

### ⚙️ Miscellaneous Tasks

- Package versions increased
- Version bump to 1.0.4

### Feature

- Now `getExpand` has a new overload for handling deep expand of the associations.

### Update

- Deep expand tests added.
- Readme updated with deep expand

## [1.0.3] - 2024-02-08

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.3

## [1.0.2] - 2024-02-08

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.2

### FIX

- Filter constructor is not exported.

## [1.0.1] - 2024-01-31

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.1

## [1.0.0] - 2024-01-30

### ⚙️ Miscellaneous Tasks

- Version bump to 1.0.0

## [0.3.8] - 2024-01-29

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.8

### FIX

- ColumnsFormatter typing

## [0.3.7] - 2024-01-25

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.7

### Update

- Tests
- README.md
- Package.json versions
- Package-lock.json

## [0.3.6] - 2024-01-18

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.6

## [0.3.5] - 2023-12-21

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.5

### Updated

- Tests, readme and development process updates

## [0.3.4] - 2023-12-19

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.4

### Updated

- Cds-ts-repository package.json to latest versions

## [0.3.3] - 2023-12-18

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.3

## [0.3.2] - 2023-12-15

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.2

## [0.3.1] - 2023-12-15

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.1

## [0.3.0] - 2023-12-05

### ⚙️ Miscellaneous Tasks

- Version bump to 0.3.0

## [0.2.1] - 2023-11-27

### ⚙️ Miscellaneous Tasks

- Version bump to 0.2.1

## [0.2.0] - 2023-11-24

### ⚙️ Miscellaneous Tasks

- Version bump to 0.2.0

## [0.1.9] - 2023-11-15

### ⚙️ Miscellaneous Tasks

- Version bump to 0.1.9

## [0.1.8] - 2023-11-14

### ⚙️ Miscellaneous Tasks

- Version bump to 0.1.8

## [0.1.0] - 2023-10-23

<!-- generated by git-cliff -->
