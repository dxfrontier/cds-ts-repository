import cds from '@sap/cds';
import { BookEvent } from './util/types/entities/sap/capire/bookshop';

class BooksService extends cds.ApplicationService {
  init() {
    return super.init();
  }
}

module.exports = BooksService;
