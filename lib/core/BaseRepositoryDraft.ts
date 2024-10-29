import { CoreRepository } from './CoreRepository';

import type {
  Columns,
  DraftEntries,
  Entity,
  EntryDraft,
  FindReturn,
  ShowOnlyColumns,
  ExtractSingular,
  BaseRepositoryConstructor,
} from '../types/types';
import type { Filter } from '../util/filter/Filter';
import util from '../util/util';

/**
 * Abstract class providing base repository functionalities for draft entity operations.
 * @template T The type of the entity.
 */
abstract class BaseRepositoryDraft<T> {
  protected coreRepository: CoreRepository<EntryDraft<ExtractSingular<T>>>;

  /**
   * Creates an instance of BaseRepositoryDraft.
   * @param entity The entity this repository manages.
   */
  constructor(protected entity: Entity & EntryDraft<ExtractSingular<T>>) {
    const constructor = this.constructor as BaseRepositoryConstructor;

    if (constructor.externalService) {
      // casting is needed as findExternalServiceEntity returns Entity and we need Entity + DraftAdministrativeFields
      this.entity = util.findExternalServiceEntity(this.entity, constructor.externalService) as Entity &
        EntryDraft<ExtractSingular<T>>;
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
  public async getAllDrafts(): Promise<EntryDraft<ExtractSingular<T>>[] | undefined> {
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
  public async getDraftsDistinctColumns<ColumnKeys extends Columns<EntryDraft<ExtractSingular<T>>>>(
    ...columns: ColumnKeys[]
  ): Promise<
    Pick<EntryDraft<ExtractSingular<T>>, ShowOnlyColumns<EntryDraft<ExtractSingular<T>>, ColumnKeys>>[] | undefined
  > {
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
  public async paginateDrafts(options: {
    limit: number;
    skip?: number | undefined;
  }): Promise<EntryDraft<ExtractSingular<T>>[] | undefined> {
    return await this.coreRepository.paginate(options);
  }

  /**
   * Finds draft entries based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to an array of matching entries.
   * @example
   * const results = await this.findDrafts({ name: 'Customer', description: 'description' });
   */
  public async findDrafts(keys: EntryDraft<ExtractSingular<T>>): Promise<ExtractSingular<T>[] | undefined>;
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
  public async findDrafts(filter: Filter<ExtractSingular<T>>): Promise<ExtractSingular<T>[] | undefined>;
  public async findDrafts(
    keys: EntryDraft<ExtractSingular<T>> | Filter<ExtractSingular<T>>,
  ): Promise<EntryDraft<ExtractSingular<T>>[] | undefined> {
    return await this.coreRepository.find(keys);
  }

  /**
   * Finds a single draft entry based on the provided keys.
   * @param keys An object representing the keys to filter the record.
   * @returns A promise that resolves to a single matching record.
   * @example
   * const result = await this.findOneDraft({ name: 'Customer', description: 'description' });
   */
  public async findOneDraft(keys: EntryDraft<ExtractSingular<T>>): Promise<EntryDraft<ExtractSingular<T>> | undefined> {
    return await this.coreRepository.findOne(keys);
  }

  /**
   * Builds a query for draft entries using the repository's builder.
   * @returns An instance of FindReturn for building queries.
   */
  public builderDraft(): FindReturn<EntryDraft<ExtractSingular<T>>> {
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
  public async updateDraft(
    keys: EntryDraft<ExtractSingular<T>>,
    fieldsToUpdate: EntryDraft<ExtractSingular<T>>,
  ): Promise<boolean> {
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
  public async deleteDraft(keys: EntryDraft<ExtractSingular<T>>): Promise<boolean> {
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
  public async existsDraft(keys: EntryDraft<ExtractSingular<T>>): Promise<boolean> {
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
}

export { BaseRepositoryDraft };
