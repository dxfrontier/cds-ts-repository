import { Mixin } from 'ts-mixer';
import { BaseRepository } from '../../lib';
import { BaseRepositoryDraft } from '../../lib/core/BaseRepositoryDraft';
import type { BookEvent } from '#cds-models/CatalogService';

export const getBookEventRepository = async () => {
  const { BookEvent } = await import('#cds-models/CatalogService');

  // @ts-expect-error 'BookEvent' has no numeric element : 'IncrementFields<BookEvent>' resolves to 'undefined', which fails ts-mixer's static prototype check
  class BookEventRepository extends Mixin(BaseRepository<BookEvent>, BaseRepositoryDraft<BookEvent>) {
    constructor() {
      super(BookEvent);
    }
  }

  return new BookEventRepository();
};
