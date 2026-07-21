import { expandUtils } from '../../../lib/util/find/helper/expandUtils';
import { constants } from '../../../lib/constants/constants';

// Pure-function test: no test server / DB needed.

describe('expandUtils', () => {
  describe('.buildDeepExpand()', () => {
    it('should throw when an expand structure value matches none of the known shapes', () => {
      // Neither {} (expand all), nor { select }, nor { expand }, nor { select, expand }.
      const malformedExpand = { author: { unknownKey: true } };

      expect(() => expandUtils.buildDeepExpand(malformedExpand, {})).toThrow(constants.MESSAGES.DEEP_EXPAND_NOT_EXIST);
    });
  });
});
