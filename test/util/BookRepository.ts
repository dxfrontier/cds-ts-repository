import { Book } from '../bookshop/srv/util/types/entities/CatalogService';
import { BaseRepository } from '../../lib';

class BookRepository extends BaseRepository<Book> {
  constructor() {
    super(Book);
  }

  // ... define custom CDS-QL actions if BaseRepository ones are not satisfying your needs !
}

export default BookRepository;

// TODO: change to this approach in near future.

/*import path from 'path';
import cds from '@sap/cds';
import { BaseRepository } from '../../lib/BaseRepository';
import type { Book } from '../bookshop/srv/util/types/entities/sap/capire/bookshop';

export const getBookRepository = async (_cds: ReturnType<typeof connectTest>) => {
  const { Book } = await import('../bookshop/srv/util/types/entities/sap/capire/bookshop');

  const CatalogService = await _cds.connect.to('CatalogService');

  class BookRepository extends BaseRepository<Book> {
    constructor() {
      super(Book);
    }
  }

  return new BookRepository();
};*/
