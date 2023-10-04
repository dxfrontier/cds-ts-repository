import path from 'path';
import cds from '@sap/cds';
import { BaseRepository } from '../../lib/BaseRepository';
import { type Book } from '../bookshop/srv/util/types/entities/sap/capire/bookshop';

export const connectTest = (dirName: string, projectName: string) => {
  const project = path.join(dirName, '..', projectName);
  cds.test(project);

  return cds;
};

export const getBookRepository = async (_cds: ReturnType<typeof connectTest>) => {
  const CatalogService = await _cds.connect.to('CatalogService');
  const { Books } = CatalogService.entities;

  class BookRepository extends BaseRepository<Book> {
    constructor() {
      super(Books);
    }
  }

  return new BookRepository();

  // return customer;
};
