import type { Book, Books } from '#cds-models/CatalogService';
import { BaseRepository } from '../../lib';

export const getBookRepository = async () => {
  const { Books } = await import('#cds-models/CatalogService');

  class BookRepository extends BaseRepository<Books> {
    constructor() {
      super(Books);
    }
  }

  return new BookRepository();
};
