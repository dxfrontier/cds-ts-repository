// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Service } from '@sap/cds';

import { CoreRepository } from './CoreRepository';

import type { Columns, DraftEntries, Entity, EntryDraft, FindReturn, ShowOnlyColumns } from '../types/types';
import type { Filter } from '../util/filter/Filter';

abstract class BaseRepositoryDraft<T> {
  protected readonly coreRepository: CoreRepository<EntryDraft<T>>;

  constructor(protected readonly entity: Entity & EntryDraft<T>) {
    this.coreRepository = new CoreRepository(this.entity);
  }

  // Public routines

  /**
   * Retrieves all drafts entries from the table.
   * @returns A promise that resolves to an array of entries.
   *
   * @example const results = await this.getAllDrafts();
   */
  public async getAllDrafts(): Promise<Array<EntryDraft<T>> | undefined> {
    return await this.coreRepository.getAll();
  }

  /**
   * Retrieves all distinct draft entries based on specific columns from the table.
   * @param columns An array of column names to retrieve distinct entries for.
   * @returns A promise that resolves to an array of distinct entries.
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
   * Retrieves all draft entries from the table with optional limit and offset.
   * @deprecated Use this.paginateDrafts instead of this getAllDraftsAndLimit
   * @param options
   * @param options.limit The limit for the result set.
   * @param [options.skip] Optional 'skip', which will skip a specified number of items for the result set (default: 0).
   * @returns A promise that resolves to an array of entries.
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
   * Retrieves all draft entries from the table with optional limit and offset.
   * @param options
   * @param options.limit The limit for the result set.
   * @param [options.skip] Optional 'skip', which will skip a specified number of items for the result set (default: 0).
   * @returns A promise that resolves to an array of entries.
   *
   * @example const results = await this.getAllDraftsAndLimit({ limit: 10, skip: 5 });
   */
  public async paginateDrafts(options: {
    limit: number;
    skip?: number | undefined;
  }): Promise<Array<EntryDraft<T>> | undefined> {
    return await this.coreRepository.getAllAndLimit(options);
  }

  /**
   * Finds draft entries based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to an array of matching entries.
   *
   * @example const results = await this.findDrafts({ name: 'Customer', description: 'description' });
   */
  public async findDrafts(keys: EntryDraft<T>): Promise<T[] | undefined>;
  /**
   * Finds entries based on the provided filters.
   * @param filter A Filter instance
   * @returns FindBuilder
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
   * Finds a single draft entry based on the provided keys.
   * @param keys An object representing the keys to filter the record.
   * @returns A promise that resolves to a single matching record.
   *
   * @example const result = await this.findOneDraft({ name: 'Customer', description: 'description' });
   */
  public async findOneDraft(keys: EntryDraft<T>): Promise<EntryDraft<T> | undefined> {
    return await this.coreRepository.findOne(keys);
  }

  public builderDraft(): FindReturn<EntryDraft<T>> {
    return this.coreRepository.builder();
  }

  /**
   * Updates draft entry based on the provided keys and update fields.
   * @param keys An object representing the keys to filter the entries.
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
   * Deletes draft entry based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
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
   * Deletes all draft entries from the table but preserving the table structure.
   * @returns A promise that resolves to `true` if all deletions are successful, `false` otherwise.
   *
   * @example
   * const deleted = await this.deleteAllDrafts();
   */
  public async deleteAllDrafts(): Promise<boolean> {
    return await this.coreRepository.deleteAll();
  }

  /**
   * Checks if draft instance based on the provided keys exist in the table.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if the item exists, `false` otherwise.
   *
   * @example const exists = await this.existsDraft({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba09' });
   *
   */
  public async existsDraft(keys: EntryDraft<T>): Promise<boolean> {
    return await this.coreRepository.exists(keys);
  }

  /**
   * Counts the total number of drafts in the table.
   * @returns A promise that resolves to the count of entries.
   *
   * @example const count = await this.count();
   */
  public async countDrafts(): Promise<number> {
    return await this.coreRepository.count();
  }
}

export { BaseRepositoryDraft };
