// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';
import { type Definition } from '@sap/cds/apis/csn';

import { type KeyValueType, type Locale, type InsertResult } from '../types/types';

import SelectBuilder from './SelectBuilder';
import Util from './Util';

class CoreRepository<T> {
  constructor(protected readonly entity: Definition | string) {
    this.entity = entity;
  }

  // Public routines

  public async create(entry: KeyValueType<T>): Promise<InsertResult<T>> {
    return await INSERT.into(this.entity).entries(entry);
  }

  public async createMany(entries: Array<KeyValueType<T>>): Promise<InsertResult<T>> {
    return await INSERT.into(this.entity).entries(entries);
  }

  public async getAll(): Promise<T[]> {
    return await SELECT.from(this.entity);
  }

  public async getDistinctColumns<Column extends keyof T>(columns: Column[]): Promise<Array<Pick<T, Column>>> {
    return await SELECT.distinct.from(this.entity).columns(...columns);
  }

  public async getAllAndLimit(props: { limit: number; skip?: number | undefined }): Promise<T[]> {
    const query = SELECT.from(this.entity);

    if (props.skip !== undefined) {
      return await query.limit(props.limit, props.skip);
    }

    return await query.limit(props.limit);
  }

  public async getLocaleTexts<Column extends keyof T>(columns: Column[]): Promise<Array<Pick<T, Column> & Locale>> {
    let getLocaleTexts;

    if (Util.isDefinition(this.entity)) {
      getLocaleTexts = await SELECT.from(`${this.entity.name}.texts`).columns(...columns, 'locale');
    }

    return getLocaleTexts;
  }

  public async find(keys: KeyValueType<T>): Promise<T[]> {
    return await SELECT.from(this.entity).where(keys);
  }

  public async findOne(keys: KeyValueType<T>): Promise<T> {
    return await SELECT.one.from(this.entity).where(keys);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public builder() {
    return {
      find: <Keys extends KeyValueType<T>>(keys: Keys): SelectBuilder<T, Keys> =>
        new SelectBuilder<T, Keys>(this.entity, keys),
    };
  }

  public async update(keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>): Promise<boolean> {
    const updated: number = await UPDATE.entity(this.entity).where(keys).set(fieldsToUpdate);
    return updated === 1;
  }

  public async updateLocaleTexts(
    localeCodeKeys: KeyValueType<T> & Locale,
    fieldsToUpdate: KeyValueType<T>,
  ): Promise<boolean> {
    let updated: number = 0;

    if (Util.isDefinition(this.entity)) {
      updated = await UPDATE.entity(`${this.entity.name}.texts`).with(fieldsToUpdate).where(localeCodeKeys);
    }
    return updated === 1;
  }

  public async delete(keys: KeyValueType<T>): Promise<boolean> {
    const deleted: number = await DELETE.from(this.entity).where(keys);
    return deleted === 1;
  }

  public async deleteMany(entries: Array<KeyValueType<T>>): Promise<boolean> {
    const allPromises: Array<DELETE<T>> = [];

    entries.forEach((instance) => {
      const itemDelete = DELETE.from(this.entity).where(instance);
      allPromises.push(itemDelete);
    });

    const deletedItems: number[] = await Promise.all(allPromises);

    return Util.isAllSuccess(deletedItems);
  }

  public async exists(keys: KeyValueType<T>): Promise<boolean> {
    const found: T[] = await SELECT.from(this.entity).where(keys);
    return found.length > 0;
  }

  public async count(): Promise<number> {
    const found: T[] = await SELECT.from(this.entity);
    return found.length;
  }
}

export { CoreRepository };
