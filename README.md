# CDS-TS Dispatcher - BaseRepository

<img src="https://img.shields.io/badge/SAP-0FAAFF?style=for-the-badge&logo=sap&logoColor=white" /> <img src="https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white" /> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white" /> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" /> <img src="https://img.shields.io/badge/Cloud%20Foundry-0C9ED5?style=for-the-badge&logo=Cloud%20Foundry&logoColor=white" /> <img src="https://img.shields.io/badge/kubernetes-326ce5.svg?&style=for-the-badge&logo=kubernetes&logoColor=white" />

The goal of SAP CAP **[CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql)** `BaseRepository` is to significantly reduce the `boilerplate` code required to implement `data access layers for persistance entities` by providing `out of the box` actions on the `database` like `.create(), .getAll(), find() ...`

<a name="readme-top"></a>

## Table of Contents

- [CDS-TS Dispatcher - BaseRepository](#cds-ts-dispatcher---baserepository)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Architecture](#architecture)
  - [Usage](#usage)
    - [Option 1 : BaseRepository using (CDS-TS)](#option-1--baserepository-using-cds-ts)
    - [Option 2 : BaseRepository using (CDS-TS-Dispatcher)](#option-2--baserepository-using-cds-ts-dispatcher)
      - [Methods](#methods)
        - [create](#create)
        - [createAll](#createall)
        - [getAll](#getall)
        - [getAllDistinct](#getalldistinct)
        - [getAllAndLimit](#getallandlimit)
        - [find](#find)
        - [findOne](#findone)
        - [findBuilder](#findbuilder)
        - [update](#update)
        - [updateAllBy](#updateallby)
        - [updateLocaleTexts](#updatelocaletexts)
        - [delete](#delete)
        - [deleteAll](#deleteall)
        - [exists](#exists)
        - [count](#count)
    - [Example](#example)
  - [Contributing](#contributing)
  - [License](#license)
  - [Authors](#authors)

## Installation

To get started follow these steps:

```bash
npm install cds-ts-respository TODO
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Architecture

**We recommend adhering** to the **Controller-Service-Repository**.

1. `EntityHandler` - Manages the REST interface to the business logic `Service`
2. `Service` - Contains business logic implementations
3. `Repository` - Will contain manipulation of entities through the utilization of [CDS-QL]

A much more detailed version of this pattern can be found on [CDS-TS-Dispatcher](https://google.com) : TODO

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Option 1 : BaseRepository using (CDS-TS)

`BaseRepository` provides `out of the box` actions on the `database layer` like `.create(), .getAll(), find() ...`

`BaseRepository<T>` abstract class, which is parameterized with the `<T>` type which is a `TypeScript interface.`

If you want to use `BaseRepository` with the `SAP CDS-TS` without using the [CDS-TS-Dispatcher](#baserepository-cds-ts-dispatcher--option-2)

- Create a new private field `private HandleClass: HandleClass`
- Create a new handler class `class HandleClass extends BaseRepository<T> { ... `
- Use the handler on the `callback` of the `events` `this.before('READ', MyEntity, (req) => this.HandleClass.aMethod(req))`

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
class MainService extends cds.ApplicationService {
  private handleClass: HandleClass
  // ...

  init() {
    const { MyEntity } = this.entities

    this.handleClass = new HandleClass(this)
    // ...

    this.before('READ', MyEntity, (req: Request) => this.handleClass.aMethod(req))
    this.after('READ', MyEntity, (req: Request) => this.handleClass.anotherMethod(req))

    return super.init()
  }
}
```

```ts
import Service from '@sap/cds'

class HandleClass extends BaseRepository<MyInterface> {

  protected srv : Service

  constructor(srv : Service) {
    super('MyEntity')
    this.srv = srv;
  }

  public aMethod(req : Request) {

    // BaseRepository predefined methods using the 'MyEntity' entity
    // All methods parameters will allow only parameters of type 'MyInterface'

    const result1 = await this.create(...)
    const result2 = await this.createAll(...)
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

    public anotherMethod(req : Request) {
      // ...
  }
}

```

### Option 2 : BaseRepository using (CDS-TS-Dispatcher)

`BaseRepository` provides `out of the box` actions on the `database layer` like `.create(), .getAll(), .find() ...`

`BaseRepository<T>` abstract class, which is parameterized with the `<T>` type which is a `TypeScript interface.`

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

The `<T>` parameter is replaced by the `MyInterface` interface, resulting `methods arguments` with the `structure defined by MyInterface`.

All defined methods in the `BaseRepository` can be accessed in the class using the `this.` keyword.

`Example` using the CDS-TS-Dispatcher

```ts

import { MyInterface } from 'myTypes.ts'
import { Repository } from 'cds-ts-dispatcher';

@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // MyService.MyEntity CDS entity
  }

  aMethod() {

    // BaseRepository predefined methods using the 'MyEntity' entity
    // All methods parameters will allow only parameters of type 'MyInterface'

    const result1 = await this.create(...)
    const result2 = await this.createAll(...)
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

`Integration with CDS`

In the constructor of the `MyRepository`, `'MyEntity'` entity is passed to the super function. This connects the `BaseRepository` with the `CDS entity defined in your service.`

```ts
service MyService {
    entity MyEntity as projection on decorators.MyEntity;
}
```

`CDS interface Generator`

To see how **`<T>`** can be created from `.cds` please have a look over **[CDS2Types](https://www.npmjs.com/package/cds2types)** NPM package or for official SAP NPM package, refer to **[CDSTyper](https://cap.cloud.sap/docs/tools/cds-typer)**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Methods

##### create

`(method) this.create(entry: KeyValueType<T>) : Promise<InsertResult<T>>`.

This method allows you to create a new entry in the database.

`Parameters`

- `entry (Object)`: An object representing the entry to be created. The object should match the structure expected by `MyInterface`.

`Return value`

- `Promise<InsertResult<T>>`: This method returns a Promise that resolves when the insertion operation is completed successfully.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### createAll

`(method) this.createAll(entries: KeyValueType<T>[]) : Promise<InsertResult<T>>`.

This method allows you to add multiple entries in the database.

`Parameters`

- `entries (Array)`: An array of objects representing the entries to be created. Each object should match the structure expected by `MyInterface`.

`Return value`

- `Promise<InsertResult<T>>`: This method returns a Promise that resolves when the insertion operation is completed successfully.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const createdInstance = await this.createAll([
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### getAll

`(method) this.getAll(): Promise<T[]>`

This method will return all database `entries`.

`Return value`

- `Promise<T[]>`: This method returns a Promise with an `array of type T`, where `T` is `MyInterface`.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const results = await this.getAll()
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### getAllDistinct

`(method) this.getAllDistinct(): Promise<T[]>`

This method will return all database `entries`.

`Return value`

- `Promise<T[]>`: This method returns a Promise with an `array of type T`, where `T` is `MyInterface`.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const results = await this.getAllDistinct()
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### getAllAndLimit

`(method) this.getAllAndLimit(props: { limit: number; offset?: number | undefined }): Promise<T[]>`

This method allows you to find and retrieve a `list of items with optional pagination.`

`Parameters`

- `props` `(Object)`: An object containing the following properties:
  - `limit` `(number)`: The maximum number of items to retrieve.
  - `offset?` `(optional, number)`: The optional offset to skip a certain number of items (default: 0).

`Return value`

- `Promise<T[]>`: This method returns a Promise with an `array of type T`, where `T` is `MyInterface`.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example 1` : Retrieve the first 10 items

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const results = await this.getAllAndLimit({limit : 10})
  }
  ...
}
```

`Example 2` : Retrieve items starting from the 20th item, limit to 5 items

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const resultsWithOffset = await this.getAllAndLimit({ limit: 5, offset: 20 })
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### find

`find(keys: KeyValueType<T>): Promise<T[]>`

The method allows you to find and `retrieve entries` from the database that match the `specified keys`.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.

`Return value`

- `Promise<T[]>`: This method returns a Promise with an `array of type T`, where `T` is `MyInterface`.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const results = await this.find({ name : 'Customer', description : 'description'})
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### findOne

`findOne(keys: KeyValueType<T>): Promise<T>`

The method allows you to find and `retrieve a single entry` from the database that matches the specified keys.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.

`Return value`

- `Promise<T>`: This method returns a Promise with an `single entry of type T`, where `T` is `MyInterface`.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const results = await this.findOne({ name : 'Customer', description : 'description'})
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### findBuilder

`(method) this.findBuilder(keys: KeyValueType<T>): SelectBuilder<T>`

The method allows you to create a `SelectBuilder` instance for building database `SELECT` queries based on specified keys.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.

`Return value`

- `SelectBuilder<T>`: A `SelectBuilder` instance that provides access to the following methods for constructing a `SELECT query` to retrieve data from the database:
  - `orderAsc`
  - `orderDesc`
  - `groupBy`
  - `limit`
  - `execute`

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {

    const results = await this.findBuilder({ name: 'A company name' }).orderAsc(['name']).limit({ limit: 1 }).execute()

  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### update

`update(keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>): Promise<boolean>`

The method allows you to update entries in the data store that match the specified keys with new values for specific fields.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.
- `fieldsToUpdate (Object)`: An object representing the fields and their updated values for the matching entries.

`Return value`

- `Promise<boolean>`: This method returns a `Promise of true / false`

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
     const updated = await this.update(
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
      { name: 'a new name', 'description' : 'a new description' })
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### updateAllBy

`updateAllBy(entries : { keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T> }[]): Promise<boolean>`

The method in this class allows you to update `multiple database entries` based on specified keys and the fields to update.

`Parameters`

- `entries (Array[Object])`

  - `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.
  - `fieldsToUpdate (Object)`: An object representing the fields and their updated values for the matching entries.

- `Promise<boolean>`: This method returns :
  - `true` if all instances where successfully updated.
  - `false` if at least `one` instance was not successfully updated.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const updateAll = await this.updateAllBy([
      { keys: { name: 'Company 1' }, fieldsToUpdate: { name: 'Company 1 new name' } },
      { keys: { name: 'Company 2' }, fieldsToUpdate: { name: 'Company 2 new name' } },
    ])
  }
  ...
}
```

##### updateLocaleTexts

`updateLocaleTexts(keys: Locale, fieldsToUpdate: KeyValueType<T>): Promise<boolean>`

The method allows you to update entries in the data store that match the specified keys with new values for specific fields.

`Parameters`

- `key (string)`: A string representing the language code to filter the entries, example `'en', 'de', 'fr', 'ro' ...`
- `fieldsToUpdate (Object)`: An object representing the fields and their updated values for the matching entries.

`Return value`

- `Promise<boolean>`: This method returns :
  - `true` if all instances where successfully updated.
  - `false` if at least `one` instance was not successfully updated.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
     const updated = await this.updateLocaleTexts('de', { name: 'ein neuer Name'})
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### delete

`delete(keys: KeyValueType<T>): Promise<boolean>`

The method allows you to delete entries from the database that match the specified keys.

`Parameters`

- `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.

`Return value`

- `Promise<boolean>`: This method returns a `Promise of true / false`

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const deleted1 = await this.delete({ name : 'Customer'})
    const deleted2 = await this.delete({ ID : '2f12d711-b09e-4b57-b035-2cbd0a02ba19'})
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### deleteAll

`deleteAll(entries : { keys: KeyValueType<T> }[]): Promise<boolean>`

The method allows you to `multiple entries` from the database that match the specified keys.

`Parameters`

- `entries (Array[Object])`
  - `keys (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.

`Return value`

- `Promise<boolean>`: This method returns :
  - `true` if all instances where successfully deleted.
  - `false` if at least `one` instance was not deleted successfully.

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
    const deleted = await this.deleteAll([
      { ID : '2f12d711-b09e-4b57-b035-2cbd0a02ba19'},
      { ID : 'a51ab5c8-f366-460f-8f28-0eda2e41d6db'}
    ])
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### exists

`exists(fieldsToUpdate: KeyValueType<T>): Promise<boolean>`

The method allows you to check whether entries exist in the database that match the specified fields.

`Parameters`

- `fieldsToUpdate (Object)`: An object representing the fields and their updated values for the matching entries.

`Return value`

- `Promise<boolean>`: This method returns a `Promise of true / false`

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
     const exists = await this.exists({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba09' })
  }
  ...
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

##### count

`count(): Promise<number>`

The method allows to count all items from the database.

`Return value`

- `Promise<number>`: This method returns a `Promise number of items from MyEntity`

`MyInterface`

```ts
export interface MyInterface {
  ID: string
  createdAt?: Date
  createdBy?: string
  modifiedAt?: Date
  modifiedBy?: string
  name: string
  description: string
}
```

`Example`

```ts
@Repository()
class MyRepository extends BaseRepository<MyInterface> {
  ...
  constructor() {
    super('MyEntity') // a CDS entity name
  }

  public async aMethod() {
     const numberOfItemsInMyEntity = await this.count()
  }
  ...
}
```

### Example

TODO

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
```
