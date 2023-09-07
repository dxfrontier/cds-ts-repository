import { SELECT } from '@sap/cds/apis/ql'
import { KeyValueType } from '../types/types'
import { Definition } from '@sap/cds/apis/csn'

class SelectBuilder<T> {
  private select: any

  constructor(private entity: Definition, private keys: KeyValueType<T>) {
    this.select = SELECT.from(this.entity).where(this.keys)
  }

  public orderAsc(columns: (keyof T)[]): this {
    this.select.orderBy(columns.join(', ') + ' asc')
    return this
  }

  public orderDesc(columns: (keyof T)[]): this {
    this.select.orderBy(columns.join(', ') + ' desc')

    return this
  }

  public groupBy(columns: (keyof T)[]): this {
    this.select.groupBy(columns.join(', '))
    return this
  }

  public limit(props: { limit: number; offset?: number }): this {
    if (props.offset) {
      this.select.limit(props.limit, props.offset)
      return this
    }

    this.select.limit(props.limit)
    return this
  }

  public async execute() {
    return this.select
  }
}

export default SelectBuilder
