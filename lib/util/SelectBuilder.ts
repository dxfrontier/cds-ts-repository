/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Definition } from '@sap/cds/apis/csn';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

class SelectBuilder<T, Keys> {
  private readonly select: SELECT<T>;

  constructor(
    private readonly entity: Definition | string,
    private readonly keys: Keys,
  ) {
    this.select = SELECT.from(this.entity).where(this.keys);
  }

  /**
   * Retrieves the expands associated entities.
   * @param associations An array of column names to expand, representing associated entities.
   * @returns Returns the instance of the current object.
   *
   * @example
   * const results = await this.builder()
   * .find({
   *     name: 'A company name',
   * })
   * .getExpand(['orders'])
   * .execute();
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
   * @param {Array<keyof T>} columns An array of column names to order ascending.
   * @returns {this} Returns the instance of the current object.
   *
   * @example
   * await this.builder().find({
   *   name: 'A company name',
   * })
   * .orderAsc(['name'])
   * .execute();
   */
  public orderAsc(columns: Array<keyof T>): this {
    const columnsWithAsc = columns.map((column) => `${column as unknown as string} asc`);

    void this.select.orderBy(...columnsWithAsc);
    return this;
  }

  /**
   * Orders the selected columns in descending order.
   * @param columns An array of column names to order in descending.
   * @returns Returns the instance of the current object.
   *
   * @example
   * await this.builder().find({
   *   name: 'A company name',
   * })
   * .orderDesc(['name'])
   * .execute();
   */
  public orderDesc(columns: Array<keyof T>): this {
    const columnsWithDesc = columns.map((column) => `${column as unknown as string} desc`);

    void this.select.orderBy(...columnsWithDesc);

    return this;
  }

  /**
   * Groups the selected columns.
   * @param columns An array of column names to use for grouping.
   * @returns Returns the instance of the current object.
   *
   * @example
   * await this.builder().find({
   *   name: 'A company name',
   * })
   * .groupBy(['name'])
   * .execute();
   */
  public groupBy(columns: Array<keyof T>): this {
    void this.select.groupBy(columns as unknown as string);
    return this;
  }

  /**
   * Limits the result set with an optional offset.
   * @param props
   * @param props.limit The limit for the result set.
   * @param props.skip The optional 'skip', this will skip a certain number of items for the result set.
   * @returns {this} Returns the instance of the current object.
   *
   * @example
   * await this.builder().find({
   *   name: 'A company name',
   * })
   * .limit({ limit: 10, skip: 5 })
   * .execute();
   *
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
   * @returns A promise that resolves to the query result.
   */
  public async execute(): Promise<T[]> {
    return await this.select;
  }
}

export default SelectBuilder;
