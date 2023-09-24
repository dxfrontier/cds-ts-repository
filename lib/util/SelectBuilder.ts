/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SELECT } from '@sap/cds/apis/ql';
import { type entity } from '@sap/cds/apis/csn';
import { type KeyValueType } from '../types/types';

class SelectBuilder<T> {
  private readonly select: SELECT<T>;

  constructor(
    private readonly entity: entity,
    private readonly keys: KeyValueType<T>,
  ) {
    this.select = SELECT.from(this.entity).where(this.keys);
  }

  private findAssociationsAndCompositions(): string[] {
    const elements = Object.values(this.entity.elements);

    return elements
      .filter((element) => element.type === 'cds.Association' || element.type === 'cds.Composition')
      .map((association) => association.name);
  }

  /**
   * Retrieves the selected columns and expands associated entities.
   * @param {Array<string>} [associations] - The optional name of the columns to expand.
   * @returns {this} - Returns the instance of the current object.
   */

  public getExpand(associations?: Array<keyof T>): this {
    // const private routines for this func

    const _buildAssociatedEntities = (column: any): void => {
      const linkedEntities: string[] = this.findAssociationsAndCompositions();

      linkedEntities.forEach((association: string) => {
        column[association]((linkedEntity: Function) => {
          linkedEntity('*');
        });
      });
    };

    const _buildAssociatedNamedEntity = (column: any): void => {
      associations?.forEach((association) => {
        column[association]((linkedEntity: Function) => {
          linkedEntity('*');
        });
      });
    };

    const hasNamedAssociations = associations != null && associations.length > 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void this.select.columns((column: any) => {
      column('*');
      if (hasNamedAssociations ?? false) {
        _buildAssociatedNamedEntity(column);
        return;
      }
      _buildAssociatedEntities(column);
    });

    return this;
  }

  /**
   * Orders the selected columns in ascending order.
   * @param {Array<keyof T>} columns - The columns to order.
   * @returns {this} - Returns the instance of the current object.
   */

  public orderAsc(columns: Array<keyof T>): this {
    void this.select.orderBy(columns.join(' ') + ' asc');
    return this;
  }

  /**
   * Orders the selected columns in descending order.
   * @param {Array<keyof T>} columns - The columns to order.
   * @returns {this} - Returns the instance of the current object.
   */
  public orderDesc(columns: Array<keyof T>): this {
    void this.select.orderBy(columns.join(' ') + ' desc');

    return this;
  }

  /**
   * Groups the selected columns.
   * @param {Array<keyof T>} columns - The columns to group by.
   * @returns {this} - Returns the instance of the current object.
   */
  public groupBy(columns: Array<keyof T>): this {
    void this.select.groupBy(columns.join(' '));
    return this;
  }

  /**
   * Limits the result set with an optional offset.
   * @param {Object} props - The limit and optional offset.
   * @param {number} props.limit - The limit for the result set.
   * @param {number} [props.offset] - The optional offset for the result set.
   * @returns {this} - Returns the instance of the current object.
   */
  public limit(props: { limit: number; offset?: number }): this {
    if (props.offset != null) {
      void this.select.limit(props.limit, props.offset);
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
