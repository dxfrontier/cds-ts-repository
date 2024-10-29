import { CDSDispatcher } from '@dxfrontier/cds-ts-dispatcher';

import BookHandler from './handler/BookHandler';

export = new CDSDispatcher([
  // Entities
  BookHandler,
]).initialize();
