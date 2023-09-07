import { Service as CdsService } from '@sap/cds'
import SelectBuilder from '../util/SelectBuilder'

type KeyValueType<T> = {
  [K in keyof T]?: T[K]
}

type InsertResult<T> = { query: { INSERT: { entries: T[] } } }

type Locale = string

interface RepositoryPredefinedMethods<T> {
  create(entry: KeyValueType<T>): Promise<InsertResult<T>>
  createAll(entries: KeyValueType<T>[]): Promise<InsertResult<T>>

  getAll(): Promise<T[]>
  getAllDistinct(): Promise<T[]>
  getAllAndLimit(props: { limit: number; offset?: number }): Promise<T[]>

  find(keys: KeyValueType<T>): Promise<T[]>
  findOne(keys: KeyValueType<T>): Promise<T>
  findAndOrderAsc(keys: KeyValueType<T>, columns: Array<keyof T>): Promise<T[]>
  findAndOrderDesc(keys: KeyValueType<T>, columns: Array<keyof T>): Promise<T[]>
  findAndGroupBy(keys: KeyValueType<T>, columns: Array<keyof T>): Promise<T[]>
  findBuilder(keys: KeyValueType<T>): SelectBuilder<T>

  update(keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>): Promise<boolean>
  updateAllBy(entries: { keys: KeyValueType<T>; fieldsToUpdate: KeyValueType<T> }[]): Promise<boolean>
  updateLocaleTexts(keys: Locale, fieldsToUpdate: KeyValueType<T>): Promise<boolean>

  delete(keys: KeyValueType<T>): Promise<boolean>
  deleteAll(entries: KeyValueType<T>[]): Promise<boolean>

  exists(keys: KeyValueType<T>): Promise<boolean>

  count(): Promise<number>
}

export { CdsService, RepositoryPredefinedMethods, KeyValueType, InsertResult, Locale }
