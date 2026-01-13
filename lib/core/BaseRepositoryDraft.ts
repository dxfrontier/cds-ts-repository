import { CoreRepository } from './CoreRepository';

import type {
  Columns,
  DraftEntries,
  Entity,
  FindReturn,
  ShowOnlyColumns,
  ExtractSingular,
  BaseRepositoryConstructor,
  Draft,
  NumericKeys,
  IncrementFields,
} from '../types/types';
import type { Filter } from '../util/filter/Filter';
import util from '../util/util';

/**
 * Abstract class providing base repository functionalities for draft entity operations.
 * @template T The type of the entity.
 */
abstract class BaseRepositoryDraft<T> {
  protected coreRepository: CoreRepository<Draft<T>>;

  /**
   * Creates an instance of BaseRepositoryDraft.
   * @param entity The entity this repository manages.
   */
  constructor(protected entity: Entity & Draft<T>) {
    const constructor = this.constructor as BaseRepositoryConstructor;

    if (constructor.externalService) {
      // casting is needed as findExternalServiceEntity returns Entity and we need Entity + DraftAdministrativeFields
      this.entity = util.findExternalServiceEntity(this.entity, constructor.externalService) as Entity & Draft<T>;
      this.coreRepository = new CoreRepository(this.entity, constructor.externalService);

      return;
    }

    this.coreRepository = new CoreRepository(this.entity);
  }

  // Public routines

  /**
   * Retrieves all draft entries from the table.
   * @returns A promise that resolves to an array of entries.
   * @example
   * const results = await this.getAllDrafts();
   */
  public async getAllDrafts(): Promise<Draft<T>[] | undefined> {
    return await this.coreRepository.getAll();
  }

  /**
   * Retrieves all distinct draft entries based on specific columns from the table.
   * @param columns An array of column names to retrieve distinct entries for.
   * @returns A promise that resolves to an array of distinct entries.
   * @example
   * const results = await this.getDraftsDistinctColumns(['currency_code', 'ID', 'name']);
   * // or
   * // const results = await this.getDraftsDistinctColumns('currency_code', 'ID', 'name');
   */
  public async getDraftsDistinctColumns<ColumnKeys extends Columns<Draft<T>>>(
    ...columns: ColumnKeys[]
  ): Promise<Pick<Draft<T>, ShowOnlyColumns<Draft<T>, ColumnKeys>>[] | undefined> {
    return await this.coreRepository.getDistinctColumns(...columns);
  }

  /**
   * Retrieves all draft entries from the table with optional limit and offset.
   * @param options.limit The limit for the result set.
   * @param [options.skip] Optional 'skip', which will skip a specified number of items for the result set (default: 0).
   * @returns A promise that resolves to an array of entries.
   * @example
   * const results = await this.paginateDrafts({ limit: 10, skip: 5 });
   */
  public async paginateDrafts(options: { limit: number; skip?: number | undefined }): Promise<Draft<T>[] | undefined> {
    return await this.coreRepository.paginate(options);
  }

  /**
   * Finds draft entries based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to an array of matching entries.
   * @example
   * const results = await this.findDrafts({ name: 'Customer', description: 'description' });
   */
  public async findDrafts(keys: Draft<T>): Promise<Draft<T>[] | undefined>;
  /**
   * Finds entries based on the provided filters.
   * @param filter A Filter instance.
   * @returns A promise that resolves to an array of matching entries.
   * @example
   * const filterLike = new Filter<Book>({
   *  field: 'name',
   *  operator: 'LIKE',
   *  value: 'Customer',
   * });
   * const results = await this.findDrafts(filter);
   */
  public async findDrafts(filter: Filter<Draft<T>>): Promise<Draft<T>[] | undefined>;
  public async findDrafts(keys: Draft<T> | Filter<Draft<T>>): Promise<Draft<T>[] | undefined> {
    return await this.coreRepository.find(keys);
  }

  /**
   * Finds a single draft entity by the specified keys and updates it with the provided fields.
   *
   * @param keys - The keys to identify the draft entity to find and update.
   * @param fieldsToUpdate - The fields and their new values to update on the found draft entity.
   * @returns Promise that resolves to true if the update was successful, false otherwise.
   *
   * @example
   * ```typescript
   * // Update a draft with administrative fields
   * const wasUpdated = await this.findOneDraftAndUpdate(
   *   { ID: '123', IsActiveEntity: false },
   *   { name: 'New Name', status: 'active' }
   * );
   * ```
   */
  public async findOneDraftAndUpdate(keys: Draft<T>, fieldsToUpdate: Draft<T>): Promise<boolean> {
    return await this.coreRepository.findOneAndUpdate(keys, fieldsToUpdate);
  }

  /**
   * Finds a single draft entry based on the provided keys.
   * @param keys An object representing the keys to filter the record.
   * @returns A promise that resolves to a single matching record.
   * @example
   * const result = await this.findOneDraft({ name: 'Customer', description: 'description' });
   */
  public async findOneDraft(keys: Draft<T>): Promise<Draft<T> | undefined> {
    return await this.coreRepository.findOne(keys);
  }

  /**
   * Builds a query for draft entries using the repository's builder.
   * @returns An instance of FindReturn for building queries.
   */
  public builderDraft(): FindReturn<Draft<T>> {
    return this.coreRepository.builder();
  }

  /**
   * Updates a draft entry based on the provided keys and update fields.
   * @param keys An object representing the keys to filter the entries.
   * @param fieldsToUpdate An object representing the fields and their updated values for the matching entries.
   * @returns A promise that resolves to `true` if the update is successful, `false` otherwise.
   * @example
   * const updated = await this.updateDraft(
   *   { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
   *   { name: 'a new name', description: 'a new description' },
   * );
   */
  public async updateDraft(keys: Draft<T>, fieldsToUpdate: Draft<T>): Promise<boolean> {
    return await this.coreRepository.update(keys, fieldsToUpdate);
  }

  /**
   * Deletes a draft entry based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if the deletion is successful, `false` otherwise.
   * @example
   * const deleted1 = await this.deleteDraft({ name: 'Customer' });
   * const deleted2 = await this.deleteDraft({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' });
   */
  public async deleteDraft(keys: Draft<T>): Promise<boolean> {
    return await this.coreRepository.delete(keys);
  }

  /**
   * Deletes multiple drafts based on the provided keys.
   * @param entries An array of objects representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if all deletions are successful, `false` otherwise.
   * @example
   * const deleted = await this.deleteManyDrafts([
   *   { ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' },
   *   { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
   * ]);
   */
  public async deleteManyDrafts(entries: DraftEntries<ExtractSingular<T>>[]): Promise<boolean> {
    return await this.coreRepository.deleteMany(...entries);
  }

  /**
   * Deletes all draft entries from the table but preserves the table structure.
   * @returns A promise that resolves to `true` if all deletions are successful, `false` otherwise.
   * @example
   * const deleted = await this.deleteAllDrafts();
   */
  public async deleteAllDrafts(): Promise<boolean> {
    return await this.coreRepository.deleteAll();
  }

  /**
   * Checks if a draft entry based on the provided keys exists in the table.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if the item exists, `false` otherwise.
   * @example const exists = await this.existsDraft({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba09' });
   */
  public async existsDraft(keys: Draft<T>): Promise<boolean> {
    return await this.coreRepository.exists(keys);
  }

  /**
   * Counts the total number of draft entries in the table.
   * @returns A promise that resolves to the count of entries.
   * @example const count = await this.countDrafts();
   */
  public async countDrafts(): Promise<number> {
    return await this.coreRepository.count();
  }

  /**
   * Finds the first draft entry in the table ordered by the specified column in ascending order.
   * @param column The column to order by.
   * @returns A promise that resolves to the first draft entry or undefined if not found.
   * @example
   * const firstDraft = await this.findFirstDraft('createdAt');
   */
  public async findFirstDraft<ColumnKeys extends keyof Draft<T>>(column: ColumnKeys): Promise<Draft<T> | undefined> {
    return await this.coreRepository.findFirst(column);
  }

  /**
   * Finds the last draft entry in the table ordered by the specified column in descending order.
   * @param column The column to order by.
   * @returns A promise that resolves to the last draft entry or undefined if not found.
   * @example
   * const lastDraft = await this.findLastDraft('createdAt');
   */
  public async findLastDraft<ColumnKeys extends keyof Draft<T>>(column: ColumnKeys): Promise<Draft<T> | undefined> {
    return await this.coreRepository.findLast(column);
  }

  /**
   * Finds a draft entry based on the provided keys, or creates a new draft entry if not found.
   * @param keys An object representing the keys to find the draft entry.
   * @param defaults An object representing the default values for the new draft entry if not found.
   * @returns A promise that resolves to an object containing the draft entry and a boolean indicating if it was created.
   * @example
   * const { entry, created } = await this.findOrCreateDraft(
   *   { name: 'John', IsActiveEntity: false },
   *   { description: 'A new customer' }
   * );
   */
  public async findOrCreateDraft(keys: Draft<T>, defaults: Draft<T>): Promise<{ created: boolean; entry: Draft<T> }> {
    return await this.coreRepository.findOrCreate(keys, defaults);
  }

  /**
   * Counts draft entries based on the provided keys.
   * @param keys An object representing the keys to filter the draft entries.
   * @returns A promise that resolves to the count of matching draft entries.
   * @example
   * const count = await this.countDraftsWhere({ IsActiveEntity: false });
   */
  public async countDraftsWhere(keys: Draft<T>): Promise<number>;

  /**
   * Counts draft entries based on the provided filter.
   * @param filter A Filter instance.
   * @returns A promise that resolves to the count of matching draft entries.
   * @example
   * const filter = new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 10 });
   * const count = await this.countDraftsWhere(filter);
   */
  public async countDraftsWhere(filter: Filter<Draft<T>>): Promise<number>;

  public async countDraftsWhere(keys?: Draft<T> | Filter<Draft<T>>): Promise<number> {
    return await this.coreRepository.countWhere(keys);
  }

  /**
   * Updates multiple draft entries based on the provided keys.
   * @param keys An object representing the keys to filter the draft entries.
   * @param fieldsToUpdate An object representing the fields and their updated values.
   * @returns A promise that resolves to the number of updated draft entries.
   * @example
   * const updatedCount = await this.updateManyDrafts({ IsActiveEntity: false }, { status: 'active' });
   */
  public async updateManyDrafts(keys: Draft<T>, fieldsToUpdate: Draft<T>): Promise<number>;

  /**
   * Updates multiple draft entries based on the provided filter.
   * @param filter A Filter instance.
   * @param fieldsToUpdate An object representing the fields and their updated values.
   * @returns A promise that resolves to the number of updated draft entries.
   * @example
   * const filter = new Filter<Book>({ field: 'stock', operator: 'LESS THAN', value: 5 });
   * const updatedCount = await this.updateManyDrafts(filter, { status: 'low_stock' });
   */
  public async updateManyDrafts(filter: Filter<Draft<T>>, fieldsToUpdate: Draft<T>): Promise<number>;

  public async updateManyDrafts(keys: Draft<T> | Filter<Draft<T>>, fieldsToUpdate: Draft<T>): Promise<number> {
    return await this.coreRepository.updateMany(keys, fieldsToUpdate);
  }

  /**
   * Deletes draft entries based on the provided keys.
   * @param keys An object representing the keys to filter the draft entries.
   * @returns A promise that resolves to the number of deleted draft entries.
   * @example
   * const deletedCount = await this.deleteDraftsWhere({ IsActiveEntity: false });
   */
  public async deleteDraftsWhere(keys: Draft<T>): Promise<number>;

  /**
   * Deletes draft entries based on the provided filter.
   * @param filter A Filter instance.
   * @returns A promise that resolves to the number of deleted draft entries.
   * @example
   * const filter = new Filter<Book>({ field: 'stock', operator: 'EQUALS', value: 0 });
   * const deletedCount = await this.deleteDraftsWhere(filter);
   */
  public async deleteDraftsWhere(filter: Filter<Draft<T>>): Promise<number>;

  public async deleteDraftsWhere(keys?: Draft<T> | Filter<Draft<T>>): Promise<number> {
    return await this.coreRepository.deleteWhere(keys);
  }

  // ********************************************************************************************
  // INCREMENT / DECREMENT METHODS
  // ********************************************************************************************

  /**
   * Increments a numeric field by the specified value for a draft entity.
   * @param keys - The keys to identify the draft entity to update.
   * @param column - The numeric column to increment.
   * @param value - The value to increment by (default: 1).
   * @returns A promise that resolves to `true` if the increment is successful, `false` otherwise.
   * @example
   * // Increment viewCount by 1 for a draft
   * const success = await this.incrementDraft({ ID: '123', IsActiveEntity: false }, 'viewCount', 1);
   */
  public async incrementDraft(keys: Draft<T>, column: NumericKeys<Draft<T>>, value = 1): Promise<boolean> {
    return await this.coreRepository.increment(keys, column, value);
  }

  /**
   * Decrements a numeric field by the specified value for a draft entity.
   * @param keys - The keys to identify the draft entity to update.
   * @param column - The numeric column to decrement.
   * @param value - The value to decrement by (default: 1).
   * @returns A promise that resolves to `true` if the decrement is successful, `false` otherwise.
   * @example
   * // Decrement stock by 5 for a draft
   * const success = await this.decrementDraft({ ID: '123', IsActiveEntity: false }, 'stock', 5);
   */
  public async decrementDraft(keys: Draft<T>, column: NumericKeys<Draft<T>>, value = 1): Promise<boolean> {
    return await this.coreRepository.decrement(keys, column, value);
  }

  /**
   * Increments multiple numeric fields by their specified values for all matching draft entries.
   * @param keys - The keys to identify the draft entities to update.
   * @param fields - An object with numeric field names as keys and increment values as values.
   * @returns A promise that resolves to the number of updated draft entries.
   * @example
   * // Increment viewCount by 1 and priority by 2 for all drafts with specific status
   * const updatedCount = await this.incrementManyDrafts({ status: 'active', IsActiveEntity: false }, { viewCount: 1, priority: 2 });
   */
  public async incrementManyDrafts(keys: Draft<T>, fields: IncrementFields<Draft<T>>): Promise<number>;

  /**
   * Increments multiple numeric fields by their specified values for all matching draft entries.
   * @param filter - A Filter instance.
   * @param fields - An object with numeric field names as keys and increment values as values.
   * @returns A promise that resolves to the number of updated draft entries.
   * @example
   * const filter = new Filter<Book>({ field: 'stock', operator: 'GREATER_THAN', value: 0 });
   * const updatedCount = await this.incrementManyDrafts(filter, { viewCount: 1 });
   */
  public async incrementManyDrafts(filter: Filter<Draft<T>>, fields: IncrementFields<Draft<T>>): Promise<number>;

  public async incrementManyDrafts(
    keys: Draft<T> | Filter<Draft<T>>,
    fields: IncrementFields<Draft<T>>,
  ): Promise<number> {
    return await this.coreRepository.incrementMany(keys, fields);
  }

  /**
   * Decrements multiple numeric fields by their specified values for all matching draft entries.
   * @param keys - The keys to identify the draft entities to update.
   * @param fields - An object with numeric field names as keys and decrement values as values.
   * @returns A promise that resolves to the number of updated draft entries.
   * @example
   * // Decrement stock by 1 for all draft items with status 'sold'
   * const updatedCount = await this.decrementManyDrafts({ status: 'sold', IsActiveEntity: false }, { stock: 1 });
   */
  public async decrementManyDrafts(keys: Draft<T>, fields: IncrementFields<Draft<T>>): Promise<number>;

  /**
   * Decrements multiple numeric fields by their specified values for all matching draft entries.
   * @param filter - A Filter instance.
   * @param fields - An object with numeric field names as keys and decrement values as values.
   * @returns A promise that resolves to the number of updated draft entries.
   * @example
   * const filter = new Filter<Book>({ field: 'status', operator: 'EQUALS', value: 'sold' });
   * const updatedCount = await this.decrementManyDrafts(filter, { stock: 1 });
   */
  public async decrementManyDrafts(filter: Filter<Draft<T>>, fields: IncrementFields<Draft<T>>): Promise<number>;

  public async decrementManyDrafts(
    keys: Draft<T> | Filter<Draft<T>>,
    fields: IncrementFields<Draft<T>>,
  ): Promise<number> {
    return await this.coreRepository.decrementMany(keys, fields);
  }
}

export { BaseRepositoryDraft };
