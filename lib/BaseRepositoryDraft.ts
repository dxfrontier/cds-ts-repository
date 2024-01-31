// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

import type { Columns, DraftEntries, EntryDraft, ShowOnlyColumns } from './types/types';
import type Filter from './util/Filter';

import { CoreRepository } from './util/CoreRepository';
import { type Constructable } from '@sap/cds/apis/internal/inference';

abstract class BaseRepositoryDraft<T> {
  protected readonly coreRepository: CoreRepository<EntryDraft<T>>;

  constructor(protected readonly entity: Constructable<T>) {
    this.coreRepository = new CoreRepository(`${this.entity.name}.drafts`);
  }

  // Public routines

  /**
   * Retrieves all drafts records from the database.
   * @returns A promise that resolves to an array of records.
   *
   * @example const results = await this.getAllDrafts();
   */
  public async getAllDrafts(): Promise<Array<EntryDraft<T>> | undefined> {
    return await this.coreRepository.getAll();
  }

  /**
   * Retrieves distinct records based on specific columns from the database.
   * @param columns An array of column names to retrieve distinct records for.
   * @returns A promise that resolves to an array of distinct records.
   *
   * @example const results = await this.getDraftsDistinctColumns(['currency_code', 'ID', 'name']);
   * // or
   * // const results = await this.getDraftsDistinctColumns('currency_code', 'ID', 'name');
   */
  public async getDraftsDistinctColumns<ColumnKeys extends Columns<EntryDraft<T>>>(
    ...columns: ColumnKeys[]
  ): Promise<Array<Pick<EntryDraft<T>, ShowOnlyColumns<EntryDraft<T>, ColumnKeys>>> | undefined> {
    return await this.coreRepository.getDistinctColumns(...columns);
  }

  /**
   * Retrieves all records from the database with optional limit and offset.
   * @param options
   * @param options.limit The limit for the result set.
   * @param [options.skip] Optional 'skip', which will skip a specified number of items for the result set (default: 0).
   * @returns A promise that resolves to an array of records.
   *
   * @example const results = await this.getAllDraftsAndLimit({ limit: 10, skip: 5 });
   */
  public async getAllDraftsAndLimit(options: {
    limit: number;
    skip?: number | undefined;
  }): Promise<Array<EntryDraft<T>> | undefined> {
    return await this.coreRepository.getAllAndLimit(options);
  }

  /**
   * Finds drafts based on the provided keys.
   * @param keys An object representing the keys to filter the records.
   * @returns A promise that resolves to an array of matching records.
   *
   * @example const results = await this.findDrafts({ name: 'Customer', description: 'description' });
   */
  public async findDrafts(keys: EntryDraft<T>): Promise<T[] | undefined>;
  /**
   * Finds records based on the provided filters.
   * @param filter A Filter instance
   * @returns SelectBuilder
   * @example
   * const filterLike = new Filter<Book>({
   *  field: 'name',
   *  operator: 'LIKE',
   *  value: 'Customer',
   * });
   *
   * const results = await this.findDrafts(filter)
   *
   * */
  public async findDrafts(filter: Filter<T>): Promise<T[] | undefined>;
  public async findDrafts(keys: EntryDraft<T> | Filter<T>): Promise<Array<EntryDraft<T>> | undefined> {
    return await this.coreRepository.find(keys);
  }

  /**
   * Finds a single draft based on the provided keys.
   * @param keys An object representing the keys to filter the record.
   * @returns A promise that resolves to a single matching record.
   *
   * @example const result = await this.findOneDraft({ name: 'Customer', description: 'description' });
   */
  public async findOneDraft(keys: EntryDraft<T>): Promise<EntryDraft<T> | undefined> {
    return await this.coreRepository.findOne(keys);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public builderDraft() {
    return this.coreRepository.builder();
  }

  /**
   * Updates drafts based on the provided keys and fields to update.
   * @param keys An object representing the keys to filter the records.
   * @param fieldsToUpdate An object representing the fields and their updated values for the matching entries.
   * @returns A promise that resolves to `true` if the update is successful, `false` otherwise.
   * 
   * @example 
   * const updated = await this.updateDraft(
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
      { name: 'a new name', description: 'a new description' },
    );
   */
  public async updateDraft(keys: EntryDraft<T>, fieldsToUpdate: EntryDraft<T>): Promise<boolean> {
    return await this.coreRepository.update(keys, fieldsToUpdate);
  }

  /**
   * Deletes records based on the provided keys.
   * @param keys An object representing the keys to filter the records.
   * @returns A promise that resolves to `true` if the deletion is successful, `false` otherwise.
   *
   * @example
   * const deleted1 = await this.deleteDraft({ name: 'Customer' });
   * const deleted2 = await this.deleteDraft({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' });
   */
  public async deleteDraft(keys: EntryDraft<T>): Promise<boolean> {
    return await this.coreRepository.delete(keys);
  }

  /**
   * Deletes multiple drafts based on the provided keys.
   * @param entries An array of objects representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if all deletions are successful, `false` otherwise.
   * 
   * @example
   * const deleted = await this.deleteManyDrafts([
      { ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' },
      { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
    ]);
   */

  public async deleteManyDrafts(entries: DraftEntries<T>[]): Promise<boolean> {
    return await this.coreRepository.deleteMany(...entries);
  }

  /**
   * Checks if draft instance based on the provided keys exist in the database.
   * @param keys An object representing the keys to filter the records.
   * @returns A promise that resolves to `true` if the item exists, `false` otherwise.
   *
   * @example const exists = await this.existsDraft({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba09' });
   *
   */
  public async existsDraft(keys: EntryDraft<T>): Promise<boolean> {
    return await this.coreRepository.exists(keys);
  }

  /**
   * Counts the total number of drafts in the database.
   * @returns A promise that resolves to the count of records.
   *
   * @example const count = await this.count();
   */
  public async countDrafts(): Promise<number> {
    return await this.coreRepository.count();
  }
}

export { BaseRepositoryDraft };
