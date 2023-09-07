import { Definition } from '@sap/cds/apis/csn'
import { CdsService, RepositoryPredefinedMethods, KeyValueType, InsertResult, Locale } from './types/types'
import SelectBuilder from './util/SelectBuilder'
import { DELETE, INSERT, SELECT, UPDATE } from '@sap/cds/apis/ql'

abstract class BaseRepository<T> implements RepositoryPredefinedMethods<T> {
  protected abstract srv: CdsService

  constructor(private entityName: string) {
    this.entityName = entityName
  }

  // Private routines
  private getEntity(): Definition {
    return this.srv.entities[this.entityName]
  }

  private isAllSuccess(items: number[]): boolean {
    if (items.includes(0)) {
      return false
    }

    return true
  }

  // Public routines
  public async create(entry: KeyValueType<T>): Promise<InsertResult<T>> {
    return INSERT.into(this.getEntity()).values(entry)
  }

  public async createAll(entries: KeyValueType<T>[]): Promise<InsertResult<T>> {
    return INSERT.into(this.getEntity()).values(entries)
  }

  public async getAll(): Promise<T[]> {
    return SELECT.from(this.getEntity())
  }

  public async getAllDistinct(): Promise<T[]> {
    return SELECT.distinct.from(this.getEntity())
  }

  public async getAllAndLimit(props: { limit: number; offset?: number | undefined }): Promise<T[]> {
    const query = SELECT.from(this.getEntity())

    if (props.offset) return query.limit(props.limit, props.offset)
    const entity = this.getEntity()

    return query.limit(props.limit)
  }

  public async find(keys: KeyValueType<T>): Promise<T[]> {
    return SELECT.from(this.getEntity()).where(keys)
  }

  public async findOne<T>(keys: KeyValueType<T>): Promise<T> {
    return SELECT.one.from(this.getEntity()).where(keys)
  }

  public async findAndOrderAsc(keys: KeyValueType<T>, columns: (keyof T)[]): Promise<T[]> {
    return SELECT.from(this.getEntity())
      .where(keys)
      .orderBy(columns.join(' ') + ' asc')
  }

  public async findAndOrderDesc(keys: KeyValueType<T>, columns: (keyof T)[]): Promise<T[]> {
    return SELECT.from(this.getEntity())
      .where(keys)
      .orderBy(columns.join(' ') + ' desc')
  }

  public async findAndGroupBy(keys: KeyValueType<T>, columns: (keyof T)[]): Promise<T[]> {
    return SELECT.from(this.getEntity()).where(keys).groupBy(columns.join(' '))
  }

  public findBuilder(keys: KeyValueType<T>): SelectBuilder<T> {
    return new SelectBuilder<T>(this.getEntity(), keys)
  }

  public async update(keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>): Promise<boolean> {
    const updated = await UPDATE.entity(this.getEntity()).where(keys).set(fieldsToUpdate)
    return updated === 1 ? true : false
  }

  async updateAllBy(entries: { keys: KeyValueType<T>; fieldsToUpdate: KeyValueType<T> }[]): Promise<boolean> {
    const allPromises: any[] = []

    entries.forEach((instance) => {
      const update = UPDATE.entity(this.getEntity()).where(instance.keys).set(instance.fieldsToUpdate)
      allPromises.push(update)
    })

    const allUpdated: number[] = await Promise.all(allPromises)

    return this.isAllSuccess(allUpdated)
  }

  public async updateLocaleTexts(keys: Locale, fieldsToUpdate: KeyValueType<T>): Promise<boolean> {
    const updated = await UPDATE.entity(`${this.getEntity()}.texts`).set(fieldsToUpdate).where(keys)
    return updated === 1 ? true : false
  }

  public async delete(keys: KeyValueType<T>): Promise<boolean> {
    const deleted = await DELETE.from(this.getEntity()).where(keys)
    return deleted === 1 ? true : false
  }

  public async deleteAll(entries: KeyValueType<T>[]): Promise<boolean> {
    const allPromises: any[] = []

    entries.forEach((instance) => {
      const itemDelete = DELETE.from(this.getEntity()).where(instance)
      allPromises.push(itemDelete)
    })

    const deletedItems: number[] = await Promise.all(allPromises)

    return this.isAllSuccess(deletedItems)
  }

  public async exists(keys: KeyValueType<T>): Promise<boolean> {
    const found = await SELECT.from(this.getEntity()).where(keys)
    return found.length > 0
  }

  public async count(): Promise<number> {
    const found = await SELECT.from(this.getEntity())
    return found.length
  }
}

export default BaseRepository
