<h2> CDS-TS-Repository - BaseRepository </h2>

<img src="https://img.shields.io/badge/SAP-0FAAFF?style=for-the-badge&logo=sap&logoColor=white" /> <img src="https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white" /> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white" /> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" />

The goal of **BaseRepository** is to significantly reduce the boilerplate code required to implement data access layers for persistance entities by providing out of the box actions on the `database`

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
        - [orderAsc](#orderasc)
        - [orderDesc](#orderdesc)
        - [groupBy](#groupby)
        - [columns](#columns)
        - [limit](#limit)
        - [getExpand](#getexpand)
        - [execute](#execute)
    - [update](#update)
    - [updateLocaleTexts](#updatelocaletexts)
    - [delete](#delete)
    - [deleteMany](#deletemany)
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

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

A much more detailed version of this pattern can be found on [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher)

## Usage

### `Option 1` : Using `BaseRepository` with `Standard SAP CDS-TS`

This guide explains how to use the BaseRepository with the `Standard SAP CDS-TS`, allowing you to work without the need for the [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher).

#### Step 1: Create MyRepository class

Start by creating `MyRepository` class, which will extend the `BaseRepository<T>` to handle operations for your entity.

`Example`

```ts
import { BaseRepository, TypedRequest } from '@dxfrontier/cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE'

class MyRepository extends BaseRepository<MyEntity> {

  constructor() {
    super(MyEntity)
  }

  public aMethod(req: TypedRequest<MyEntity>) {

    // BaseRepository predefined methods using the MyEntity entity
    // All methods parameters will allow only parameters of type MyEntity

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
    const result123 = await this.exists(...)
    const result143 = await this.count()
    // ...
  }
}

```

#### Step 2 : Integrate MyRepository class

Now that you have your `MyRepository`, you can integrate it into your implementation.

`Steps`

1. Create a new private field:

```ts
private myRepository: MyRepository
```

2. Initialize the myRepository :

```ts
this.myRepository = new MyRepository();
```

3. Use the handler on the `callback` of the `events` :

```ts
this.before('READ', MyEntity, (req) => this.myRepository.aMethod(req));
this.after('READ', MyEntity, (results, req) => this.myRepository.anotherMethod(results, req));
```

`Example`

```ts
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE';

class MainService extends cds.ApplicationService {
  private myRepository: MyRepository;
  // ...

  init() {
    this.myRepository = new MyRepository();
    // ...

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
class MyRepository
```

2. Add `@Repository` decorator :

```ts
@Repository()
class MyRepository
```

3. Extend `MyRepository` class to inherit the `BaseRepository` methods

```ts
@Repository()
class MyRepository BaseRepository<MyEntity> {}
```

`Example`

```ts

import { BaseRepository } from '@dxfrontier/cds-ts-repository'
import { Repository } from '@dxfrontier/cds-ts-dispatcher'

import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE'

@Repository()
class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  aMethod() {
    // BaseRepository predefined methods using the MyEntity entity
    // All methods parameters will allow only parameters of type MyEntity
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
}

export default MyRepository
```

#### Step 2 : Inject MyRepository class

Now `MyRepository` can be injected using `@Inject` in another class.

`Example`

```ts
@EntityHandler(Book)
class BookStatsHandler {
  @Inject(MyRepository) private readonly myRepository: MyRepository;
  ...
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

`(method) this.create(entry: KeyValueType<T>) : Promise<InsertResult<T>>`.

The `create` method allows you to create a new entry in the database.

`Parameters`

- `entry (Object)`: An object representing the entry to be created. The object should match the structure expected by `MyEntity`

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

`(method) this.createMany(entries: Array<KeyValueType<T>>) : Promise<InsertResult<T>>`.

The `createMany` method allows you to add multiple entries in the database.

`Parameters`

- `entries (Array<object>)`: An array of objects representing the entries to be created. Each object should match the structure expected by `MyEntity`.

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

The `getAll` method retrieves all database entries.

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

The `getDistinctColumns` method retrieves distinct values for the specified columns from the database.

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

`(method) this.getAllAndLimit(props: { limit: number; skip?: number | undefined }): Promise<T[]>`

The `getAllAndLimit` method allows you to find and retrieve a list of items with optional pagination.

`Parameters`

- `props` `(Object)`: An object containing the following properties:
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

The `find` method allows you to find and retrieve entries from the database that match the specified keys.

`Overloads`

| Method                                                              | Parameters                                                                                                                                                                              |
| :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `this.find(keys: KeyValueType<T>): SelectBuilder<T>`                | `keys (Object)`: An object representing the keys to filter the entries. <br /> Each key should correspond to a property in `MyEntity`, and the values should match the filter criteria. |
| `this.find(filter :`**[Filter\<T\>](#filter)**`): SelectBuilder<T>` | `filter (Filter)`: An instance of **[Filter\<T\>](#filter)**                                                                                                                            |

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

`findOne(keys: KeyValueType<T>): Promise<T | undefined>`

The `findOne` method allows you to find and retrieve a single entry from the database that matches the specified keys.
`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

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

| Method                                                                        | Parameters                                                                                                                                                                              |
| :---------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `this.builder().find(keys: KeyValueType<T>): SelectBuilder<T>`                | `keys (Object)`: An object representing the keys to filter the entries. <br /> Each key should correspond to a property in `MyEntity`, and the values should match the filter criteria. |
| `this.builder().find(filter :`**[Filter\<T\>](#filter)**`): SelectBuilder<T>` | `filter (Filter)`: An instance of **[Filter\<T\>](#filter)**                                                                                                                            |

`Return`

- `SelectBuilder<T>`: A `SelectBuilder` instance that provides access to the following methods for constructing a `SELECT`:
  - [orderAsc](#orderasc)
  - [orderDesc](#orderdesc)
  - [groupBy](#groupby)
  - [columns](#columns)
  - [limit](#limit)
  - [getExpand](#getexpand)
  - [execute](#execute)

###### orderAsc

To order the `ASC` selected columns, you can use the `orderAsc` methods. Pass an array of column names to specify the order.

`Parameters`

- `columns (Array<string>)` : An array of name of the columns to order by.

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

###### orderDesc

To order the `DESC` selected columns, you can use the `orderDesc` methods. Pass an array of column names to specify the order.

`Parameters`

- `columns (Array<string>)` : An array of name of the columns to order by.

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

###### groupBy

If you want to group the selected columns, use the groupBy method. Pass an array of column names to group by.

`Parameters`

- `columns (Array<string>)` : An array of name of the columns to group by.

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

###### columns

Specifies which columns to be fetched.

`Parameters`

- `columns (Array<string>)` : An array of name of the columns to show only.

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

###### limit

This method allows retrieve a list of items with optional pagination.

`Parameters`

- `props` `(object)`: An object containing the following properties:
  - `limit` `(number)`: The maximum number of items to retrieve.
  - `skip?` `(number)`: This property, if applied, will 'skip' a certain number of items (default: 0).

```ts
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .limit({ limit: 1 })
  .execute();
```

###### getExpand

You can specify which columns you want to retrieve from the database using the getExpand method. It also allows you to expand associated entities.

`Parameters`

- `associations` `(string[])`: The columns to expand, if `associations` argument is provided then the specified `associations / compositions` will be expanded.

```ts
// Expand only 'orders' association
const results = await this.builder()
  .find({
    name: 'A company name',
  })
  .getExpand('orders', 'reviews')
  // or
  //.getExpand(['orders', 'reviews'])
  .execute();
```

###### execute

Finally, to execute the constructed query and retrieve the results as an array of objects, use the execute method. It returns a promise that resolves to the query result.

```ts
const resultsAndAllExpandedEntities = await this.builder()
  .find({
    name: 'A company name',
  })
  .execute();
```

`Example`

```ts
import { BaseRepository } from '@dxfrontier/cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_ENTITY_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {

    const results = await this.builder().find({ name: 'A company name' }).orderAsc(['name']).limit({ limit: 5 }).getExpand(['orders']).execute()

    if (results) {
      // do something with results
    }

    // Variant 2
    const items = results?.length;
    const oneItem = results![0];

  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

#### update

`update(keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>): Promise<boolean>`

The `update` method allows you to update entries in the database that match the specified keys with new values for specific fields.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.
- `fieldsToUpdate (Object)`: An object representing the fields and their updated values for the matching entries.

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

#### updateLocaleTexts

`updateLocaleTexts(localeCodeKeys: KeyValueType<T> & Locale, fieldsToUpdate: KeyValueType<T>): Promise<boolean>`

The `updateLocaleTexts` method allows you to update entries in the database that match the specified `localeCodeKeys` with new values for specific fields.

`Parameters`

- `localeCodeKeys (Object)`: An object containing language codes `'en', 'de', 'fr', 'ro', ... ` and entity keys to filter entries.
- `fieldsToUpdate (Object)`: An object representing the keys and values to update. Each key corresponds to a property in the entity.

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

`delete(keys: KeyValueType<T>): Promise<boolean>`

The `delete` method allows you to delete entries from the database that match the specified keys.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

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

`deleteMany(entries: Array<KeyValueType<T>>): Promise<boolean>`

The `deleteMany` method allows you to delete multiple entries from the database that match the specified keys.

`Parameters`

- `entries (Array<object>)` - An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

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

#### exists

`exists(keys: KeyValueType<T>): Promise<boolean>`

The `exists` method allows you to check whether entries exist in the database that match the specified fields.

`Parameters`

- `keys (Object)`: Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

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

The `count` method allows you to count all items from the database.

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

| Method                                                          | Parameters                                                                                                                                       |
| :-------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `new Filter<T>(options: FilterOptions<T>)`                      | `options (object)`: Creates a new filter. `T` should be generated using [CDS-Typer](#generate-cds-typed-entities)                                |
| `new Filter(operator: LogicalOperator, ...filters : Filter<T>)` | `operator (string)`, `filters Array<Filter>`: Creates a new Filter instance which combines 2 ... n filters with a Logical operator `'AND', 'OR'` |

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
    const results = await this.builder().find(filter).orderAsc(['name']).execute();
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
    const results = await this.builder().find(filters).getExpand(['orders']).execute();
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

Copyright (c) 2023 DXFrontier

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
