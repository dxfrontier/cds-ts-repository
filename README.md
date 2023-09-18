# CDS-TS Dispatcher - BaseRepository

<img src="https://img.shields.io/badge/SAP-0FAAFF?style=for-the-badge&logo=sap&logoColor=white" /> <img src="https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white" /> <img src="https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /> <img src="https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white" /> <img src="https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white" /> <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" /> <img src="https://img.shields.io/badge/Cloud%20Foundry-0C9ED5?style=for-the-badge&logo=Cloud%20Foundry&logoColor=white" /> <img src="https://img.shields.io/badge/kubernetes-326ce5.svg?&style=for-the-badge&logo=kubernetes&logoColor=white" />

The goal of SAP CAP **[CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql)** **BaseRepository** is to significantly reduce the boilerplate code required to implement data access layers for persistance entities by providing out of the box actions on the `database`

<a name="readme-top"></a>

## Table of Contents

- [CDS-TS Dispatcher - BaseRepository](#cds-ts-dispatcher---baserepository)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Install CDS-TS-Repository](#install-cds-ts-repository)
    - [Generate CDS Typed entities](#generate-cds-typed-entities)
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
          - [orderAsc](#orderasc)
          - [orderDesc](#orderdesc)
          - [groupBy](#groupby)
          - [limit](#limit)
          - [getExpand](#getexpand)
          - [execute](#execute)
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

### Install CDS-TS-Repository

```bash
npm install cds-ts-respository TODO
```

### Generate CDS Typed entities

The following command should be used to generate typed entity classes

```bash
npx @cap-js/cds-typer ./srv/controller/mainService --outputDirectory ./srv/util/types/entities
```

Source folder : `./srv/controller/mainService` - Change to your location folder
Target folder :`./srv/util/types/entities` - Change to your location folder

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Architecture

**We recommend adhering** to the **Controller-Service-Repository**.

1. `Controller` - Manages the REST interface to the business logic `Service`
2. `Service` - Contains business logic implementations
3. `Repository` - Will contain manipulation of entities through the utilization of **[CDS-QL](https://cap.cloud.sap/docs/node.js/cds-ql)** out of the box actions.

A much more detailed version of this pattern can be found on [CDS-TS-Dispatcher](https://google.com) : TODO

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Option 1 : BaseRepository using (CDS-TS)

If you want to use `BaseRepository` with the `SAP CDS-TS` without using the [CDS-TS-Dispatcher](#baserepository-cds-ts-dispatcher--option-2) the following steps needs to be performed :

- Create a new private field `private HandleClass: HandleClass`
- Create a new handler class `class HandleClass extends BaseRepository<T> { ... `
- Use the handler on the `callback` of the `events` `this.before('READ', MyEntity, (req) => this.HandleClass.aMethod(req))`

`Example` main class

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

`MyInterface`

- `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Example` HandleClass

```ts
import { Service, Request } from '@sap/cds'
import BaseRepository from 'cds-ts-repository'
import { MyInterface } from 'LOCATION_OF_YOUR_TYPE'

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

If you want to use `BaseRepository` with the [CDS-TS-Dispatcher](#baserepository-cds-ts-dispatcher--option-2) the following steps needs to be performed :

All defined methods in the `BaseRepository` can be accessed in the class using the `this.` keyword.

`Example`

```ts

import { Repository } from 'cds-ts-dispatcher'
import BaseRepository from 'cds-ts-repository'
import { MyInterface } from 'LOCATION_OF_YOUR_TYPE'

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

`MyInterface`

- `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

#### Methods

##### create

`(method) this.create(entry: KeyValueType<T>) : Promise<InsertResult<T>>`.

This method allows you to create a new entry in the database.

`Parameters`

- `entry (Object)`: An object representing the entry to be created. The object should match the structure expected by `MyInterface`
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

- `Promise<InsertResult<T>>`: This method returns a Promise that resolves when the insertion operation is completed successfully.

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

- `Promise<InsertResult<T>>`: This method returns a Promise that resolves when the insertion operation is completed successfully.

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

- `Promise<T[]>`: This method returns a Promise with an `array of type T`, where `T` is `MyInterface`.

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

- `Promise<T>`: This method returns a Promise with an `single entry of type T`, where `T` is `MyInterface`.

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

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

- `name` `Array` name of the columns to order.

```ts
const results = await this.findBuilder({ name: 'A company name' }).orderAsc(['name']).execute()
```

###### orderDesc

To order the `DESC` selected columns, you can use the `orderDesc` methods. Pass an array of column names to specify the order.

`Parameters`

- `name` `Array` name of the columns to order.

```ts
const results = await this.findBuilder({ name: 'A company name' }).orderDesc(['name']).execute()
```

###### groupBy

If you want to group the selected columns, use the groupBy method. Pass an array of column names to group by.

`Parameters`

- `name` `Array` name of the columns to group.

```ts
const results = await this.findBuilder({ name: 'A company name' }).groupBy(['name']).execute()
```

###### limit

This method allows retrieve a list of items with optional pagination.

`Parameters`

- `props` `(Object)`: An object containing the following properties:
  - `limit` `(number)`: The maximum number of items to retrieve.
  - `offset` `(optional, number)`: The optional offset to skip a certain number of items (default: 0).

```ts
const results = await this.findBuilder({ name: 'A company name' }).limit({ limit: 1 }).execute()
```

###### getExpand

You can specify which columns you want to retrieve from the database using the getExpand method. It also allows you to expand associated entities.

`Parameters`

- `name` `(optional, string)`: The name of the column to expand, if `name` is provided then only the `name` association / composition will be fetched. If no `argument` provided then the method will get all associations / compositions

```ts
const results = await this.findBuilder({ name: 'A company name' }).getExpand('orders').execute()
// OR
const resultsAndAllExpandedEntities = await this.findBuilder({ name: 'A company name' }).getExpand().execute()
```

###### execute

Finally, to execute the constructed query and retrieve the results as an array of objects, use the execute method. It returns a promise that resolves to the query result.

```ts
const resultsAndAllExpandedEntities = await this.findBuilder({ name: 'A company name' }).execute()
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

    const results = await this.findBuilder({ name: 'A company name' }).orderAsc(['name']).limit({ limit: 1 }).getExpand().execute()

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.
- `fieldsToUpdate (Object)`: An object representing the fields and their updated values for the matching entries.

`Return value`

- `Promise<boolean>`: This method returns a `Promise of true / false`

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
    - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.
  - `fieldsToUpdate (Object)`: An object representing the fields and their updated values for the matching entries.

- `Promise<boolean>`: This method returns :
  - `true` if all instances where successfully updated.
  - `false` if at least `one` instance was not successfully updated.

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
- `fieldsToUpdate (Object)`: An object representing the keys to filter the entries. Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

- `Promise<boolean>`: This method returns :
  - `true` if all instances where successfully updated.
  - `false` if at least `one` instance was not successfully updated.

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
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

- `Promise<boolean>`: This method returns a `Promise of true / false`

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
    - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

- `Promise<boolean>`: This method returns :
  - `true` if all instances where successfully deleted.
  - `false` if at least `one` instance was not deleted successfully.

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

- `fieldsToUpdate (Object)`: Each key should correspond to a property in the `MyInterface`, and the values should match the filter criteria.
  - `MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

`Return value`

- `Promise<boolean>`: This method returns a `Promise of true / false`

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

`MyInterface` was generated using [CDS-Typer](#generate-cds-typed-entities) and imported in the the class.

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
