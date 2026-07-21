import { Filter } from '../../../lib/util/filter/Filter';
import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';

// NOTE: BookEvents is the only `@odata.draft.enabled` entity in the test bookshop model
// (test/bookshop/srv/controller/cat-service/catalog-service.cds) and it has no numeric column
// (see test/bookshop/db/schema.cds: `name`, `types` and the inherited `managed`/`cuid` fields are
// all strings/timestamps/UUIDs). A real end-to-end numeric increment/decrement therefore cannot be
// exercised against real draft rows without modifying test/bookshop/db/schema.cds, which is out of
// scope for this suite (owned by the parallel feature work). CoreRepository's own increment/decrement
// implementation (the SQL/branch logic) is already fully proven against real numeric data in
// test/unit/active-entity/INCREMENT.test.ts and test/unit/external-service/EXTERNAL.CORE.test.ts.
// What is untested is BaseRepositoryDraft's thin delegation to that same CoreRepository instance -
// so these tests spy on the shared `coreRepository` to prove the four draft methods forward their
// arguments (and return value) correctly.

describe('INCREMENT / DECREMENT - drafts', () => {
  startTestServer(__dirname, 'bookshop');

  let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;

  beforeAll(async () => {
    bookEventDraftRepository = await getBookEventRepository();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('.incrementDraft()', () => {
    it('should delegate to coreRepository.increment with the provided keys, column and value', async () => {
      const incrementSpy = jest
        .spyOn(bookEventDraftRepository['coreRepository'], 'increment')
        .mockResolvedValueOnce(true);

      const result = await bookEventDraftRepository.incrementDraft(
        { ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' },
        'viewCount' as never,
        5,
      );

      expect(incrementSpy).toHaveBeenCalledWith({ ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' }, 'viewCount', 5);
      expect(result).toBe(true);
    });

    it('should default the increment value to 1 and propagate a false result', async () => {
      const incrementSpy = jest
        .spyOn(bookEventDraftRepository['coreRepository'], 'increment')
        .mockResolvedValueOnce(false);

      const result = await bookEventDraftRepository.incrementDraft(
        { ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' },
        'viewCount' as never,
      );

      expect(incrementSpy).toHaveBeenCalledWith({ ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' }, 'viewCount', 1);
      expect(result).toBe(false);
    });
  });

  describe('.decrementDraft()', () => {
    it('should delegate to coreRepository.decrement with the provided keys, column and value', async () => {
      const decrementSpy = jest
        .spyOn(bookEventDraftRepository['coreRepository'], 'decrement')
        .mockResolvedValueOnce(true);

      const result = await bookEventDraftRepository.decrementDraft(
        { ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' },
        'viewCount' as never,
        3,
      );

      expect(decrementSpy).toHaveBeenCalledWith({ ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' }, 'viewCount', 3);
      expect(result).toBe(true);
    });

    it('should default the decrement value to 1 and propagate a false result', async () => {
      const decrementSpy = jest
        .spyOn(bookEventDraftRepository['coreRepository'], 'decrement')
        .mockResolvedValueOnce(false);

      const result = await bookEventDraftRepository.decrementDraft(
        { ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' },
        'viewCount' as never,
      );

      expect(decrementSpy).toHaveBeenCalledWith({ ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' }, 'viewCount', 1);
      expect(result).toBe(false);
    });
  });

  describe('.incrementManyDrafts()', () => {
    it('should delegate to coreRepository.incrementMany with a keys object', async () => {
      const incrementManySpy = jest
        .spyOn(bookEventDraftRepository['coreRepository'], 'incrementMany')
        .mockResolvedValueOnce(2);

      const result = await bookEventDraftRepository.incrementManyDrafts(
        { types: 'BOOK_LUNCH' } as never,
        {
          viewCount: 1,
        } as never,
      );

      expect(incrementManySpy).toHaveBeenCalledWith({ types: 'BOOK_LUNCH' }, { viewCount: 1 });
      expect(result).toBe(2);
    });

    it('should delegate to coreRepository.incrementMany with a Filter', async () => {
      const filter = new Filter({ field: 'types', operator: 'EQUALS', value: 'BOOK_LUNCH' });

      const incrementManySpy = jest
        .spyOn(bookEventDraftRepository['coreRepository'], 'incrementMany')
        .mockResolvedValueOnce(4);

      const result = await bookEventDraftRepository.incrementManyDrafts(filter as never, { viewCount: 2 } as never);

      expect(incrementManySpy).toHaveBeenCalledWith(filter, { viewCount: 2 });
      expect(result).toBe(4);
    });
  });

  describe('.decrementManyDrafts()', () => {
    it('should delegate to coreRepository.decrementMany with a keys object', async () => {
      const decrementManySpy = jest
        .spyOn(bookEventDraftRepository['coreRepository'], 'decrementMany')
        .mockResolvedValueOnce(1);

      const result = await bookEventDraftRepository.decrementManyDrafts(
        { types: 'BOOK_LUNCH' } as never,
        {
          viewCount: 1,
        } as never,
      );

      expect(decrementManySpy).toHaveBeenCalledWith({ types: 'BOOK_LUNCH' }, { viewCount: 1 });
      expect(result).toBe(1);
    });

    it('should delegate to coreRepository.decrementMany with a Filter', async () => {
      const filter = new Filter({ field: 'types', operator: 'EQUALS', value: 'BOOK_LUNCH' });

      const decrementManySpy = jest
        .spyOn(bookEventDraftRepository['coreRepository'], 'decrementMany')
        .mockResolvedValueOnce(3);

      const result = await bookEventDraftRepository.decrementManyDrafts(filter as never, { viewCount: 5 } as never);

      expect(decrementManySpy).toHaveBeenCalledWith(filter, { viewCount: 5 });
      expect(result).toBe(3);
    });
  });
});
