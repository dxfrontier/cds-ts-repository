// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Service } from '@sap/cds';

import FindBuilder from '../util/find/FindBuilder';
import FindOneBuilder from '../util/find/FindOneBuilder';
import util from '../util/util';

import type {
  Entry,
  Locale,
  FindReturn,
  Entries,
  Columns,
  ShowOnlyColumns,
  Entity,
  ExternalServiceProps,
  // CreateReturnType,
  ExtractSingular,
  InsertResult,
} from '../types/types';
import type { Filter } from '..';

/**
 * Core repository class providing CRUD operations for entities.
 * @template T The type of the entity.
 */
class CoreRepository<T> {
  private readonly resolvedEntity: string;

  /**
   * Creates an instance of CoreRepository.
   * @param entity The entity this repository manages.
   */
  constructor(
    protected readonly entity: Entity,
    protected readonly externalService?: ExternalServiceProps,
  ) {
    this.resolvedEntity = util.resolveEntityName(entity);
  }

  // Public routines
  public async create(entry: Entry<T>): Promise<InsertResult<T>> {
    const query = INSERT.into(this.resolvedEntity).entries(entry);

    if (this.externalService) {
      const executedQuery: T = await this.externalService.run(query);

      return {
        query: { INSERT: { entries: [executedQuery] } },
      };
    }

    return await query;
  }

  public async createMany(...entries: Entries<T>[]): Promise<InsertResult<T>> {
    if (this.externalService) {
      const inserted: T[] = [];

      for (const entry of entries) {
        const query = INSERT.into(this.resolvedEntity).entries(entry);
        const result = await this.externalService.run(query);

        inserted.push(result);
      }

      return {
        query: {
          INSERT: {
            entries: inserted,
          },
        },
      };
    }

    const query: InsertResult<T> = await INSERT.into(this.resolvedEntity).entries(...entries);
    return query;
  }

  public async getAll(): Promise<T[] | undefined> {
    const query = SELECT.from(this.resolvedEntity);

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public async getDistinctColumns<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<Pick<T, ShowOnlyColumns<T, ColumnKeys>>[] | undefined> {
    const allColumns = Array.isArray(columns[0]) ? columns[0] : columns;

    if (this.externalService) {
      const query = SELECT.from(this.resolvedEntity)
        .columns(...allColumns)
        .groupBy(...allColumns);

      return await this.externalService.run(query);
    }

    const query = SELECT.distinct.from(this.resolvedEntity).columns(...allColumns);
    return await query;
  }

  public async paginate(options: { limit: number; skip?: number | undefined }): Promise<T[] | undefined> {
    const query = SELECT.from(this.resolvedEntity).limit(options.limit);

    if (options.skip !== undefined) {
      query.limit(options.limit, options.skip);
    }

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public async getLocaleTexts<ColumnKeys extends Columns<T>>(
    ...columns: ColumnKeys[]
  ): Promise<(Pick<T, ExtractSingular<ColumnKeys>> & Locale)[] | undefined> {
    const items = Array.isArray(columns[0]) ? columns[0] : columns;
    const query = SELECT.from(`${this.entity.name}.texts`).columns(...items, 'locale');

    if (this.externalService) {
      throw new Error('Currently not supported on External services !');
    }

    return await query;
  }

  public async find(keys?: Entry<T> | Filter<T>): Promise<T[] | undefined> {
    const filterKeys = util.buildQueryKeys(keys);
    const query = SELECT.from(this.resolvedEntity);

    if (filterKeys) {
      query.where(filterKeys);
    }

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public async findOne(keys: Entry<T>): Promise<T | undefined> {
    const query = SELECT.one.from(this.resolvedEntity).where(keys);

    if (this.externalService) {
      return await this.externalService.run(query);
    }

    return await query;
  }

  public builder(): FindReturn<T> {
    return {
      find: (keys?: Entry<T> | Filter<T>): FindBuilder<T, any> => {
        const filterKeys = util.buildQueryKeys(keys);

        return new FindBuilder<T, unknown>(this.entity, filterKeys, this.externalService);
      },
      findOne: (keys?: Entry<T> | Filter<T>): FindOneBuilder<T, any> => {
        const filterKeys = util.buildQueryKeys(keys);

        return new FindOneBuilder<T, unknown>(this.entity, filterKeys, this.externalService);
      },
    };
  }

  public async update(keys: Entry<T>, fieldsToUpdate: Entry<T>): Promise<boolean> {
    const query = UPDATE.entity(this.resolvedEntity).where(keys).set(fieldsToUpdate);
    if (this.externalService) {
      const updated = await this.externalService.run(query);
      return updated === 1;
    }

    const updated: number = await query;
    return updated === 1;
  }

  public async updateOrCreate(...entries: Entries<T>[]): Promise<boolean> {
    const query = UPSERT.into(this.resolvedEntity).entries(...entries);

    if (this.externalService) {
      throw new Error('Currently not supported on External services, please use update instead !');
    }

    const updatedOrCreated: number = await query;
    return updatedOrCreated > 1;
  }

  public async updateLocaleTexts(localeCodeKeys: Entry<T> & Locale, fieldsToUpdate: Entry<T>): Promise<boolean> {
    const query = UPDATE.entity(`${this.entity.name}.texts`).with(fieldsToUpdate).where(localeCodeKeys);

    if (this.externalService) {
      const updated: number = await this.externalService.run(query);
      return updated === 1;
    }

    const updated: number = await query;
    return updated === 1;
  }

  public async delete(keys: Entry<T>): Promise<boolean> {
    const query = DELETE.from(this.resolvedEntity).where(keys);

    if (this.externalService) {
      // external returns '' on the other side the normal SAP CAP delete returns number
      const deleted: string = await this.externalService.run(query);
      return deleted === '';
    }

    const deleted: number = await query;
    return deleted === 1;
  }

  public async deleteMany(...entries: Entries<T>[]): Promise<boolean> {
    const items = Array.isArray(entries[0]) ? entries[0] : entries;
    const queries = items.map((instance) => DELETE.from(this.resolvedEntity).where(instance));

    if (this.externalService) {
      const deletedItems: string[] = await this.externalService.run(queries);
      return util.isAllSuccess(deletedItems);
    }

    const deletedItems: number[] = await Promise.all(queries);
    return util.isAllSuccess(deletedItems);
  }

  public async deleteAll(): Promise<boolean> {
    const query = DELETE.from(this.resolvedEntity);

    if (this.externalService) {
      const deleted: number = await this.externalService.run(query);
      return deleted > 0;
    }

    const deleted: number = await query;
    return deleted > 0;
  }

  public async exists(keys: Entry<T>): Promise<boolean> {
    const query = SELECT.from(this.resolvedEntity).where(keys);

    if (this.externalService) {
      const found: T[] = await this.externalService.run(query);
      return found.length > 0;
    }

    const found: T[] = await query;
    return found.length > 0;
  }

  public async count(): Promise<number> {
    const query = SELECT.from(this.resolvedEntity);

    if (this.externalService) {
      const found: T[] = await this.externalService.run(query);
      return found.length;
    }

    const found: T[] = await query;
    return found.length;
  }
}

export { CoreRepository };
