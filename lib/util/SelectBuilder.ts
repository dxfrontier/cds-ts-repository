import { SELECT } from '@sap/cds/apis/ql'
import { entity } from '@sap/cds/apis/csn'
import { KeyValueType } from '../types/types'

class SelectBuilder<T> {
  private select: SELECT<T>

  constructor(private entity: entity, private keys: KeyValueType<T>) {
    this.select = SELECT.from(this.entity).where(this.keys)
  }

  private findAssociationsAndCompositions(): string[] {
    const elements = Object.values(this.entity.elements)

    return elements
      .filter((element) => element.type === 'cds.Association' || element.type === 'cds.Composition')
      .map((association) => association.name)
  }

  /**
   * Retrieves the selected columns and expands associated entities.
   * @param {Array<string>} [associations] - The optional name of the columns to expand.
   * @returns {this} - Returns the instance of the current object.
   */

  public getExpand(associations?: (keyof T)[]): this {
    // const private routines for this func
    const _buildAssociatedEntities = (column: any) => {
      const linkedEntities: string[] = this.findAssociationsAndCompositions()

      linkedEntities.forEach((association: string) => {
        column[association]((linkedEntity: Function) => {
          linkedEntity('*')
        })
      })
    }

    const _buildAssociatedNamedEntity = (column: any) => {
      associations!.forEach((association) => {
        column[association]((linkedEntity: Function) => {
          linkedEntity('*')
        })
      })
    }

    const hasNamedAssociations = associations && associations.length > 0

    this.select.columns((column: any) => {
      column('*')
      if (hasNamedAssociations) {
        _buildAssociatedNamedEntity(column)
        return
      }
      _buildAssociatedEntities(column)
    })

    return this
  }

  /**
   * Orders the selected columns in ascending order.
   * @param {Array<keyof T>} columns - The columns to order.
   * @returns {this} - Returns the instance of the current object.
   */

  public orderAsc(columns: (keyof T)[]): this {
    this.select.orderBy(columns.join(' ') + ' asc')
    return this
  }

  /**
   * Orders the selected columns in descending order.
   * @param {Array<keyof T>} columns - The columns to order.
   * @returns {this} - Returns the instance of the current object.
   */
  public orderDesc(columns: (keyof T)[]): this {
    this.select.orderBy(columns.join(' ') + ' desc')

    return this
  }

  /**
   * Groups the selected columns.
   * @param {Array<keyof T>} columns - The columns to group by.
   * @returns {this} - Returns the instance of the current object.
   */
  public groupBy(columns: (keyof T)[]): this {
    this.select.groupBy(columns.join(' '))
    return this
  }

  /**
   * Limits the result set with an optional offset.
   * @param {Object} props - The limit and optional offset.
   * @param {number} props.limit - The limit for the result set.
   * @param {number} [props.offset] - The optional offset for the result set.
   * @returns {this} - Returns the instance of the current object.
   */
  public limit(props: { limit: number; offset?: number }): this {
    if (props.offset) {
      this.select.limit(props.limit, props.offset)
      return this
    }

    this.select.limit(props.limit)
    return this
  }

  /**
   * Executes the query and returns the result as an array of objects.
   * @returns {Promise<Array<T>>} - A promise that resolves to the query result.
   */
  public async execute(): Promise<T[]> {
    return this.select
  }
}

export default SelectBuilder
