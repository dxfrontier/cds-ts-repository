/* eslint-disable @typescript-eslint/no-explicit-any */
import { type entity } from '@sap/cds/apis/csn';
import { type KeyValueType } from '../types/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

class SelectBuilder<T> {
  private readonly select: SELECT<T>;

  constructor(
    private readonly entity: entity,
    private readonly keys: KeyValueType<T>,
  ) {
    this.select = SELECT.from(this.entity).where(this.keys);
  }

  /**
   * Retrieves the expands associated entities.
   * @param {Array<keyof T>} [associations] - An array of column names to expand, representing associated entities.
   * @returns {this} - Returns the instance of the current object.
   */
  public getExpand(associations: Array<keyof T>): this {
    // const private routines for this func

    const _buildAssociatedNamedEntity = (column: any): void => {
      associations?.forEach((association) => {
        column[association]((linkedEntity: (...args: unknown[]) => unknown) => {
          linkedEntity('*');
        });
      });
    };

    void this.select.columns((column: any) => {
      column('*');
      _buildAssociatedNamedEntity(column);
    });

    return this;
  }

  /**
   * Orders the selected columns in ascending order.
   * @param {Array<keyof T>} columns - An array of column names to order ascending.
   * @returns {this} - Returns the instance of the current object.
   */
  public orderAsc(columns: Array<keyof T>): this {
    void this.select.orderBy(columns.join(' ') + ' asc');
    return this;
  }

  /**
   * Orders the selected columns in descending order.
   * @param {Array<keyof T>} columns - An array of column names to order in descending.
   * @returns {this} - Returns the instance of the current object.
   */
  public orderDesc(columns: Array<keyof T>): this {
    void this.select.orderBy(columns.join(' ') + ' desc');

    return this;
  }

  /**
   * Groups the selected columns.
   * @param {Array<keyof T>} columns - An array of column names to use for grouping.
   * @returns {this} - Returns the instance of the current object.
   */
  public groupBy(columns: Array<keyof T>): this {
    void this.select.groupBy(columns.join(' '));
    return this;
  }

  /**
   * Limits the result set with an optional offset.
   * @param {number} props.limit - The limit for the result set.
   * @param {number | undefined} [props.skip] - The optional 'skip', this will skip a certain number of items for the result set.
   * @returns {this} - Returns the instance of the current object.
   */
  public limit(props: { limit: number; skip?: number }): this {
    if (props.skip !== null) {
      void this.select.limit(props.limit, props.skip);
      return this;
    }

    void this.select.limit(props.limit);
    return this;
  }

  /**
   * Executes the query and returns the result as an array of objects.
   * @returns {Promise<Array<T>>} - A promise that resolves to the query result.
   */
  public async execute(): Promise<T[]> {
    return await this.select;
  }
}

export default SelectBuilder;
