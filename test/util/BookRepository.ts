import type { Book } from '#cds-models/CatalogService';
import { BaseRepository } from '../../lib';

export const getBookRepository = async () => {
  const { Book } = await import('#cds-models/CatalogService');

  class BookRepository extends BaseRepository<Book> {
    constructor() {
      super(Book);
    }
  }

  return new BookRepository();
};
