import { type RepositoryPredefinedMethods, type KeyValueType, type Locale } from './types/types';
import { type Service } from '@sap/cds';
import { type entity } from '@sap/cds/apis/reflect';
import { type Definition } from '@sap/cds/apis/csn';
import SelectBuilder from './util/SelectBuilder';

abstract class BaseRepository<T> implements RepositoryPredefinedMethods<T> {
  protected abstract srv: Service;

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
   * @returns {INSERT<InsertResult<T>>} - A promise that resolves to the insert result.
   */
  public create(entry: KeyValueType<T>): INSERT<T> {
    return INSERT.into(this.entity).entries(entry);
  }

  /**
   * Inserts multiple entries into the database.
   * @param {KeyValueType<T>[]} entries - The entries to insert.
   * @returns {INSERT<InsertResult<T>>} - A promise that resolves to the insert result.
   */
  public createAll(entries: Array<KeyValueType<T>>): INSERT<T> {
    return INSERT.into(this.entity).entries(entries);
  }

  /**
   * Retrieves all records from the database.
   * @returns {SELECT<T[]>} - A promise that resolves to an array of records.
   */
  public getAll(): SELECT<T[]> {
    return SELECT.from(this.entity);
  }

  /**
   * Retrieves all distinct records from the database.
   * @returns {SELECT<T[]>} - A promise that resolves to an array of distinct records.
   */
  public getAllDistinct(): SELECT<T[]> {
    return SELECT.distinct.from(this.entity);
  }

  /**
   * Retrieves all records from the database with optional limit and offset.
   * @param {Object} props - The limit and optional offset.
   * @param {number} props.limit - The limit for the result set.
   * @param {number|undefined} [props.offset] - The optional offset for the result set.
   * @returns {SELECT<T[]>} - A promise that resolves to an array of records.
   */
  public getAllAndLimit(props: { limit: number; offset?: number | undefined }): SELECT<T[]> {
    const query = SELECT.from(this.entity);

    if (props.offset !== undefined) return query.limit(props.limit, props.offset);

    return query.limit(props.limit);
  }

  /**
   * Finds records based on the provided keys.
   * @param {KeyValueType<T>} keys - The keys to search for.
   * @returns {Promise<T[]>} - A promise that resolves to an array of matching records.
   */

  public find(keys: KeyValueType<T>): SELECT<T[]> {
    // before on every CQL action I can do a exclude of the properties which are virtual based on the entity ...
    // if you use a virtual field throw an error ...
    return SELECT.from(this.entity).where(keys);
  }

  /**
   * Finds a single record based on the provided keys.
   * @param {KeyValueType<T>} keys - The keys to search for.
   * @returns {Promise<T>} - A promise that resolves to a single matching record.
   */
  public findOne(keys: KeyValueType<T>): SELECT<T> {
    return SELECT.one.from(this.entity).where(keys);
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
  async updateAllBy(
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
   * @param {Locale} keys - The keys to search for.
   * @param {KeyValueType<T>} fieldsToUpdate - The fields to update.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the update is successful.
   */
  public async updateLocaleTexts(keys: Locale, fieldsToUpdate: KeyValueType<T>): Promise<boolean> {
    const updated = await UPDATE.entity(this.entity).set(fieldsToUpdate).where(keys);
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
  public async deleteAll(entries: Array<KeyValueType<T>>): Promise<boolean> {
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
