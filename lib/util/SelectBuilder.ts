/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Definition } from '@sap/cds/apis/csn';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Service } from '@sap/cds';

class SelectBuilder<T, Keys> {
  private select: SELECT<T>;

  /* This flag is used in the getExpand method, as both methods are calling the .columns
   */
  private isColumnsCalledFirst: boolean = false;

  private isExpandCalledFirst: boolean = false;

  constructor(
    private readonly entity: Definition | string,
    private readonly keys: Keys | string,
  ) {
    this.select = SELECT.from(this.entity).where(this.keys);
  }

  /**
   * Orders the selected columns in ascending order.
   * @param {Array<keyof T>} columns An array of column names to order ascending.
   * @returns SelectBuilder instance
   *
   * @example
   * const results = await this.builder().find({
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
   * @returns SelectBuilder instance
   *
   * @example
   * const results = await this.builder().find({
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
   * @returns SelectBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .groupBy(['name'])
   * .execute();
   */
  public groupBy(columns: Array<keyof T>): this {
    void this.select.groupBy(columns as unknown as string).columns;
    return this;
  }

  /**
   * Retrieves the expands associated entities.
   * @param associations An array of column names to expand, representing associated entities.
   * @returns SelectBuilder instance
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
    this.isExpandCalledFirst = true;

    // const private routines for this func
    const _buildAssociatedNamedEntity = (column: any): void => {
      // If .columns() was called first do not expand all
      if (!this.isColumnsCalledFirst) {
        column('*');
      }

      associations?.forEach((association) => {
        column[association]((linkedEntity: (...args: unknown[]) => unknown) => {
          linkedEntity('*');
        });
      });
    };

    void this.select.columns((column: any) => {
      _buildAssociatedNamedEntity(column);
    });

    return this;
  }

  /**
   * Specifies which columns to be fetched
   * @param columns An array of column names to retrieve.
   * @returns SelectBuilder instance
   *
   * @example
   * const results = await this.builder().find({
   *   name: 'A company name',
   * })
   * .columns(['name', 'currency_code'])
   * .execute();
   *
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public columns<Columns extends keyof T>(columns: Columns[]) {
    // private routine for this func
    const _removeExpandAllFields = (): void => {
      this.select.SELECT.columns?.shift();
      /* 
        Workaround using reverse
        When .getExpand(['reviews']) is firstly called before .columns(['currency_code','reviews']) somehow this causes duplicates and gives an error.
        If this is being reversed, this works as expected
      */
      this.select.SELECT.columns?.reverse();
    };

    void this.select.columns(columns as unknown as string);

    if (this.isExpandCalledFirst) {
      // As the .columns() was called after .getExpand(), the '*' will be removed from the .columns array to have correct typing based only on the columns
      _removeExpandAllFields();
    }

    // We are creating and new instance of SelectBuilder and preserving the select from the current SelectBuilder instance
    const selectBuilder = new SelectBuilder<Pick<T, Columns>, typeof this.keys>(this.entity, this.keys);

    selectBuilder.select = this.select;
    selectBuilder.isColumnsCalledFirst = true;

    return selectBuilder;
  }

  /**
   * Limits the result set with an optional offset.
   * @param props
   * @param props.limit The limit for the result set.
   * @param props.skip The optional 'skip', this will skip a certain number of items for the result set.
   * @returns SelectBuilder instance
   *
   * @example
   * const results = await this.builder().find({
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
  public async execute(): Promise<T[] | undefined> {
    return await this.select;
  }
}

export default SelectBuilder;
