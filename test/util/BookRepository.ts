import { Book } from '../bookshop/srv/util/types/entities/CatalogService';
import { BaseRepository } from '../../lib';

class BookRepository extends BaseRepository<Book> {
  constructor() {
    super(Book);
  }

  // ... define custom CDS-QL actions if BaseRepository ones are not satisfying your needs !
}

export default BookRepository;
