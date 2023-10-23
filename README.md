# CDS-TS Dispatcher - BaseRepository

<img src="https://img.shields.io/badge/SAP-0FAAFF?style=for-the-badge&logo=sap&logoColor=white" /> <img src="https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white" /> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white" /> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" />

The goal of **[CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql)** **BaseRepository** is to significantly reduce the boilerplate code required to implement data access layers for persistance entities by providing out of the box actions on the `database`

<a name="readme-top"></a>

## Table of Contents

- [CDS-TS Dispatcher - BaseRepository](#cds-ts-dispatcher---baserepository)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Install CDS-TS-Repository](#install-cds-ts-repository)
    - [Generate CDS Typed entities](#generate-cds-typed-entities)
  - [Architecture](#architecture)
  - [Usage](#usage)
    - [Option 1 : Using `BaseRepository` with Standard SAP CDS-TS](#option-1--using-baserepository-with-standard-sap-cds-ts)
      - [Step 1: Create a HandleClass](#step-1-create-a-handleclass)
      - [Step 2 : Integrate HandleClass](#step-2--integrate-handleclass)
    - [Option 2 : Using `BaseRepository` with CDS-TS-Dispatcher](#option-2--using-baserepository-with-cds-ts-dispatcher)
      - [Methods](#methods)
        - [create](#create)
        - [createMany](#createmany)
        - [getAll](#getall)
        - [getDistinctColumns](#getdistinctcolumns)
        - [getAllAndLimit](#getallandlimit)
        - [getLocaleTexts](#getlocaletexts)
        - [find](#find)
        - [findOne](#findone)
        - [findBuilder](#findbuilder)
          - [orderAsc](#orderasc)
          - [orderDesc](#orderdesc)
          - [groupBy](#groupby)
          - [limit](#limit)
          - [getExpand](#getexpand)
          - [execute](#execute)
        - [update](#update)
        - [updateLocaleTexts](#updatelocaletexts)
        - [delete](#delete)
        - [deleteMany](#deletemany)
        - [exists](#exists)
        - [count](#count)
  - [Contributing](#contributing)
  - [License](#license)
  - [Authors](#authors)

## Installation

### Install CDS-TS-Repository

```bash
npm install cds-ts-respository
```

### Generate CDS Typed entities

The following command should be used to generate typed entity classes

```bash
npx @cap-js/cds-typer "*" --outputDirectory ./srv/util/types/entities
```

- Target folder :`./srv/util/types/entities` - Change to your location destination folder.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Architecture

**We recommend adhering** to the **Controller-Service-Repository**.

1. `Controller` - Responsible for managing the REST interface to the core business logic implemented in `ServiceLogic`.
2. `Service` - Contains business logic implementations
3. `Repository` - This component is dedicated to handling entity manipulation operations by leveraging the power of [CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql).

`Controller-Service-Repository` suggested folder structure

![alt text](https://github.com/dxfrontier/markdown-resources/blob/main/cds-ts-dispatcher/architecture_folder_structure.png?raw=true) <= expanded folders => ![alt text](https://github.com/dxfrontier/markdown-resources/blob/main/cds-ts-dispatcher/architecture_folder_structure_expanded.png?raw=true)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

A much more detailed version of this pattern can be found on [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Option 1 : Using `BaseRepository` with Standard SAP CDS-TS

This guide explains how to use the BaseRepository with the Standard SAP CDS-TS, allowing you to work with your entities without the need for the [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher).

<!-- If you want to use `BaseRepository` with the `SAP CDS-TS` without using the [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher) the following steps needs to be performed : -->

#### Step 1: Create a HandleClass

Start by creating a `HandleClass`, which will extend the `BaseRepository<T>` to handle operations for your entity. Here's an example of how to set it up:

`Example` HandleClass

```ts

import { Request } from '@sap/cap';

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class HandleClass extends BaseRepository<MyEntity> {

  constructor() {
    super(MyEntity)
  }

  public aMethod(req: Request) {

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

  public anotherMethod(results: MyEntity[], req: Request) {
    const result123 = await this.exists(...)
    const result143 = await this.count()
    // ...
  }
}

```

#### Step 2 : Integrate HandleClass

Now that you have your `HandleClass`, you can integrate it into your `main service`. Here's an example of how to do this:

1. Create a new private field `private handleClass: HandleClass`
2. Initalize the handleClass `this.handleClass = new HandleClass();`
3. Use the handler on the `callback` of the `events` :
   1. `this.before('READ', MyEntity, (req) => this.HandleClass.aMethod(req))`
   2. `this.after('READ', MyEntity, (results, req) => this.handleClass.anotherMethod(results, req))`

`Example` main class

```ts
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE';

class MainService extends cds.ApplicationService {
  private handleClass: HandleClass;
  // ...

  init() {
    this.handleClass = new HandleClass();
    // ...

    this.before('READ', MyEntity, (req) => this.handleClass.aMethod(req));
    this.after('READ', MyEntity, (results, req) => this.handleClass.anotherMethod(results, req));

    return super.init();
  }
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

### Option 2 : Using `BaseRepository` with [CDS-TS-Dispatcher](https://github.com/dxfrontier/cds-ts-dispatcher)

Start by creating a `MyRepository` class, which will extend the `BaseRepository<T>` to handle operations for your entity. Here's an example of how to set it up:

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

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

    // ...

  }
  ...
}

```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Methods

##### create

`(method) this.create(entry: KeyValueType<T>) : Promise<InsertResult<T>>`.

This method allows you to create a new entry in the database.

`Parameters`

- `entry (Object)`: An object representing the entry to be created. The object should match the structure expected by `MyEntity`

`Return`

- `Promise<InsertResult<T>>`: This method returns a Promise that resolves when the insertion operation is completed successfully.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const createdInstance = await this.create({
      name: 'Customer 1',
      description : 'Customer 1 description'
    })

  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### createMany

`(method) this.createMany(entries: Array<KeyValueType<T>>) : Promise<InsertResult<T>>`.

This method allows you to add multiple entries in the database.

`Parameters`

- `entries (Array)`: An array of objects representing the entries to be created. Each object should match the structure expected by `MyEntity`.

`Return`

- `Promise<InsertResult<T>>`: This method returns a `Promise` that resolves when the insertion operation is completed successfully.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const createdInstance = await this.createMany([
    {
      name: 'Customer 1',
      description : 'Customer 1 description'
    },
    {
      name: 'Customer 2',
      description : 'Customer 2 description'
    }])

  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### getAll

`(method) this.getAll(): Promise<T[]>`

This method will return all database `entries`.

`Return`

- `Promise<T[]>`: This method returns a Promise with an `array of type T`, where `T` is `MyEntity`.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.getAll()
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### getDistinctColumns

`(method) this.getDistinctColumns(columns: Array<keyof T>): Promise<T[]>`

This method will return all database `entries`.

`Parameters`

- `columns` `(Array)`: An array of column names to retrieve distinct records for. Each column name should be of a type that matches the entity's schema.

`Return`

- `Promise<T[]>`: This method returns a Promise with an `array of type T`, where `T` is `MyEntity`.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.getDistinctColumns(['currency_code', 'ID', 'name']);
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### getAllAndLimit

`(method) this.getAllAndLimit(props: { limit: number; skip?: number | undefined }): Promise<T[]>`

This method allows you to find and retrieve a `list of items with optional pagination.`

`Parameters`

- `props` `(Object)`: An object containing the following properties:
  - `limit` `(number)`: The maximum number of items to retrieve.
  - `skip?` `(optional, number)`: This property, if applied, will 'skip' a certain number of items (default: 0).

`Return`

- `Promise<T[]>`: This method returns a Promise with an `Array<T>`, where `T` is `MyEntity`.

`Example 1` : Retrieve the first 10 items

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.getAllAndLimit({limit : 10})
  }
  ...
}
```

`Example 2` : Retrieve items starting from the 20th item, limit to 5 items

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const resultsWithSkip = await this.getAllAndLimit({ limit: 5, skip: 20 })
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### getLocaleTexts

`(method) this.getLocaleTexts(): Promise<T[]>`

The `getLocaleTexts` method is designed to retrieve a list of items with localized text.

`Return`

- `Promise<T[]>`: This method returns a Promise with an `Array<T>`, where `T` is `MyEntity`.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.getLocaleTexts()
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### find

`find(keys: KeyValueType<T>): Promise<T[]>`

The method allows you to find and `retrieve entries` from the database that match the `specified keys`.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<T[]>`: This method returns a Promise with an `array of type T`, where `T` is `MyEntity`.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.find({ name : 'Customer', description : 'description'})
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### findOne

`findOne(keys: KeyValueType<T>): Promise<T>`

The method allows you to find and `retrieve a single entry` from the database that matches the specified keys.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<T>`: This method returns a Promise with an `single entry of type T`, where `T` is `MyEntity`.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const results = await this.findOne({ name : 'Customer', description : 'description'})
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### findBuilder

`(method) this.findBuilder(keys: KeyValueType<T>): SelectBuilder<T>`

The method allows you to create a `SelectBuilder` instance for building database `SELECT` queries based on specified keys.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `SelectBuilder<T>`: A `SelectBuilder` instance that provides access to the following methods for constructing a `SELECT`:
  - [orderAsc](#orderasc)
  - [orderDesc](#orderdesc)
  - [groupBy](#groupby)
  - [limit](#limit)
  - [getExpand](#getexpand)
  - [execute](#execute)

###### orderAsc

To order the `ASC` selected columns, you can use the `orderAsc` methods. Pass an array of column names to specify the order.

`Parameters`

- `columns (Array)` : An array of name of the columns to order by.

```ts
const results = await this.findBuilder({
  name: 'A company name',
})
  .orderAsc(['name'])
  .execute();
```

###### orderDesc

To order the `DESC` selected columns, you can use the `orderDesc` methods. Pass an array of column names to specify the order.

`Parameters`

- `columns (Array)` : An array of name of the columns to order by.

```ts
const results = await this.findBuilder({
  name: 'A company name',
})
  .orderDesc(['name'])
  .execute();
```

###### groupBy

If you want to group the selected columns, use the groupBy method. Pass an array of column names to group by.

`Parameters`

- `columns (Array)` : An array of name of the columns to group by.

```ts
const results = await this.findBuilder({
  name: 'A company name',
})
  .groupBy(['name'])
  .execute();
```

###### limit

This method allows retrieve a list of items with optional pagination.

`Parameters`

- `props` `(Object)`: An object containing the following properties:
  - `limit` `(number)`: The maximum number of items to retrieve.
  - `skip` `(optional, number)`: This property, if applied, will 'skip' a certain number of items (default: 0).

```ts
const results = await this.findBuilder({
  name: 'A company name',
})
  .limit({ limit: 1 })
  .execute();
```

###### getExpand

You can specify which columns you want to retrieve from the database using the getExpand method. It also allows you to expand associated entities.

`Parameters`

- `associations` `(optional, string[])`: The optional columns to expand, if `associations` argument is provided then only the specified `associations / compositions` will be fetched.
  - If `NO` `associations argument` provided then the method will fetch all `associations / compositions` present on the entity.

```ts
// Expand only 'orders' association
const results = await this.findBuilder({
  name: 'A company name',
})
  .getExpand(['orders'])
  .execute();

// OR expand all Associations and Compositions
const resultsAndAllExpandedEntities = await this.findBuilder({
  name: 'A company name',
})
  .getExpand()
  .execute();
```

###### execute

Finally, to execute the constructed query and retrieve the results as an array of objects, use the execute method. It returns a promise that resolves to the query result.

```ts
const resultsAndAllExpandedEntities = await this.findBuilder({
  name: 'A company name',
}).execute();
```

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {

    const results = await this.findBuilder({ name: 'A company name' }).orderAsc(['name']).limit({ limit: 1 }).getExpand().execute()

  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### update

`update(keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>): Promise<boolean>`

The method allows you to update entries in the database that match the specified keys with new values for specific fields.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.
- `fieldsToUpdate (Object)`: An object representing the fields and their updated values for the matching entries.

`Return`

- `Promise<boolean>`: This method returns a `Promise of true / false`

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
     const updated = await this.update(
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
      { name: 'a new name', 'description' : 'a new description' })
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### updateLocaleTexts

`updateLocaleTexts(localeCodeKey: Locale, fieldsToUpdate: KeyValueType<T>): Promise<boolean>`

The method allows you to update entries in the database that match the specified `localeCodeKey` with new values for specific fields.

`Parameters`

- `localeCodeKey (string)`: A string representing the language code to filter the entries, example `'en', 'de', 'fr', 'ro' ...`
- `fieldsToUpdate (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<boolean>`: This method returns :
  - `true` if language was updated.
  - `false` if language was not updated.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
     const updated = await this.updateLocaleTexts('de', { name: 'ein neuer Name'})
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### delete

`delete(keys: KeyValueType<T>): Promise<boolean>`

The method allows you to delete entries from the database that match the specified keys.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<boolean>`: This method returns :
  - `true` if item was deleted.
  - `false` if item was not deleted.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const deleted1 = await this.delete({ name : 'Customer'})
    const deleted2 = await this.delete({ ID : '2f12d711-b09e-4b57-b035-2cbd0a02ba19'})
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### deleteMany

`deleteMany(entries: Array<KeyValueType<T>>): Promise<boolean>`

The method allows you to delete `multiple entries` from the database that match the specified keys.

`Parameters`

- `entries (Array[Object])` - An object representing the keys to filter the entries. Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<boolean>`: This method returns :
  - `true` if all instances where successfully deleted.
  - `false` if at least `one` instance was not deleted.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
    const deleted = await this.deleteMany([
      { ID : '2f12d711-b09e-4b57-b035-2cbd0a02ba19'},
      { ID : 'a51ab5c8-f366-460f-8f28-0eda2e41d6db'}
    ])
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### exists

`exists(keys: KeyValueType<T>): Promise<boolean>`

The method allows you to check whether entries exist in the database that match the specified fields.

`Parameters`

- `keys (Object)`: Each key should correspond to a property in the `MyEntity`, and the values should match the filter criteria.

`Return`

- `Promise<boolean>`: This method returns :
  - `true` if item exists in the database.
  - `false` if the item does not exists in the database.

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
     const exists = await this.exists({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba09' })
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### count

`count(): Promise<number>`

The method allows to count all items from the database.

`Return`

- `Promise<number>`: This method returns the `count of items from MyEntity`

`Example`

```ts

import { BaseRepository } from 'cds-ts-repository'
import { MyEntity } from 'LOCATION_OF_YOUR_TYPE'

class MyRepository extends BaseRepository<MyEntity> {
  ...
  constructor() {
    super(MyEntity) // a CDS Typer entity type
  }

  public async aMethod() {
     const numberOfItemsInMyEntity = await this.count()
  }
  ...
}
```

> [!NOTE]
> MyEntity was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](https://choosealicense.com/licenses/mit/)

## Authors

- [@dragolea](https://github.com/dragolea)
- [@sblessing](https://github.com/sblessing)
- [@ABS GmbH](https://www.abs-gmbh.de/) team

<p align="right">(<a href="#readme-top">back to top</a>)</p>
