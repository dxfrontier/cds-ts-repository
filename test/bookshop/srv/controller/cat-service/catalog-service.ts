import { CDSDispatcher } from '@dxfrontier/cds-ts-dispatcher';

import BookHandler from './handler/BookHandler';

export default new CDSDispatcher([
  // Entities
  BookHandler,
]).initialize();
