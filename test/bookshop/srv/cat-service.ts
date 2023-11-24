import cds from '@sap/cds';
import { BookEvent } from './util/types/entities/sap/capire/bookshop';

class BooksService extends cds.ApplicationService {
  init() {
    const { Books, BookEvents } = this.entities;

    this.after('READ', Books, async (results, req) => {
      const createNewInstance = await INSERT.into(BookEvents).entries({
        name: 'test',
        types: 'BOOK_SIGNING',
      });

      const getAll: BookEvent[] = await SELECT.from(BookEvents);

      const foundID = getAll.filter((item: BookEvent) => item.name === 'test')[0].ID;
      const posting = await this.post(`/BookEvents(ID=${foundID},IsActiveEntity=true)/CatalogService.draftEdit`, {
        PreserveChanges: true,
      });
    });
    return super.init();
  }
}

module.exports = BooksService;
