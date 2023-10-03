import { type entity } from '@sap/cds/apis/reflect';
import { type Definition } from '@sap/cds/apis/csn';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

import { type RepositoryPredefinedMethods, type KeyValueType, type Locale, type InsertResult } from './types/types';
import SelectBuilder from './util/SelectBuilder';

abstract class BaseRepository<T> implements RepositoryPredefinedMethods<T> {
  constructor(private readonly entity: Definition) {
    this.entity = entity;
  }

  private isAllSuccess(items: number[]): boolean {
    if (items.includes(0)) {
      return false;
    }

    return true;
  }

  // Public routines

  /**
   * Inserts a single entry into the database.
   * @param {KeyValueType<T>} entry - The entry to insert.
   * @returns {INSERT<T>} - A promise that resolves to the insert result.
   */
  public async create(entry: KeyValueType<T>): Promise<InsertResult<T>> {
    return await INSERT.into(this.entity).entries(entry);
  }

  /**
   * Inserts multiple entries into the database.
   * @param {KeyValueType<T>[]} entries - The entries to insert.
   * @returns {INSERT<T>} - A promise that resolves to the insert result.
   */
  public async createMany(entries: Array<KeyValueType<T>>): Promise<InsertResult<T>> {
    return await INSERT.into(this.entity).entries(entries);
  }

  /**
   * Retrieves all records from the database.
   * @returns {Promise<T[]>} - A promise that resolves to an array of records.
   */
  public async getAll(): Promise<T[]> {
    return await SELECT.from(this.entity);
  }

  /**
   * Retrieves distinct records based on specific columns from the database.
   * @param {Array<keyof T>} columns - An array of column names to retrieve distinct records for.
   * @returns {Promise<T[]>} A promise that resolves to an array of distinct records.
   */
  public async getDistinctColumns(columns: Array<keyof T>): Promise<T[]> {
    return await SELECT.distinct.from(this.entity).columns(...columns);
  }

  /**
   * Retrieves all records from the database with optional limit and offset.
   * @param {Object} props - The limit and optional offset.
   * @param {number} props.limit - The limit for the result set.
   * @param {number|undefined} [props.skip] - The optional 'skip', this will skip number of items for the result set.
   * @returns {Promise<T[]>} - A promise that resolves to an array of records.
   */
  public async getAllAndLimit(props: { limit: number; skip?: number | undefined }): Promise<T[]> {
    const query = SELECT.from(this.entity);

    if (props.skip !== undefined) return await query.limit(props.limit, props.skip);

    return await query.limit(props.limit);
  }

  /**
   * Retrieves and updates localized texts for records based on the provided keys and fields to update.
   * @returns {Promise<T>} - A promise that resolves to an array of matching records.
   */
  public async getLocaleTexts(): Promise<T[]> {
    return await SELECT.from(`${this.entity.name}.texts`);
  }

  /**
   * Finds records based on the provided keys.
   * @param {KeyValueType<T>} keys - The keys to search for.
   * @returns {Promise<T[]>} - A promise that resolves to an array of matching records.
   */
  public async find(keys: KeyValueType<T>): Promise<T[]> {
    return await SELECT.from(this.entity).where(keys);
  }

  /**
   * Finds a single record based on the provided keys.
   * @param {KeyValueType<T>} keys - The keys to search for.
   * @returns {Promise<T>} - A promise that resolves to a single matching record.
   */
  public async findOne(keys: KeyValueType<T>): Promise<T> {
    return await SELECT.one.from(this.entity).where(keys);
  }

  /**
   * Returns a select builder for building custom queries.
   * @param {KeyValueType<T>} keys - The keys to search for.
   * @returns {SelectBuilder<T>} - A select builder instance.
   */
  public findBuilder(keys: KeyValueType<T>): SelectBuilder<T> {
    return new SelectBuilder<T>(this.entity as entity, keys);
  }

  /**
   * Updates records based on the provided keys and fields to update.
   * @param {KeyValueType<T>} keys - The keys to search for.
   * @param {KeyValueType<T>} fieldsToUpdate - The fields to update.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the update is successful.
   */
  public async update(keys: KeyValueType<T>, fieldsToUpdate: KeyValueType<T>): Promise<boolean> {
    const updated = await UPDATE.entity(this.entity).where(keys).set(fieldsToUpdate);
    return updated === 1;
  }

  /**
   * Updates multiple records based on the provided keys and fields to update.
   * @param {Array<{ keys: KeyValueType<T>; fieldsToUpdate: KeyValueType<T> }>} entries - The entries to update.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all updates are successful.
   */
  async updateMany(
    entries: Array<{
      keys: KeyValueType<T>;
      fieldsToUpdate: KeyValueType<T>;
    }>,
  ): Promise<boolean> {
    const allPromises: Array<UPDATE<T>> = [];

    entries.forEach((instance) => {
      const update = UPDATE.entity(this.entity).where(instance.keys).set(instance.fieldsToUpdate);
      allPromises.push(update);
    });

    const allUpdated: number[] = await Promise.all(allPromises);

    return this.isAllSuccess(allUpdated);
  }

  /**
   * Updates locale texts for records based on the provided keys and fields to update.
   * @param {KeyValueType<T> & Locale} localeCodeKeys - The localeCodeKeys to search for.
   * @param {KeyValueType<T>} fieldsToUpdate - The fields to update.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the update is successful.
   */
  public async updateLocaleTexts(
    localeCodeKeys: KeyValueType<T> & Locale,
    fieldsToUpdate: KeyValueType<T>,
  ): Promise<boolean> {
    const updated = await UPDATE.entity(`${this.entity.name}.texts`).with(fieldsToUpdate).where(localeCodeKeys);
    return updated === 1;
  }

  /**
   * Deletes records based on the provided keys.
   * @param {KeyValueType<T>} keys - The keys to search for.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the deletion is successful.
   */
  public async delete(keys: KeyValueType<T>): Promise<boolean> {
    const deleted = await DELETE.from(this.entity).where(keys);
    return deleted === 1;
  }

  /**
   * Deletes multiple records based on the provided keys.
   * @param {KeyValueType<T>[]} entries - The entries to delete.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all deletions are successful.
   */
  public async deleteMany(entries: Array<KeyValueType<T>>): Promise<boolean> {
    const allPromises: Array<DELETE<T>> = [];

    entries.forEach((instance) => {
      const itemDelete = DELETE.from(this.entity).where(instance);
      allPromises.push(itemDelete);
    });

    const deletedItems: number[] = await Promise.all(allPromises);

    return this.isAllSuccess(deletedItems);
  }

  /**
   * Checks if records based on the provided keys exist in the database.
   * @param {KeyValueType<T>} keys - The keys to search for.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if at least one record exists.
   */
  public async exists(keys: KeyValueType<T>): Promise<boolean> {
    const found = await SELECT.from(this.entity).where(keys);
    return found.length > 0;
  }

  /**
   * Counts the total number of records in the database.
   * @returns {Promise<number>} - A promise that resolves to the count of records.
   */
  public async count(): Promise<number> {
    const found = await SELECT.from(this.entity);
    return found.length;
  }
}

export default BaseRepository;
