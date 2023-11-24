import { type Definition } from '@sap/cds/apis/csn';

export const Util = {
  isAllSuccess(items: number[]): boolean {
    if (items.includes(0)) {
      return false;
    }
    return true;
  },

  isDefinition(entity: Definition | string): entity is Definition {
    if (typeof entity !== 'string') return true;
    return false;
  },
};

export default Util;
