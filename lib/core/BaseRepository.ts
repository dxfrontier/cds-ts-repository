import { CoreRepository } from './CoreRepository';
import type {
  Columns,
  Entries,
  Entry,
  Locale,
  ShowOnlyColumns,
  FindReturn,
  Entity,
  ExtractSingular,
  BaseRepositoryConstructor,
  InsertResult,
} from '../types/types';
import type { Filter } from '../util/filter/Filter';
import util from '../util/util';

/**
 * Abstract class providing base repository functionalities for entity operations.
 * @template T The type of the entity.
 */
abstract class BaseRepository<T> {
  protected readonly coreRepository: CoreRepository<ExtractSingular<T>>;

  /**
   * Creates an instance of BaseRepository.
   * @param entity The entity this repository manages.
   */
  constructor(protected readonly entity: Entity) {
    const constructor = this.constructor as BaseRepositoryConstructor;

    if (constructor.externalService) {
      this.entity = util.findExternalServiceEntity(this.entity, constructor.externalService);
      this.coreRepository = new CoreRepository(this.entity, constructor.externalService);

      return;
    }

    this.coreRepository = new CoreRepository(this.entity);
  }

  /**
   * Inserts a single entry into the table.
   * @param entry An object representing the entry to be created.
   * @returns A promise that resolves to the inserted result.
   * @example
   * const created = await this.create({name : 'John'})
   */
  public async create(entry: Entry<ExtractSingular<T>>): Promise<InsertResult<T>> {
    return await this.coreRepository.create(entry);
  }

  /**
   * Inserts multiple entries into the table.
   * @param entries An array of objects representing the entries to be created.
   * @returns A promise that resolves to the insert result.
   * @example
   * const createdInstance = await this.createMany([
   *  { name: 'Customer 1', description: 'Customer 1 description' },
   *  { name: 'Customer 2', description: 'Customer 2 description' },
   * ]);
   */
  public async createMany(...entries: Entries<ExtractSingular<T>>[]): Promise<InsertResult<T>> {
    return await this.coreRepository.createMany(...entries);
  }

  /**
   * Retrieves all entries from the table.
   * @returns A promise that resolves to an array of entries.
   * @example
   * const results = await this.getAll();
   */
  public async getAll(): Promise<ExtractSingular<T>[] | undefined> {
    return await this.coreRepository.getAll();
  }

  /**
   * Retrieves all distinct entries based on specific columns from the table.
   * @param columns An array of column names to retrieve distinct entries for.
   * @returns A promise that resolves to an array of distinct entries.
   * @example
   * const results = await this.getDistinctColumns(['currency_code', 'ID', 'name']);
   */
  public async getDistinctColumns<ColumnKeys extends Columns<ExtractSingular<T>>>(
    ...columns: ColumnKeys[]
  ): Promise<Pick<ExtractSingular<T>, ShowOnlyColumns<ExtractSingular<T>, ColumnKeys>>[] | undefined> {
    return await this.coreRepository.getDistinctColumns(...columns);
  }

  /**
   * Retrieves all entries from the table with optional limit and offset.
   * @param options.limit The limit for the result set.
   * @param [options.skip] Optional 'skip', which will skip a specified number of items for the result set (default: 0).
   * @returns A promise that resolves to an array of entries.
   * @example
   * const results = await this.paginate({ limit: 10, skip: 5 });
   */
  public async paginate(options: {
    limit: number;
    skip?: number | undefined;
  }): Promise<ExtractSingular<T>[] | undefined> {
    return await this.coreRepository.paginate(options);
  }

  /**
   * Retrieves localized texts for the entries in the table.
   * @param columns An array of column names to retrieve localized texts for.
   * @returns A promise that resolves to an array of entries with localized texts.
   * @example
   * const results = await this.getLocaleTexts(['descr', 'ID']);
   */
  public async getLocaleTexts<ColumnKeys extends Columns<ExtractSingular<T>>>(...columns: ColumnKeys[]) {
    return await this.coreRepository.getLocaleTexts(...columns);
  }

  /**
   * Retrieves entries from the table.
   * @returns A promise that resolves to an array of entries.
   * @example
   * const results = await this.find();
   */
  public async find(): Promise<ExtractSingular<T>[] | undefined>;

  /**
   * Finds entries based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to an array of entries.
   * @example
   * const results = await this.find({ name: 'Customer', description: 'description' });
   */
  public async find(keys: Entry<ExtractSingular<T>>): Promise<ExtractSingular<T>[] | undefined>;

  /**
   * Finds entries based on the provided filters.
   * @param filter A Filter instance.
   * @returns A promise that resolves to an array of entries.
   * @example
   * const filterLike = new Filter<Book>({
   *  field: 'name',
   *  operator: 'LIKE',
   *  value: 'Customer',
   * });
   * const results = await this.find(filter);
   */
  public async find(filter: Filter<ExtractSingular<T>>): Promise<ExtractSingular<T>[] | undefined>;

  public async find(
    keys?: Entry<ExtractSingular<T>> | Filter<ExtractSingular<T>>,
  ): Promise<ExtractSingular<T>[] | undefined> {
    return await this.coreRepository.find(keys);
  }

  /**
   * Finds a single record based on the provided keys.
   * @param keys An object representing the keys to filter the record.
   * @returns A promise that resolves to a single matching record.
   * @example
   * const result = await this.findOne({ name: 'Customer', description: 'description' });
   */
  public async findOne(keys: Entry<ExtractSingular<T>>): Promise<ExtractSingular<T> | undefined> {
    return await this.coreRepository.findOne(keys);
  }

  /**
   * Finds a single entity by keys and updates it with the provided fields.
   *
   * @param keys - The keys to find the entity.
   * @param fieldsToUpdate - The fields to update on the found entity.
   * @returns Promise that resolves to true if the update was successful, false otherwise.
   *
   * @example
   * ```typescript
   * const wasUpdated = await this.findOneAndUpdate(
   *   { id: '123' },
   *   { name: 'New Name', status: 'active' }
   * );
   *
   * if (wasUpdated) {
   *   console.log('Update operation successful');
   * } else {
   *   console.log('Update operation failed');
   * }
   * ```
   */
  public async findOneAndUpdate(
    keys: Entry<ExtractSingular<T>>,
    fieldsToUpdate: Entry<ExtractSingular<T>>,
  ): Promise<boolean> {
    return await this.coreRepository.findOneAndUpdate(keys, fieldsToUpdate);
  }

  /**
   * Builds a query using the repository's builder.
   * @returns An instance of FindReturn for building queries.
   */
  public builder(): FindReturn<ExtractSingular<T>> {
    return this.coreRepository.builder();
  }

  /**
   * Updates entries based on the provided keys and update fields.
   * @param keys An object representing the keys to filter the entries.
   * @param fieldsToUpdate An object representing the fields and their updated values for the matching entries.
   * @returns A promise that resolves to `true` if the update is successful, `false` otherwise.
   * @example
   * const updated = await this.update(
   *  { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
   *  { name: 'a new name', description: 'a new description' },
   * );
   */
  public async update(keys: Entry<ExtractSingular<T>>, fieldsToUpdate: Entry<ExtractSingular<T>>): Promise<boolean> {
    return await this.coreRepository.update(keys, fieldsToUpdate);
  }

  /**
   * Updates existing entries or creates new ones if they do not exist.
   * @param entries An array of objects representing the entries to be created.
   * @returns A promise that resolves to `true` if the update is successful, `false` otherwise.
   */
  public async updateOrCreate(...entries: Entries<ExtractSingular<T>>[]): Promise<boolean> {
    return await this.coreRepository.updateOrCreate(...entries);
  }

  /**
   * Updates locale texts for entries based on the provided keys and fields to update.
   * @param localeCodeKeys An object representing the language code to filter the entries.
   * @param fieldsToUpdate An object representing the fields and their updated values for the matching entries.
   * @returns A promise that resolves to `true` if the update is successful, `false` otherwise.
   * @example
   * const updated = await this.updateLocaleTexts({ locale: 'de', ID: 201 }, { name: 'ein neuer Name' });
   */
  public async updateLocaleTexts(
    localeCodeKeys: Entry<ExtractSingular<T>> & Locale,
    fieldsToUpdate: Entry<ExtractSingular<T>>,
  ): Promise<boolean> {
    return await this.coreRepository.updateLocaleTexts(localeCodeKeys, fieldsToUpdate);
  }

  /**
   * Deletes an entry based on the provided keys.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if the deletion is successful, `false` otherwise.
   * @example
   * const deleted1 = await this.delete({ name: 'Customer' });
   * const deleted2 = await this.delete({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' });
   */
  public async delete(keys: Entry<ExtractSingular<T>>): Promise<boolean> {
    return await this.coreRepository.delete(keys);
  }

  /**
   * Deletes multiple entries based on the provided keys.
   * @param entries An array of objects representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if all deletions are successful, `false` otherwise.
   * @example
   * const deleted = await this.deleteMany([
   *  { ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba19' },
   *  { ID: 'a51ab5c8-f366-460f-8f28-0eda2e41d6db' },
   * ]);
   */
  public async deleteMany(...entries: Entries<ExtractSingular<T>>[]): Promise<boolean> {
    return await this.coreRepository.deleteMany(...entries);
  }

  /**
   * Deletes all entries from the table but preserves the table structure.
   * @returns A promise that resolves to `true` if all deletions are successful, `false` otherwise.
   * @example
   * const deleted = await this.deleteAll();
   */
  public async deleteAll(): Promise<boolean> {
    return await this.coreRepository.deleteAll();
  }

  /**
   * Checks if the entry based on the provided keys exists in the table.
   * @param keys An object representing the keys to filter the entries.
   * @returns A promise that resolves to `true` if the item exists, `false` otherwise.
   * @example
   * const exists = await this.exists({ ID: '2f12d711-b09e-4b57-b035-2cbd0a02ba09' });
   */
  public async exists(keys: Entry<ExtractSingular<T>>): Promise<boolean> {
    return await this.coreRepository.exists(keys);
  }

  /**
   * Counts the total number of entries in the table.
   * @returns A promise that resolves to the count of entries.
   * @example
   * const count = await this.count();
   */
  public async count(): Promise<number> {
    return await this.coreRepository.count();
  }
}

export { BaseRepository };
