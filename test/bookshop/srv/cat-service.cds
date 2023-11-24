using {sap.capire.bookshop as my} from '../db/schema';

service CatalogService {

  @odata.draft.enabled: true
  entity BookEvents as projection on my.BookEvents;

  entity Authors    as projection on my.Authors;
  entity Books      as projection on my.Books;

}
