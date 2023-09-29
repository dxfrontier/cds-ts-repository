import path from 'path';
import cds from '@sap/cds';
import BaseRepository from '../../lib/BaseRepository';
import { Book } from '../bookshop/srv/util/types/entities/sap/capire/bookshop';

export const connectTest = (dirName : string, projectName : string) => {
    const project = path.join(dirName, projectName);
    cds.test(project)

    return cds
}

export const getCustomerRepository = async (_cds : ReturnType<typeof connectTest>) => {
    const CatalogService = await _cds.connect.to('CatalogService')
    const { Books } = CatalogService.entities

    class CustomerRepository extends BaseRepository<Book> {
        constructor() {
          super(Books);
        }
      }
    
    return new CustomerRepository();

    // return customer;
}