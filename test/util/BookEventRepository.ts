import { Mixin } from 'ts-mixer';
import { BookEvent } from '../bookshop/srv/util/types/entities/CatalogService';
import { BaseRepository } from '../../lib';
import { BaseRepositoryDraft } from '../../lib/BaseRepositoryDraft';

class BookEventRepository extends Mixin(BaseRepository<BookEvent>, BaseRepositoryDraft<BookEvent>) {
  constructor() {
    super(BookEvent);
  }

  // ... define custom CDS-QL actions if BaseRepository ones are not satisfying your needs !
}

export default BookEventRepository;
