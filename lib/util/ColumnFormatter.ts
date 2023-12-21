import type { StringFunctions } from '../types/types';

class ColumnFormatter<T> {
  readonly column: keyof T;
  readonly aggregationFunction: StringFunctions;
  readonly as: string;

  constructor(props: { column: keyof T; aggregationFunction: StringFunctions; as: string }) {
    this.column = props.column;
    this.aggregationFunction = props.aggregationFunction;
    // this.as = props.as;
  }
}

export default ColumnFormatter;
