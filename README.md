<h2> CDS-TS-Repository - BaseRepository </h2>

![SAP](https://img.shields.io/badge/SAP-0FAAFF?style=for-the-badge&logo=sap&logoColor=white)
![ts-node](https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white)
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![json](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

![NPM Downloads](https://img.shields.io/npm/dy/@dxfrontier/cds-ts-repository?logo=npm)
![NPM Downloads](https://img.shields.io/npm/dm/%40dxfrontier%2Fcds-ts-repository?logo=npm)
![NPM Version](https://img.shields.io/npm/v/%40dxfrontier%2Fcds-ts-repository?logo=npm)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/dxfrontier/cds-ts-repository/release.yml?logo=git)
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/dxfrontier/cds-ts-repository/main?logo=git)
![GitHub issues](https://img.shields.io/github/issues/dxfrontier/cds-ts-repository?logo=git)
![GitHub contributors](https://img.shields.io/github/contributors/dxfrontier/cds-ts-repository?logo=git)
![GitHub top language](https://img.shields.io/github/languages/top/dxfrontier/cds-ts-repository?logo=git)
![GitHub Repo stars](https://img.shields.io/github/stars/dxfrontier/cds-ts-repository?style=flat&logo=git)

The goal of **BaseRepository** is to significantly reduce the boilerplate code required to implement data access layers for persistance entities by providing out of the box actions on the `database`.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Install CDS-TS-Repository](#install-cds-ts-repository)
  - [`Generate CDS Typed entities`](#generate-cds-typed-entities)
    - [Option 1 - `Recommended`](#option-1---recommended)
    - [Option 2](#option-2)
    - [`Important`](#important)
- [Architecture](#architecture)
- [Usage](#usage)
  - [`Option 1` : Using `BaseRepository` with `Standard SAP CDS-TS`](#option-1--using-baserepository-with-standard-sap-cds-ts)
    - [Step 1: Create MyRepository class](#step-1-create-myrepository-class)
    - [Step 2 : Integrate MyRepository class](#step-2--integrate-myrepository-class)
  - [`Option 2` : Using `BaseRepository` with `CDS-TS-Dispatcher`](#option-2--using-baserepository-with-cds-ts-dispatcher)
    - [Step 1 : Create MyRepository class](#step-1--create-myrepository-class)
    - [Step 2 : Inject MyRepository class](#step-2--inject-myrepository-class)
  - [`Drafts` : `BaseRepositoryDraft`](#drafts--baserepositorydraft)
    - [Usage](#usage-1)
    - [Integration](#integration)
  - [`Methods`](#methods)
    - [create](#create)
    - [createMany](#createmany)
    - [getAll](#getall)
    - [getDistinctColumns](#getdistinctcolumns)
    - [getAllAndLimit](#getallandlimit)
    - [getLocaleTexts](#getlocaletexts)
    - [find](#find)
    - [findOne](#findone)
    - [builder](#builder)
      - [.find](#find-1)
        - [elements](#elements)
        - [distinct](#distinct)
        - [orderAsc](#orderasc)
        - [orderDesc](#orderdesc)
        - [limit](#limit)
        - [groupBy](#groupby)
        - [columns](#columns)
        - [columnsFormatter](#columnsformatter)
        - [getExpand](#getexpand)
        - [forUpdate](#forupdate)
        - [forShareLock](#forsharelock)
        - [execute](#execute)
      - [.findOne](#findone-1)
        - [elements](#elements-1)
        - [columns](#columns-1)
        - [columnsFormatter](#columnsformatter-1)
        - [getExpand](#getexpand-1)
        - [forUpdate](#forupdate-1)
        - [forShareLock](#forsharelock-1)
        - [execute](#execute-1)
    - [update](#update)
    - [updateOrCreate](#updateorcreate)
    - [updateLocaleTexts](#updatelocaletexts)
    - [delete](#delete)
    - [deleteMany](#deletemany)
    - [deleteAll](#deleteall)
    - [exists](#exists)
    - [count](#count)
  - [`Helpers`](#helpers)
    - [Filter](#filter)
- [`Examples`](#examples)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## Installation

### Install CDS-TS-Repository

```bash
npm install @dxfrontier/cds-ts-respository
```

### `Generate CDS Typed entities`

#### Option 1 - `Recommended`

Execute the following commands :

```bash
cds add typer
```

```bash
npm install
```

> [!TIP]
> If above option is being used, this means whenever we change a `.CDS` file the changes will be reflected in the generated `@cds-models` folder.

#### Option 2

Execute the command :

```bash
npx @cap-js/cds-typer "*" --outputDirectory ./srv/util/types/entities
```

- Target folder :`./srv/util/types/entities` - Change to your desired destination folder.

> [!TIP]
> If above option is being used, you have to run every time the command when you do a change in a `.CDS file`

#### `Important`

> [!CAUTION]
> Import always the `generated entities from the service folders and not from the index.ts`

![alt text](https://github.com/dxfrontier/markdown-resources/blob/main/common/cds_typer_entities_@cds-models.png?raw=true)

For more info see official **[SAP CDS-Typer](https://cap.cloud.sap/docs/tools/cds-typer)** page.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## Architecture

**We recommend adhering** to the **Controller-Service-Repository**.

1. `Controller` - Responsible for managing the REST interface to the core business logic implemented in `ServiceLogic`.
2. `Service` - Contains business logic implementations
3. `Repository` - This component is dedicated to handling entity manipulation operations by leveraging the power of [CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql).

`Controller-Service-Repository` suggested folder structure

![alt text](https://github.com/dxfrontier/markdown-resources/blob/main/cds-ts-dispatcher/architecture_folder_structure.png?raw=true) <= expanded folders => ![alt text](https://github.com/dxfrontier/markdown-resources/blob/main/cds-ts-dispatcher/architecture_folder_structure_expanded.png?raw=true)

A much more detailed version of this pattern can be found on [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher)

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## Usage

### `Option 1` : Using `BaseRepository` with `Standard SAP CDS-TS`

This guide explains how to use the BaseRepository with the `Standard SAP CDS-TS`, allowing you to work without the need for the [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher).

#### Step 1: Create MyRepository class

Start by creating `MyRepository` class, which will extend the `BaseRepository<T>` to handle operations for your entity.

`Example`

```ts
import { BaseRepository, TypedRequest } from '@dxfrontier/cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE'

// Imported to have visibility over INSERT, SELECT, UPDATE, DELETE ...
import { Service } from '@sap/cds';

export class MyRepository extends BaseRepository<MyEntity> {

  constructor() {
    super(MyEntity)
  }

  public aMethod(req: TypedRequest<MyEntity>) {
    const result1 = await this.create(...)
    const result2 = await this.createMany(...)
    const result5 = await this.getAll()
    const result6 = await this.getAllAndLimit(...)
    const result7 = await this.find(...)
    const result8 = await this.findOne(...)
    const result9 = await this.delete(...)
    const result10 = await this.update(...)
    const result11 = await this.updateLocaleTexts(...)
    const result12 = await this.exists(...)
    const result13 = await this.count()
  }

  public anotherMethod(results: MyEntity[], req: TypedRequest<MyEntity>) {
    // ...
  }

  // Enhance with custom QL methods ...
  public customQLMethod() {
    const customQL = SELECT(MyEntity).columns(...).where(...)
    // ...
  }
}

```

#### Step 2 : Integrate MyRepository class

Now that you have `MyRepository` class, you can integrate it into your implementation.

`Steps`

1. Create a new private field:

```ts
private myRepository: MyRepository = new MyRepository();
```

2. Use the handler on the `callback` of the `events` :

```ts
this.before('READ', MyEntity, (req) => this.myRepository.aMethod(req));
this.after('READ', MyEntity, (results, req) => this.myRepository.anotherMethod(results, req));
```

`Example`

```ts
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

export class MainService extends cds.ApplicationService {
  private myRepository: MyRepository = new MyRepository();

  init() {
    this.before('READ', MyEntity, (req) => this.myRepository.aMethod(req));
    this.after('READ', MyEntity, (results, req) => this.myRepository.anotherMethod(results, req));

    return super.init();
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### `Option 2` : Using `BaseRepository` with `CDS-TS-Dispatcher`

This guide explains how to use the BaseRepository with the [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher).

#### Step 1 : Create MyRepository class

Start by creating a `MyRepository` class, which will extend the `BaseRepository<T>` to handle operations for your entity.

`Steps`

1. Create a new class `MyRepository`:

```ts
export class MyRepository {}
```

2. Add `@Repository` decorator :

```ts
@Repository()
export class MyRepository {}
```

3. Extend `MyRepository` class to inherit the `BaseRepository` methods

```ts
@Repository()
export class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // CDS-Typer entity
  }
}
```

`Example`

```ts

import { BaseRepository } from '@dxfrontier/cds-ts-repository'
import { Repository, Service } from '@dxfrontier/cds-ts-dispatcher'

import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE'

@Repository()
export class MyRepository extends BaseRepository<MyEntity> {

  constructor() {
    super(MyEntity) // CDS-Typer entity
  }

  aMethod() {
    const result1 = await this.create(...)
    const result2 = await this.createMany(...)
    const result5 = await this.getAll()
    const result6 = await this.getAllAndLimit(...)
    const result7 = await this.find(...)
    const result8 = await this.findOne(...)
    const result9 = await this.delete(...)
    const result10 = await this.update(...)
    const result11 = await this.updateLocaleTexts(...)
    const result12 = await this.exists(...)
    const result13 = await this.count()
  }

  // Enhance with custom QL methods ...
  customQLMethod() {
    const customQL = SELECT(MyEntity).columns(...).where(...)
    // ...
  }
}
```

#### Step 2 : Inject MyRepository class

Now `MyRepository` can be injected using `@Inject` in another class.

`Example`

```ts
@EntityHandler(Book)
class MyEntityHandler {
  @Inject(MyRepository) private readonly myRepository: MyRepository;
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### `Drafts` : `BaseRepositoryDraft`

The `BaseRepositoryDraft` class extends `BaseRepository` by providing support for draft-enabled entities.

BaseRepositoryDraft repository provides a clear separation of methods for **working with active entities** and **draft instances.**

#### Usage

Use `BaseRepository` methods when dealing with `active entity instances`.

- `update`
- `delete`
- `create`
- `createMany`
- `...`

Use `BaseRepositoryDraft` methods when working with `draft entity instances`.

- `updateDraft`
- `deleteDraft`
- `findOneDraft`
- `findDrafts`
- `...`

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### Integration

`Example 1`: Integrate `BaseRepository` & `BaseRepositoryDraft` using `Mixin`

```ts
import { BaseRepository, BaseRepositoryDraft, Mixin } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends Mixin(BaseRepository<MyEntity>, BaseRepositoryDraft<MyEntity>) {
  constructor() {
    super(MyEntity);
  }
  // ... define custom CDS-QL actions if BaseRepository ones are not satisfying your needs !
}

export default BookEventRepository;
```

> [!NOTE]
> MyRepository class will inherit all methods for active entities and drafts.
> Active entity methods: .create, createMany, update, exists, delete, deleteMany ...
> Draft entity methods: .updateDraft, existsDraft, deleteDraft, deleteManyDrafts ...

`Example 2`: Use only `BaseRepositoryDraft` methods

```ts
import { BaseRepository, BaseRepositoryDraft, Mixin } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepositoryDraft<MyEntity> {
  constructor() {
    super(MyEntity);
  }
  // ... define custom CDS-QL actions if BaseRepository ones are not satisfying your needs !
}

export default BookEventRepository;
```

> [!NOTE]
> MyRepository class will inherit all methods for drafts.
> Draft entity methods: .updateDraft, existsDraft, deleteDraft, deleteManyDrafts ...

> [!IMPORTANT]
> Enable `MyEntity` as `@odata.draft.enabled: true` to use `BaseRepositoryDraft` methods.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### `Methods`

#### create

`(method) this.create(entry: Entry<T>) : Promise<InsertResult<T>>`.

The `create` method allows you to create a new entry in the table.

`Parameters`

- `entry (object)`: An object representing the entry to be created. The object should match the structure expected by `MyEntity`

`Return`

- `Promise<InsertResult<T>>`: This method returns a Promise that resolves when the insertion operation is completed successfully.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const createdInstance = await this.create({
      name: 'Customer 1',
      description: 'Customer 1 description',
    });
    // Further logic with createdInstance
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### createMany

`(method) this.createMany(...entries: Entries<T>[]) : Promise<InsertResult<T>>`.

The `createMany` method allows you to add multiple entries in the table.

`Parameters`

- `entries (...entries: Entries<T>[])`: An array of objects representing the entries to be created. Each object should match the structure expected by `MyEntity`.

`Return`

- `Promise<InsertResult<T>>`: This method returns a `Promise` that resolves when the insertion operation is completed successfully.

`Example 1`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {

    const create = {
      name: 'Customer 1',
      description: 'Customer 1 description',
    },
    {
      name: 'Customer 2',
      description: 'Customer 2 description',
    };

    // as an array of objects
    const createdInstance = await this.createMany([create]);

    // as a spread of objects
    const createdInstance2 = await this.createMany(create); // as spread objects
    // Further logic with createdInstance
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### getAll

`(method) this.getAll(): Promise<T[] | undefined>`

The `getAll` method retrieves all table entries.

`Return`

- `Promise<T[] | undefined>`: A Promise resolving to an array of type `T` (e.g., `MyEntity`). If no results are found, the Promise resolves to `undefined`.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    // Variant 1
    const results = await this.getAll();
    if (results) {
      // do something with results
    }

    // Variant 2
    const items = results?.length;
    const oneItem = results![0];

    // Further logic with results
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### getDistinctColumns

`(method) this.getDistinctColumns<Column extends keyof T>(columns: Column[]>): Promise<Array<Pick<T, Column>> | undefined>`

The `getDistinctColumns` method retrieves distinct values for the specified columns from the table.

`Parameters`

- `columns` `(Array<string>)`: An array of column names to retrieve distinct records for. Each column name should be of a type that matches the entity's schema.

`Return`

- `Promise<Array<Pick<T, Column>> | undefined>`: A Promise resolving to an array of objects containing the selected columns from the entity. If no results are found, the Promise resolves to `undefined`.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.getDistinctColumns(['currency_code', 'ID', 'name']);
    // or using spread strings
    // const results = await this.getDistinctColumns('currency_code', 'ID', 'name');

    // Variant 1
    if (results) {
      // do something with results
    }

    // Variant 2
    const items = results?.length;
    const oneItem = results![0];
    // Further logic with results
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### getAllAndLimit

`(method) this.getAllAndLimit(options: { limit: number; skip?: number | undefined }): Promise<T[]>`

The `getAllAndLimit` method allows you to find and retrieve a list of items with optional pagination.

`Parameters`

- `options` `(object)`: An object containing the following properties:
  - `limit` `(number)`: The maximum number of items to retrieve.
  - `skip?` `(optional, number)`: This property, if applied, will 'skip' a certain number of items (default: 0).

`Return`

- `Promise<T[] | undefined>`: A Promise resolving to an array of objects representing instances of type `T` (e.g., `MyEntity`). If no results are found, the Promise resolves to `undefined`.

`Example 1` : Retrieve the first 10 items

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.getAllAndLimit({ limit: 10 });

    // Variant 1
    if (results) {
      // do something with results
    }

    // Variant 2
    const items = results?.length;
    const oneItem = results![0];
    // Further logic with results
  }
}
```

`Example 2` : Retrieve items starting from the 20th item, limit to 5 items

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const resultsWithSkip = await this.getAllAndLimit({ limit: 5, skip: 20 });

    // Variant 1
    if (resultsWithSkip) {
      // do something with results
    }

    // Variant 2
    const items = resultsWithSkip?.length;
    const oneItem = resultsWithSkip![0];

    // Further logic with resultsWithSkip
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### getLocaleTexts

`(method) this.getLocaleTexts<Column extends keyof T>(columns: Column[]): Promise<Array<Pick<T, Column> & Locale> | undefined>`

The `getLocaleTexts` method is designed to retrieve a list of items with localized text.

`Return`

- `Promise<Array<Pick<T, Column> & Locale> | undefined>`: A Promise resolving to an array of objects containing the selected columns from the entity along with locale information. If no results are found, the Promise resolves to `undefined`.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.getLocaleTexts(['descr', 'ID']);

    // Variant 1
    if (results) {
      // do something with results
    }

    // Variant 2
    const items = results?.length;
    const oneItem = results![0];
    // Further logic with results
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### find

The `find` method allows you to find and retrieve entries from the table that match the specified keys.

`Overloads`

| Method                                                                     | Parameters        | Description                                                                                                                                                            |
| :------------------------------------------------------------------------- | :---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `this.find(): Promise<T \| undefined>`                                     |                   | Get all table items.                                                                                                                                                   |
| `this.find(keys: Entry<T>): Promise<T \| undefined>`                       | `keys (object)`   | An object representing the keys to filter the entries. <br /> Each key should correspond to a property in `MyEntity`, and the values should match the filter criteria. |
| `this.find(filter :`**[Filter\<T\>](#filter)**`): Promise<T \| undefined>` | `filter (Filter)` | An instance of **[Filter\<T\>](#filter)**                                                                                                                              |

`Return`

- `Promise<T[] | undefined>`: A Promise that resolves to an array of type `T` (e.g., `MyEntity`). If no results are found, the Promise resolves to `undefined`.

`Example 1` using object

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.find({ name: 'Customer', description: 'description' });

    // Variant 1
    if (results) {
      // do something with results
    }

    // Variant 2
    const items = results?.length;
    const oneItem = results![0];
    // Further logic with results
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example 2` using [Filter](#filter)

```ts
import { BaseRepository, Filter } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const filter = new Filter<MyEntity>({
      field: 'name',
      operator: 'LIKE',
      value: 'Customer',
    });

    // Execute the query using the find
    const results = await this.find(filter);
  }
}
```

> [!TIP]
> See [Filter](#filter) for more complex QUERY filters

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### findOne

`findOne(keys: Entry<T>): Promise<T | undefined>`

The `findOne` method allows you to find and retrieve a single entry from the table that matches the specified keys.
`Parameters`

- `keys (object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<T | undefined>`: This method returns a Promise with a single entry of type `T`, where `T` is `MyEntity`. If no result is found, the Promise resolves to `undefined`.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const itemFound = await this.findOne({ name: 'Customer', description: 'description' });
    // Variant 1
    if (itemFound) {
      // do something with result
    }

    // Further logic with result
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### builder

##### .find

`Overloads`

| Method                                                                      | Parameters        | Description                                                                                                                                                            |
| :-------------------------------------------------------------------------- | :---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `this.builder().find(): FindBuilder<T>`                                     |                   | Get all table items.                                                                                                                                                   |
| `this.builder().find(keys: Entry<T>): FindBuilder<T>`                       | `keys (object)`   | An object representing the keys to filter the entries. <br /> Each key should correspond to a property in `MyEntity`, and the values should match the filter criteria. |
| `this.builder().find(filter :`**[Filter\<T\>](#filter)**`): FindBuilder<T>` | `filter (Filter)` | An instance of **[Filter\<T\>](#filter)**                                                                                                                              |

`Return`

- `FindBuilder<T>`: A `FindBuilder` instance that provides access to the following methods for constructing a `SELECT`:

  - [elements](#elements)
  - [distinct](#distinct)
  - [orderAsc()](#orderasc)
  - [orderDesc()](#orderdesc)
  - [groupBy()](#groupby)
  - [columns()](#columns)
  - [columnsFormatter()](#columnsformatter)
  - [limit()](#limit)
  - [getExpand()](#getexpand)
  - [forUpdate()](#forupdate)
  - [forShareLock()](#forsharelock)
  - [execute()](#execute)

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### elements

Provides the Metadata of Entity fields.

`Example`

```ts
const results = this.builder().find().columns('ID', 'currency_code').elements;
```

> [!WARNING]
> Currently SAP does not offer typing on the `elements`.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### distinct

Skip duplicates similar to SQL distinct.

`Example`

```ts
const results = await this.builder()
  .find() // get all items
  .distinct.columns('country')
  .execute();
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### orderAsc

To order the `ASC` selected columns, you can use the `orderAsc` methods. Pass an array of column names to specify the order.

`Parameters`

- `columns (...columns : Columns<T>[])` : An array of name of the columns to order by.

`Example`

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .orderAsc('name', 'ID', 'company')
  // or
  //.orderAsc(['name', 'ID', 'company'])
  .execute();
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### orderDesc

To order the `DESC` selected columns, you can use the `orderDesc` methods. Pass an array of column names to specify the order.

`Parameters`

- `columns (...columns : Columns<T>[])` : An array of name of the columns to order by.

`Example`

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .orderDesc('name', 'ID', 'company')
  // or
  //.orderDesc(['name', 'ID', 'company'])
  .execute();
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### limit

This method allows retrieve a list of items with optional pagination.

`Parameters`

- `options` `(object)`: An object containing the following properties:
  - `limit` `(number)`: The maximum number of items to retrieve.
  - `skip?` `(number)`: This property, if applied, will 'skip' a certain number of items (default: 0).

`Example`

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .limit({ limit: 1 })
  .execute();
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### groupBy

If you want to group the selected columns, use the groupBy method. Pass an array of column names to group by.

`Parameters`

- `columns (...columns : Columns<T>[])` : An array of name of the columns to group by.

`Example`

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .groupBy('name', 'company')
  // or
  //.groupBy(['name', 'company'])
  .execute();
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### columns

Specifies which columns to be fetched.

`Parameters`

- `columns (...columns : Columns<T>[])` : An array of name of the columns to show only.

`Example`

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .columns('name', 'currency_code')
  // or
  //.columns(['name', 'currency_code'])
  .execute();
```

> [!WARNING]
> If `columns()` method is used together with `getExpand()` / `columnsFormatter()` / `groupBy()` / `orderAsc()` / `orderDesc()`, the `columns()` method can have impact on the final typing

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### columnsFormatter

The `columnsFormatter` can be used :

- To `rename` columns in your query results.
- To apply `aggregate functions` to specific columns, such as calculating averages, sums etc.

`Parameters`

- `columns (object-1, object-n, ...)`

  - `column` `(string)`: The name of the column to be processed.
  - `column1` `(string)` : The name of the column to be processed. (Applied only for `CONCAT`)
  - `column2` `(string)` : The name of the column to be processed. (Applied only for `CONCAT`)
  - `aggregate?` `[optional] (string)`: This property, if applied, will `call aggregate function` for the specified `column` name, below you can find the available aggregate functions :
    - String : `'LOWER' | 'UPPER' | 'LENGTH' | 'CONCAT' | 'TRIM'`
    - Number : `'AVG' | 'MIN' | 'MAX' | 'SUM' | 'ABS' | 'CEILING' | 'TOTAL' | 'COUNT' | 'ROUND' | 'FLOOR'`
    - Date : `'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND'`
  - `renameAs` `(string)`: This property creates a new column with the given name

`Example 1`

```ts
const results = await this.builder()
  .find()
  .columnsFormatter(
    { column: 'price', aggregate: 'AVG', renameAs: 'average' },
    { column: 'stock', renameAs: 'stockRenamed' },
  )
  .execute();
```

`Example 2`

```ts
const results = this.builder()
  .find({ ID: 201 })
  .getExpand(['reviews'])
  .columns('reviews', 'bookName', 'authorName')
  .columnsFormatter({ column1: 'bookName', column2: 'authorName', aggregate: 'CONCAT', renameAs: 'bookAndAuthorName' })
  .execute();

// above typing will have the following properties
// 'reviews', 'bookName', 'authorName', 'bookAndAuthorName'
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### getExpand

Use `getExpand` to specify which columns you want to expand from the table.

`Overloads`

| Type            | Method                                                      | Parameters                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :-------------- | :---------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Single expand` | `getExpand(...associations : Columns<T>[]): FindBuilder<T>` | `...associations: Array<string>` | Use `Single expand` when you want to expand only certain associations from the root level of the entity. <br />--------<br /> An array of strings representing the columns to expand, this will expand only `first level` of `associations`.                                                                                                                                                                                                                                                                             |
| `Deep expand`   | `getExpand(associations : Expand<T>): FindBuilder<T>`       | `associations: object`           | Use `Deep expand` option when you want to deep expand certain associations. <br />--------<br /> An object representing the columns to expand. <br /><br /> `Value:` <br /><br /> - `{}` - If empty object is used as a value for an association, the empty object will perform a full expand of the association. <br /><br /> `Properties:` <br /><br /> - `select? : Array<string>` `[optional]`: Fetch only the mentioned columns. <br /> - `expand? : object` `[optional]`: Expand nested associations. <br /><br /> |
| `Auto expand`   | `getExpand(options : { levels : number }): FindBuilder<T>`  | `levels: number`                 | Use `Auto expand` to deep expand all associations within your entity. <br />--------<br /> You can control how deeply the method should expand associations by providing the `levels`.                                                                                                                                                                                                                                                                                                                                   |

`Example 1` : Auto expand

- `Root` - Entity
  - `child` - (association) - expanded
    - `child` - (composition) - expanded
    - ...
  - `child` - (association) - expanded
    - `child` (association) - expanded
    - ...
    -

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .getExpand({ levels: 2 })
  .execute();
```

`Example 2` : Deep expand

```ts
// expand 'author', 'genre' and 'reviews' associations
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .getExpand({
    // expand 'author'
    author: {},

    // expand 'genre', having only 'ID' and 'name'
    genre: {
      select: ['ID', 'name'],
    },

    // expand 'reviews', having only 'ID', 'book_ID' fields and 'reviewer' association
    reviews: {
      select: ['ID', 'book_ID'],

      // expand 'reviewer', having only the 'ID'
      expand: {
        reviewer: {
          select: ['ID'],
        },
      },
    },
  })
  .execute();
```

`Example 3` : Deep expand stored in a variable & using `columns()`

```ts
import { Expand } from '@dxfrontier/cds-ts-repository';

// expand 'author', and 'reviews' associations
const associations: Expand<MyEntity> = {
  // expand 'author'
  author: {},

  // expand 'reviews' having all fields + expand reviewer association having only 'ID'
  reviews: {
    // expand 'reviewer', having only the 'ID'
    expand: {
      reviewer: {
        select: ['ID'],
      },
    },
  },
};

const results = await this.builder()
  .find() // get all items
  .columns('author', 'reviews')
  .getExpand(associations)
  .execute();
```

> [!NOTE]
> If `columns` is used with `getExpand` the `columns` method will have impact on the final typing.

`Example 4` : Simple expand

```ts
// expand only 'orders' and 'reviews' associations
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .getExpand('orders', 'reviews')
  // or
  //.getExpand(['orders', 'reviews'])
  .execute();
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### forUpdate

Exclusively locks the selected rows for subsequent updates in the current transaction, thereby preventing concurrent updates by other parallel transactions.

`Parameters`

- `options` `(object)`: An object containing the following properties:
  - `wait?` `(number) [optional]`: an integer specifying the timeout after which to fail with an error in case a lock couldn't be obtained.

`Example`

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .getExpand('orders', 'reviews')
  .forUpdate({ wait: 5 })
  //or
  //.forUpdate()
  .execute();
```

> [!TIP]
> More info can be found on the official SAP CAP [forUpdate](https://cap.cloud.sap/docs/node.js/cds-ql#forupdate) documentation.

###### forShareLock

Locks the selected rows in the current transaction, thereby preventing concurrent updates by other parallel transactions, until the transaction is committed or rolled back. Using a shared lock allows all transactions to read the locked record.

If a queried record is already exclusively locked by another transaction, the .forShareLock() method waits for the lock to be released.

`Example`

```ts
// Expand only 'orders' association
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .getExpand('orders', 'reviews')
  .forShareLock()
  .execute();
```

> [!TIP]
> More info can be found on the official SAP CAP [forShareLock](https://cap.cloud.sap/docs/node.js/cds-ql#forsharelock) documentation. documentation.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### execute

Finally, to execute the constructed query and retrieve the results as an array of objects, use the execute method. It returns a promise that resolves to the constructed query result.

`Return`

- `Promise<T[] | undefined>`: This method returns a Promise of `T[]` or `undefined` if nothing was found.

`Example 1`

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .execute();
```

`Example 2`

```ts
const results = await this.builder()
  .find({ name: 'A company name' })
  .orderAsc(['name'])
  .limit({ limit: 5 })
  .getExpand('orders')
  .execute();
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

##### .findOne

`Overloads`

| Method                                                                            | Parameters        | Description                                                                                                                                                            |
| :-------------------------------------------------------------------------------- | :---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `this.builder().findOne(keys: Entry<T>): FindOneBuilder<T>`                       | `keys (object)`   | An object representing the keys to filter the entries. <br /> Each key should correspond to a property in `MyEntity`, and the values should match the filter criteria. |
| `this.builder().findOne(filter :`**[Filter\<T\>](#filter)**`): FindOneBuilder<T>` | `filter (Filter)` | An instance of **[Filter\<T\>](#filter)**                                                                                                                              |

`Return`

- `FindOneBuilder<T>`: A `FindOneBuilder` instance that provides access to the following methods for constructing a `SELECT`:

  - [elements](#elements-1)
  - [columns](#columns-1)
  - [columnsFormatter](#columnsformatter-1)
  - [getExpand](#getexpand-1)
  - [forUpdate](#forupdate-1)
  - [forShareLock](#forsharelock-1)
  - [execute](#execute-1)

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### elements

Provides the Metadata of Entity fields.

`Example`

```ts
const oneResult = this.builder().findOne({ currency_code: 'USD' }).columns('ID', 'currency_code').elements;
```

> [!WARNING]
> Currently SAP does not offer typing on the `elements`.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### columns

Specifies which columns to be fetched.

`Parameters`

- `columns (...columns : Columns<T>[])` : An array of name of the columns to show only.

`Example`

```ts
const oneResult = await this.builder()
  .findOne({
    name: 'A company name',
  })
  .columns('name', 'currency_code')
  // or
  //.columns(['name', 'currency_code'])
  .execute();
```

> [!WARNING]
> If `columns()` method is used together with `getExpand()` / `columnsFormatter()` the `columns()` method can have impact on the final typing

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### columnsFormatter

The `columnsFormatter` can be used :

- To `rename` columns in your query results.
- To apply `aggregate functions` to specific columns, such as calculating averages, sums etc.

`Parameters`

- `columns (object-1, object-n, ...)`

  - `column` `(string)`: The name of the column to be processed.
  - `column1` `(string)` : The name of the column to be processed. (Applied only for `CONCAT`)
  - `column2` `(string)` : The name of the column to be processed. (Applied only for `CONCAT`)
  - `aggregate?` `[optional] (string)`: This property, if applied, will `call aggregate function` for the specified `column` name, below you can find the available aggregate functions :
    - String : `'LOWER' | 'UPPER' | 'LENGTH' | 'CONCAT' | 'TRIM'`
    - ~~Number : `'AVG' | 'MIN' | 'MAX' | 'SUM' | 'ABS' | 'CEILING' | 'TOTAL' | 'COUNT' | 'ROUND' | 'FLOOR'.`~~ **Applicable only for** [this.builder().find](#find)
    - Date : `'DAY' | 'MONTH' | 'YEAR' | 'HOUR' | 'MINUTE' | 'SECOND'`
  - `renameAs` `(string)`: This property creates a new column with the given name

`Example 1`

```ts
const oneResult = this.builder()
  .findOne({ ID: 201 })
  .getExpand(['reviews'])
  .columns('reviews', 'bookName', 'authorName')
  .columnsFormatter({ column1: 'bookName', column2: 'authorName', aggregate: 'CONCAT', renameAs: 'bookAndAuthorName' })
  .execute();

// above typing will have the following properties
// 'reviews', 'bookName', 'authorName', 'bookAndAuthorName'
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### getExpand

Use `getExpand` to specify which columns you want to expand from the table.

`Overloads`

| Type            | Method                                                      | Parameters                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :-------------- | :---------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Single expand` | `getExpand(...associations : Columns<T>[]): FindBuilder<T>` | `...associations: Array<string>` | Use `Single expand` when you want to expand only certain associations from the root level of the entity. <br />--------<br /> An array of strings representing the columns to expand, this will expand only `first level` of `associations`.                                                                                                                                                                                                                                                                             |
| `Deep expand`   | `getExpand(associations : Expand<T>): FindBuilder<T>`       | `associations: object`           | Use `Deep expand` option when you want to deep expand certain associations. <br />--------<br /> An object representing the columns to expand. <br /><br /> `Value:` <br /><br /> - `{}` - If empty object is used as a value for an association, the empty object will perform a full expand of the association. <br /><br /> `Properties:` <br /><br /> - `select? : Array<string>` `[optional]`: Fetch only the mentioned columns. <br /> - `expand? : object` `[optional]`: Expand nested associations. <br /><br /> |
| `Auto expand`   | `getExpand(options : { levels : number }): FindBuilder<T>`  | `levels: number`                 | Use `Auto expand` to deep expand all associations within your entity. <br />--------<br /> You can control how deeply the method should expand associations by providing the `levels`.                                                                                                                                                                                                                                                                                                                                   |

`Example 1` : Auto expand

- `Root` - Entity
  - `child` - (association) - expanded
    - `child` - (composition) - expanded
    - ...
  - `child` - (association) - expanded
    - `child` (association) - expanded
    - ...
    -

```ts
const oneResult = await this.builder()
  .findOne({
    name: 'A company name',
  })
  .getExpand({ levels: 2 })
  .execute();
```

`Example 2` : Deep expand

```ts
// expand 'author', 'genre' and 'reviews' associations
const oneResult = await this.builder()
  .findOne({
    name: 'A company name',
  })
  .getExpand({
    // expand 'author'
    author: {},

    // expand 'genre', having only 'ID' and 'name'
    genre: {
      select: ['ID', 'name'],
    },

    // expand 'reviews', having only 'ID', 'book_ID' fields and 'reviewer' association
    reviews: {
      select: ['ID', 'book_ID'],

      // expand 'reviewer', having only the 'ID'
      expand: {
        reviewer: {
          select: ['ID'],
        },
      },
    },
  })
  .execute();
```

`Example 3` : Deep expand stored in a variable & using `columns()`

```ts
import { Expand } from '@dxfrontier/cds-ts-repository';

// expand 'author', and 'reviews' associations
const associations: Expand<MyEntity> = {
  // expand 'author'
  author: {},

  // expand 'reviews' having all fields + expand reviewer association having only 'ID'
  reviews: {
    // expand 'reviewer', having only the 'ID'
    expand: {
      reviewer: {
        select: ['ID'],
      },
    },
  },
};

const oneResult = await this.builder()
  .findOne({
    name: 'A company name',
  })
  .columns('author', 'reviews')
  .getExpand(associations)
  .execute();
```

> [!NOTE]
> If `columns` is used with `getExpand` the `columns` method will have impact on the final typing.

`Example 4` : Simple expand

```ts
// expand only 'orders' and 'reviews' associations
const oneResult = await this.builder()
  .findOne({
    name: 'A company name',
  })
  .getExpand('orders', 'reviews')
  // or
  //.getExpand(['orders', 'reviews'])
  .execute();
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### forUpdate

Exclusively locks the selected rows for subsequent updates in the current transaction, thereby preventing concurrent updates by other parallel transactions.

`Parameters`

- `options` `(object)`: An object containing the following properties:
  - `wait?` `(number) [optional]`: an integer specifying the timeout after which to fail with an error in case a lock couldn't be obtained.

`Example`

```ts
const oneResult = await this.builder()
  .findOne({
    name: 'A company name',
  })
  .forUpdate({ wait: 5 })
  //or
  //.forUpdate()
  .execute();
```

> [!TIP]
> More info can be found on the official SAP CAP [forUpdate](https://cap.cloud.sap/docs/node.js/cds-ql#forupdate) documentation.

###### forShareLock

Locks the selected rows in the current transaction, thereby preventing concurrent updates by other parallel transactions, until the transaction is committed or rolled back. Using a shared lock allows all transactions to read the locked record.

If a queried record is already exclusively locked by another transaction, the .forShareLock() method waits for the lock to be released.

`Example`

```ts
// Expand only 'orders' association
const oneResult = await this.builder()
  .findOne({
    name: 'A company name',
  })
  .forShareLock()
  .execute();
```

> [!TIP]
> More info can be found on the official SAP CAP [forShareLock](https://cap.cloud.sap/docs/node.js/cds-ql#forsharelock) documentation. documentation.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

###### execute

Finally, to execute the constructed query and retrieve the result as a single object, use the execute method. It returns a promise that resolves to the constructed query result.

`Return`

- `Promise<T | undefined>`: This method returns a Promise of `T` or `undefined` if nothing was found.

`Example 1`

```ts
const oneResult = await this.builder()
  .findOne({
    name: 'A company name',
  })
  .execute();
```

`Example 2`

```ts
const oneResult = await this.builder().findOne({ name: 'A company name' }).getExpand('orders').execute();
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### update

`update(keys: Entry<T>, fieldsToUpdate: Entry<T>): Promise<boolean>`

The `update` method allows you to update entries in the table that match the specified keys with new values for specific fields.

`Parameters`

- `keys (object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.
- `fieldsToUpdate (object)`: An object representing the fields and their updated values for the matching entries.

`Return`

- `Promise<boolean>`: This method returns a Promise of `true` if the update operation is `successful`, and `false` otherwise.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const updated = await this.update(
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
      { name: 'a new name', description: 'a new description' },
    );
    // Further logic with updated
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### updateOrCreate

`updateOrCreate(...entries: Entries<T>[]): Promise<boolean>`

The `updateOrCreate` method is a database operation that will update an existing row if a specified value already exists in a table, and insert a new row if the specified value doesn't already exist, similar to `UPSERT from SQL`.

`Parameters`

- `entries (...entries: Entries<T>[])`: An array of objects representing the entries to be created. Each object should match the structure expected by `MyEntity`.

`Return`

- `Promise<boolean>`: This method returns a Promise of `true` if the update/create operation is `successful`, and `false` otherwise.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const updatedOrCreated = await bookRepository.updateOrCreate(
      {
        ID: 123,
        title: 'Magic Forest',
        descr: 'A magical journey through enchanted woods!',
      },
      {
        ID: 456,
        title: 'Mystic Mountain',
        descr: 'Explore the mysteries of the ancient mountain!',
      },
    );
    // Further logic with updated
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### updateLocaleTexts

`updateLocaleTexts(localeCodeKeys: Entry<T> & Locale, fieldsToUpdate: Entry<T>): Promise<boolean>`

The `updateLocaleTexts` method allows you to update entries in the table that match the specified `localeCodeKeys` with new values for specific fields.

`Parameters`

- `localeCodeKeys (object)`: An object containing language codes `'en', 'de', 'fr', 'ro', ... ` and entity keys to filter entries.
- `fieldsToUpdate (object)`: An object representing the keys and values to update. Each key corresponds to a property in the entity.

`Return`

- `Promise<boolean>`: This method returns a Promise of `true` if the update operation is `successful`, and `false` otherwise.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const updated = await this.updateLocaleTexts({ locale: 'de', ID: 201 }, { name: 'ein neuer Name' });
    // Further logic with updated
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### delete

`delete(keys: Entry<T>): Promise<boolean>`

The `delete` method allows you to delete entries from the table that match the specified keys.

`Parameters`

- `keys (object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<boolean>`: This method returns a Promise of `true` if the delete operation is `successful`, and `false` otherwise.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const deleted1 = await this.delete({ name: 'Customer' });
    const deleted2 = await this.delete({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' });
    // Further logic with deleted1 and deleted2
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### deleteMany

`deleteMany(...entries: Entries<T>[]): Promise<boolean>`

The `deleteMany` method allows you to delete multiple entries from the table that match the specified keys.

`Parameters`

- `entries (...entries: Entries<T>[])` - An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<boolean>`: This method returns a Promise of `true` if all instances were successfully deleted and `false` otherwise.

`Example 1`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    // as an array of objects
    const deleted = await this.deleteMany([
      { ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' },
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
    ]);

    // as an spread of objects
    const deleted2 = await this.deleteMany(
      { ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' },
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
    );
    // Further logic with deleted
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### deleteAll

`deleteAll(): Promise<boolean>`

The `deleteAll` method allows you to delete all entries from the table but preserving the table structure, performing a cleanup of the table.

`Return`

- `Promise<boolean>`: This method returns a Promise of `true` if all instances were successfully deleted and `false` otherwise.

`Example 1`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const deleted = await this.deleteAll();
    // Further logic with deleted
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### exists

`exists(keys: Entry<T>): Promise<boolean>`

The `exists` method allows you to check whether entries exist in the table that match the specified fields.

`Parameters`

- `keys (object)`: Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<boolean>`: This method returns a Promise of `true` if the item exists in the databse and `false` otherwise.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const exists = await this.exists({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba09' });
    // Further logic with exists
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

#### count

`count(): Promise<number>`

The `count` method allows you to count all items from the table.

`Return`

- `Promise<number>`: This method returns the count / number of items from `MyEntity`.

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository';
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const numberOfItemsInMyEntity = await this.count();
    // Further logic with numberOfItemsInMyEntity
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

### `Helpers`

#### Filter

Use `Filter` to create complex `WHERE QUERY` filters.

`Overloads`

| Method                                                          | Parameters                                                                                                           | Description                                                                                                                                                                                                                                                                                                                                       |
| :-------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new Filter<T>(options: FilterOptions<T>)`                      | `options ({field : keyof T (string), operator : FilterOperator, value : string \| number \| string[] \| number[] })` | Creates a new filter. `T` should be generated using [CDS-Typer](#generate-cds-typed-entities) <br /><br /> `FilterOperator` values : `'EQUALS'`, `'NOT EQUAL'`, `'LIKE'`, `'STARTS_WITH'`, `'ENDS_WITH'`, `'LESS THAN'`, `'LESS THAN OR EQUALS'`, `'GREATER THAN'`, `'GREATER THAN OR EQUALS'`, `'BETWEEN'`, `'NOT BETWEEN'` , `'IN'`, `'NOT IN'` |
| `new Filter(operator: LogicalOperator, ...filters : Filter<T>)` | `operator (string)`, `filters Array<Filter>`                                                                         | Creates a new Filter instance which combines 2 ... n **filters** with a Logical operator `'AND'`, `'OR'`                                                                                                                                                                                                                                          |

`Example 1` : Single filter

```ts
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';
import { Filter, BaseRepository } from '@dxfrontier/cds-ts-repository';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const filter = new Filter<MyEntity>({
      field: 'name',
      operator: 'LIKE',
      value: 'Customer',
    });

    // Execute the query using the builder find
    const results = await this.builder().find(filter).orderAsc('name', 'location').execute();
    // OR
    // Execute the query using the find
    const results2 = await this.find(filter);
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example 2` : Combination of 2...n filters

```ts
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';
import { Filter, BaseRepository } from '@dxfrontier/cds-ts-repository';

class MyRepository extends BaseRepository<MyEntity> {
  constructor() {
    super(MyEntity); // a CDS Typer entity type
  }

  public async aMethod() {
    const filterLike = new Filter<MyEntity>({
      field: 'customer_name',
      operator: 'LIKE',
      value: 'abs',
    });

    const filterBetween = new Filter<MyEntity>({
      field: 'stock',
      operator: 'BETWEEN',
      value1: 11,
      value2: 333,
    });

    const filterIn = new Filter<MyEntity>({
      field: 'ID',
      operator: 'IN',
      value: [201, 203, 207],
    });

    /*
    combinedLikeAndBetweenFilters translates to : 
    descr like 'Wuthering' or stock between 11 and 333
    */
    const combinedLikeAndBetweenFilters = new Filter('OR', filterLike, filterBetween);

    /* 
    filters translates to : 
    (descr LIKE 'Wuthering' OR stock BETWEEN 11 and 333) AND ID IN ('203', '201', '207')
    */
    const filters = new Filter('AND', combinedLikeAndBetweenFilters, filterIn);

    // Execute the query using the builder find
    const results = await this.builder().find(filters).getExpand('orders').execute();
    // OR
    // Execute the query using the .find
    const results2 = await this.find(filters);
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

## `Examples`

Find here a collection of samples for the [CDS-TS-Dispatcher & CDS-TS-Repository](https://github.com/dxfrontier/cds-ts-samples)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)

Copyright (c) 2024 DXFrontier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Authors

- [@dragolea](https://github.com/dragolea)
- [@sblessing](https://github.com/sblessing)
- [@ABS GmbH](https://www.abs-gmbh.de/) team

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>
