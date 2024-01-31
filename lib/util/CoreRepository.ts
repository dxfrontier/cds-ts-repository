/* eslint-disable @typescript-eslint/no-explicit-any */

import SelectBuilder from './SelectBuilder';
import Util from './Util';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

import type { Entry, Locale, InsertResult, FindReturn, Entries, Columns, ShowOnlyColumns } from '../types/types';
import type Filter from './Filter';

class CoreRepository<T> {
  constructor(protected readonly entity: string) {
    this.entity = entity;
  }

  // Public routines
  public async create(entry: Entry<T>): Promise<InsertResult<T>> {
    return await INSERT.into(this.entity).entries(entry);
  }

  public async createMany(...entries: Entries<T>[]): Promise<InsertResult<T>> {
    return await INSERT.into(this.entity).entries(...entries);
  }

  public async getAll(): Promise<T[] | undefined> {
    return await SELECT.from(this.entity);
  }

  public async getDistinctColumns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<Array<Pick<T, ShowOnlyColumns<T, ColumnKeys>>> | undefined> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;

    return await SELECT.distinct.from(this.entity).columns(...allColumns);
  }

  public async getAllAndLimit(options: { limit: number; skip?: number | undefined }): Promise<T[] | undefined> {
    const query = SELECT.from(this.entity);

    if (options.skip !== undefined) {
      return await query.limit(options.limit, options.skip);
    }

    return await query.limit(options.limit);
  }

  public async getLocaleTexts<Column extends keyof T>(
    columns: Column[],
  ): Promise<Array<Pick<T, Column> & Locale> | undefined> {
    return await SELECT.from(`${this.entity}.texts`).columns(...columns, 'locale');
  }

  public async find(keys?: Entry<T> | Filter<T> | string): Promise<T[] | undefined> {
    const filterKeys = Util.buildQueryKeys(keys);

    return await SELECT.from(this.entity).where(filterKeys);
  }

  public async findOne(keys: Entry<T>): Promise<T | undefined> {
    return await SELECT.one.from(this.entity).where(keys);
  }

  public builder(): FindReturn<T> {
    return {
      find: (keys?: Entry<T> | Filter<T> | string): SelectBuilder<T, any> => {
        const filterKeys = Util.buildQueryKeys(keys);

        return new SelectBuilder<T, unknown>(this.entity, filterKeys);
      },
    };
  }

  public async update(keys: Entry<T>, fieldsToUpdate: Entry<T>): Promise<boolean> {
    const updated: number = await UPDATE.entity(this.entity).where(keys).set(fieldsToUpdate);
    return updated === 1;
  }

  public async updateLocaleTexts(localeCodeKeys: Entry<T> & Locale, fieldsToUpdate: Entry<T>): Promise<boolean> {
    const updated: number = await UPDATE.entity(`${this.entity}.texts`).with(fieldsToUpdate).where(localeCodeKeys);
    return updated === 1;
  }

  public async delete(keys: Entry<T>): Promise<boolean> {
    const deleted: number = await DELETE.from(this.entity).where(keys);
    return deleted === 1;
  }

  public async deleteMany(...entries: Entries<T>[]): Promise<boolean> {
    const items = Array.isArray(entries[0]) ? entries[0] : entries;

    const allPromises: Array<DELETE<any>> = [];

    items.forEach((instance) => {
      const itemDelete = DELETE.from(this.entity).where(instance);
      allPromises.push(itemDelete);
    });

    const deletedItems: number[] = await Promise.all(allPromises);

    return Util.isAllSuccess(deletedItems);
  }

  public async exists(keys: Entry<T>): Promise<boolean> {
    const found: T[] = await SELECT.from(this.entity).where(keys);
    return found.length > 0;
  }

  public async count(): Promise<number> {
    const found: T[] = await SELECT.from(this.entity);
    return found.length;
  }
}

export { CoreRepository };
