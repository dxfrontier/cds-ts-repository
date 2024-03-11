/* eslint-disable @typescript-eslint/no-explicit-any */

import FindBuilder from './FindBuilder';
import util from './util';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

import type {
  Entry,
  Locale,
  InsertResult,
  FindReturn,
  Entries,
  Columns,
  ShowOnlyColumns,
  Entity,
} from '../types/types';
import type { Filter } from '../..';
import FindOneBuilder from './FindOneBuilder';

class CoreRepository<T> {
  private readonly resolvedEntity: string;

  constructor(protected readonly entity: Entity) {
    this.resolvedEntity = util.resolveEntityName(entity);
  }

  // Public routines
  public async create(entry: Entry<T>): Promise<InsertResult<T>> {
    return await INSERT.into(this.resolvedEntity).entries(entry);
  }

  public async createMany(...entries: Entries<T>[]): Promise<InsertResult<T>> {
    return await INSERT.into(this.resolvedEntity).entries(...entries);
  }

  public async getAll(): Promise<T[] | undefined> {
    return await SELECT.from(this.resolvedEntity);
  }

  public async getDistinctColumns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<Array<Pick<T, ShowOnlyColumns<T, ColumnKeys>>> | undefined> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;

    return await SELECT.distinct.from(this.resolvedEntity).columns(...allColumns);
  }

  public async getAllAndLimit(options: { limit: number; skip?: number | undefined }): Promise<T[] | undefined> {
    const query = SELECT.from(this.resolvedEntity);

    if (options.skip !== undefined) {
      return await query.limit(options.limit, options.skip);
    }

    return await query.limit(options.limit);
  }

  public async getLocaleTexts<Column extends keyof T>(
    columns: Column[],
  ): Promise<Array<Pick<T, Column> & Locale> | undefined> {
    return await SELECT.from(`${this.entity.name}.texts`).columns(...columns, 'locale');
  }

  public async find(keys?: Entry<T> | Filter<T> | string): Promise<T[] | undefined> {
    const filterKeys = util.buildQueryKeys(keys);

    return await SELECT.from(this.resolvedEntity).where(filterKeys);
  }

  public async findOne(keys: Entry<T>): Promise<T | undefined> {
    return await SELECT.one.from(this.resolvedEntity).where(keys);
  }

  public builder(): FindReturn<T> {
    return {
      find: (keys?: Entry<T> | Filter<T> | string): FindBuilder<T, any> => {
        const filterKeys = util.buildQueryKeys(keys);

        return new FindBuilder<T, unknown>(this.entity, filterKeys);
      },
      findOne: (keys?: Entry<T> | Filter<T> | string): FindOneBuilder<T, any> => {
        const filterKeys = util.buildQueryKeys(keys);

        return new FindOneBuilder<T, unknown>(this.entity, filterKeys);
      },
    };
  }

  public async update(keys: Entry<T>, fieldsToUpdate: Entry<T>): Promise<boolean> {
    const updated: number = await UPDATE.entity(this.resolvedEntity).where(keys).set(fieldsToUpdate);
    return updated === 1;
  }

  public async updateLocaleTexts(localeCodeKeys: Entry<T> & Locale, fieldsToUpdate: Entry<T>): Promise<boolean> {
    const updated: number = await UPDATE.entity(`${this.entity.name}.texts`).with(fieldsToUpdate).where(localeCodeKeys);
    return updated === 1;
  }

  public async delete(keys: Entry<T>): Promise<boolean> {
    const deleted: number = await DELETE.from(this.resolvedEntity).where(keys);
    return deleted === 1;
  }

  public async deleteMany(...entries: Entries<T>[]): Promise<boolean> {
    const items = Array.isArray(entries[0]) ? entries[0] : entries;

    const allPromises: Array<DELETE<any>> = [];

    items.forEach((instance) => {
      const itemDelete = DELETE.from(this.resolvedEntity).where(instance);
      allPromises.push(itemDelete);
    });

    const deletedItems: number[] = await Promise.all(allPromises);

    return util.isAllSuccess(deletedItems);
  }

  public async exists(keys: Entry<T>): Promise<boolean> {
    const found: T[] = await SELECT.from(this.resolvedEntity).where(keys);
    return found.length > 0;
  }

  public async count(): Promise<number> {
    const found: T[] = await SELECT.from(this.resolvedEntity);
    return found.length;
  }
}

export { CoreRepository };
