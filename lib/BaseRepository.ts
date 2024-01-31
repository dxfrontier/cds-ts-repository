/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

import type { Columns, Entries, InsertResult, Entry, Locale, ShowOnlyColumns } from './types/types';
import type Filter from './util/Filter';

import { CoreRepository } from './util/CoreRepository';
import { type Constructable } from '@sap/cds/apis/internal/inference';

abstract class BaseRepository<T> {
  protected readonly coreRepository: CoreRepository<T>;

  constructor(protected readonly entity: Constructable<T>) {
    this.coreRepository = new CoreRepository(this.entity.name);
  }

  // Public routines

  /**
   * Inserts a single entry into the database.
   * @param entry An object representing the entry to be created.
   * @returns A promise that resolves to the insert result.
   *
   * @example const created = await this.create({name : 'John'})
   */
  public async create(entry: Entry<T>): Promise<InsertResult<T>> {
    return await this.coreRepository.create(entry);
  }

  /**
   * Inserts multiple entries into the database.
   * @param entries An array of objects representing the entries to be created.
   * @returns  A promise that resolves to the insert result.
   * 
   * @example 
   * const createdInstance = await this.createMany([
      {
        name: 'Customer 1',
        description: 'Customer 1 description',
      },
      {
        name: 'Customer 2',
        description: 'Customer 2 description',
      },
    ])
   */
  public async createMany(...entries: Entries<T>[]): Promise<InsertResult<T>> {
    return await this.coreRepository.createMany(...entries);
  }

  /**
   * Retrieves all records from the database.
   * @returns A promise that resolves to an array of records.
   *
   * @example const results = await this.getAll();
   */
  public async getAll(): Promise<T[] | undefined> {
    return await this.coreRepository.getAll();
  }

  /**
   * Retrieves distinct records based on specific columns from the database.
   * @param columns An array of column names to retrieve distinct records for.
   * @returns A promise that resolves to an array of distinct records.
   *
   * @example
   * const results = await this.getDistinctColumns(['currency_code', 'ID', 'name']);
   * // or
   * // const results = await this.getDistinctColumns('currency_code', 'ID', 'name');
   */
  public async getDistinctColumns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<Array<Pick<T, ShowOnlyColumns<T, ColumnKeys>>> | undefined> {
    return await this.coreRepository.getDistinctColumns(...columns);
  }

  /**
   * Retrieves all records from the database with optional limit and offset.
   * @param options
   * @param options.limit The limit for the result set.
   * @param [options.skip] Optional 'skip', which will skip a specified number of items for the result set (default: 0).
   * @returns A promise that resolves to an array of records.
   *
   * @example const results = await this.getAllAndLimit({ limit: 10, skip: 5 });
   */
  public async getAllAndLimit(options: { limit: number; skip?: number | undefined }): Promise<T[] | undefined> {
    return await this.coreRepository.getAllAndLimit(options);
  }

  /**
   * Retrieves and updates localized texts for records based on the provided columns.
   * @param columns An array of column names to retrieve localized texts for.
   * @returns A promise that resolves to an array of records with localized texts.
   *
   * @example const results = await this.getLocaleTexts(['descr', 'ID']);
   */
  public async getLocaleTexts<Column extends keyof T>(
    columns: Column[],
  ): Promise<Array<Pick<T, Column> & Locale> | undefined> {
    return await this.coreRepository.getLocaleTexts(columns);
  }

  /**
   * Get all records from the database
   * @returns Promise<T | undefined>
   * @example const results = await this.find().execute()
   *
   * */
  public async find(): Promise<T[] | undefined>;

  /**
   * Finds records based on the provided keys.
   * @param keys An object representing the keys to filter the records.
   * @returns Promise<T | undefined>
   *
   * @example const results = await this.find({ name: 'Customer', description: 'description' });
   */
  public async find(keys: Entry<T>): Promise<T[] | undefined>;

  /**
   * Finds records based on the provided filters.
   * @param filter A Filter instance
   * @returns Promise<T | undefined>
   * @example
   * const filterLike = new Filter<Book>({
   *  field: 'name',
   *  operator: 'LIKE',
   *  value: 'Customer',
   * });
   *
   * const results = await this.find(filter)
   *
   * */
  public async find(filter: Filter<T>): Promise<T[] | undefined>;
  public async find(keys?: Entry<T> | Filter<T>): Promise<T[] | undefined> {
    return await this.coreRepository.find(keys);
  }

  /**
   * Finds a single record based on the provided keys.
   * @param keys An object representing the keys to filter the record.
   * @returns A promise that resolves to a single matching record.
   *
   * @example const result = await this.findOne({ name: 'Customer', description: 'description' });
   */
  public async findOne(keys: Entry<T>): Promise<T | undefined> {
    return await this.coreRepository.findOne(keys);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public builder() {
    return this.coreRepository.builder();
  }

  /**
   * Updates records based on the provided keys and fields to update.
   * @param keys An object representing the keys to filter the records.
   * @param fieldsToUpdate An object representing the fields and their updated values for the matching entries.
   * @returns A promise that resolves to `true` if the update is successful, `false` otherwise.
   * 
   * @example
   * const updated = await this.update(
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
      { name: 'a new name', description: 'a new description' },
    );
   */
  public async update(keys: Entry<T>, fieldsToUpdate: Entry<T>): Promise<boolean> {
    return await this.coreRepository.update(keys, fieldsToUpdate);
  }

  /**
   * Updates locale texts for records based on the provided keys and fields to update.
   * @param localeCodeKeys An object representing the language code to filter the entries.
   * @param fieldsToUpdate An object representing the fields and their updated values for the matching entries.
   * @returns A promise that resolves to `true` if the update is successful, `false` otherwise.
   *
   * @example
   * const updated = await this.updateLocaleTexts({ locale: 'de', ID: 201 }, { name: 'ein neuer Name' });
   */

  public async updateLocaleTexts(localeCodeKeys: Entry<T> & Locale, fieldsToUpdate: Entry<T>): Promise<boolean> {
    return await this.coreRepository.updateLocaleTexts(localeCodeKeys, fieldsToUpdate);
  }

  /**
   * Deletes records based on the provided keys.
   * @param keys An object representing the keys to filter the records.
   * @returns A promise that resolves to `true` if the deletion is successful, `false` otherwise.
   *
   * @example
   * const deleted1 = await this.delete({ name: 'Customer' });
   * const deleted2 = await this.delete({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' });
   */
  public async delete(keys: Entry<T>): Promise<boolean> {
    return await this.coreRepository.delete(keys);
  }

  /**
   * Deletes multiple records based on the provided keys.
   * @param entries An array of objects representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if all deletions are successful, `false` otherwise.
   * 
   * @example
   * const deleted = await this.deleteMany([
      { ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' },
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
    ]);
   */

  public async deleteMany(...entries: Entries<T>[]): Promise<boolean> {
    return await this.coreRepository.deleteMany(...entries);
  }

  /**
   * Checks if records based on the provided keys exist in the database.
   * @param keys An object representing the keys to filter the records.
   * @returns A promise that resolves to `true` if the item exists, `false` otherwise.
   *
   * @example const exists = await this.exists({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba09' });
   */
  public async exists(keys: Entry<T>): Promise<boolean> {
    return await this.coreRepository.exists(keys);
  }

  /**
   * Counts the total number of records in the database.
   * @returns A promise that resolves to the count of records.
   *
   * @example const count = await this.count();
   */
  public async count(): Promise<number> {
    return await this.coreRepository.count();
  }
}

export { BaseRepository };
