using {sap.capire.bookshop as Base} from '../../../db/schema';

service CatalogService {

  @odata.draft.enabled: true
  entity BookEvents as projection on Base.BookEvents;

  entity Authors    as projection on Base.Authors;
  entity Books      as projection on Base.Books;

}
