import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';
import { o } from 'odata';

describe('SELECT - drafts', () => {
  const { GET } = startTestServer(__dirname, 'bookshop');

  let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;

  beforeAll(async () => {
    const {
      config: { baseURL },
    } = await GET('https://services.odata.org/Experimental/OData/OData.svc/Products');

    const _activateDraft = async (baseURL: string, uuid: string): Promise<void> => {
      await o(`${baseURL}/odata/v4/catalog/`)
        .post(`BookEvents(ID=${uuid},IsActiveEntity=true)/CatalogService.draftEdit`, {})
        .query();
    };

    if (baseURL != null) {
      await _activateDraft(baseURL, '9b9c5591-52a3-41ea-ab85-40a5a7ae5360');
      await _activateDraft(baseURL, '84c67833-a9cb-450c-ae02-a32c3a7a6f6b');
      await _activateDraft(baseURL, '2f4d6e7a-8b18-4a6f-bc3e-9c8d6b74cfe1');
      await _activateDraft(baseURL, '3d5e8f7c-6a9b-4d02-af87-91b480a573d1');
    }

    bookEventDraftRepository = await getBookEventRepository();
  });

  describe('.getAllDrafts()', () => {
    it('should return all draft items from the database', async () => {
      // Act
      const getAll = await bookEventDraftRepository.getAllDrafts();

      // Assert
      expect(getAll!.length).toBeGreaterThan(0);
    });
  });

  describe('.getDraftsDistinctColumns()', () => {
    it('should return distinct columns found in the database - .getDraftsDistinctColumns(["ID", "name"])', async () => {
      // Act
      const getDistinctColumns = await bookEventDraftRepository.getDraftsDistinctColumns(['ID', 'name']);

      // Assert
      expect(getDistinctColumns!.length).toBeGreaterThan(0);
    });

    it('should return distinct columns found in the database - .getDraftsDistinctColumns("ID", "name")', async () => {
      // Act
      const getDistinctColumns = await bookEventDraftRepository.getDraftsDistinctColumns('ID', 'name');

      // Assert
      expect(getDistinctColumns!.length).toBeGreaterThan(0);
    });
  });

  describe('.getAllDraftsAndLimit()', () => {
    it('should have length smaller than .getAll length with specified limit', async () => {
      // Act
      const getAll = await bookEventDraftRepository.getAllDrafts();
      const getAllAndLimit = await bookEventDraftRepository.getAllDraftsAndLimit({ limit: 1 });
      const getAllAndLimitAndSkip = await bookEventDraftRepository.getAllDraftsAndLimit({ limit: 2, skip: 1 });

      // Assert
      expect(getAllAndLimit!.length).toBeGreaterThan(0);
      expect(getAllAndLimit!.length).toBeLessThan(getAll!.length);
      expect(getAllAndLimitAndSkip).not.toContain(getAllAndLimit![0]);
    });
  });

  describe('.findDrafts()', () => {
    it('should multiples items with the specified "BOOK_LUNCH"', async () => {
      // Arrange
      const getAll = await bookEventDraftRepository.getAllDrafts();

      // Act
      const findMultiple = await bookEventDraftRepository.findDrafts({ types: 'BOOK_LUNCH' });

      // Assert
      expect(getAll!.length).toBeGreaterThan(findMultiple!.length);
    });
  });

  describe('.findOneDraft()', () => {
    it('should return only one item with the specified name', async () => {
      // Act
      const findOne = await bookEventDraftRepository.findOneDraft({ name: 'Empire 4' });

      // Assert
      expect(findOne).toBeDefined();
    });
  });

  describe('.builderDraft()', () => {
    describe('======> .getExpand()', () => {
      it('should return the original object + expanded "author" property', async () => {
        // Act
        const expand = await bookEventDraftRepository
          .builderDraft()
          .find({ ID: '2f4d6e7a-8b18-4a6f-bc3e-9c8d6b74cfe1' })
          .getExpand(['author'])
          .execute();

        const findOne = await bookEventDraftRepository.findOne({
          ID: '2f4d6e7a-8b18-4a6f-bc3e-9c8d6b74cfe1',
        });

        // Assert
        expect(expand?.length).toBeGreaterThan(0);
        expect(expand![0]).toHaveProperty('author');
        expect(findOne).not.toMatchObject(expand![0]);
      });
    });

    describe('======> .orderDesc()', () => {
      it('should find all values with "BOOK_LUNCH" and make them "DESC" over "BOOK_LUNCH" property', async () => {
        // Arrange
        const orderAsc = await bookEventDraftRepository
          .builderDraft()
          .find({ types: 'BOOK_LUNCH' })
          .orderAsc(['name'])
          .execute();

        // Act
        const orderDesc = await bookEventDraftRepository
          .builderDraft()
          .find({ types: 'BOOK_LUNCH' })
          .orderDesc(['name'])
          .execute();

        // Assert
        expect(orderDesc).not.toStrictEqual(orderAsc);
      });
    });

    describe('======> .orderAsc()', () => {
      it('should find all values with "BOOK_LUNCH" and make them "ASC" over "BOOK_LUNCH" property', async () => {
        // Arrange
        const orderDesc = await bookEventDraftRepository
          .builderDraft()
          .find({ types: 'BOOK_LUNCH' })
          .orderDesc(['name'])
          .execute();

        // Act

        const orderAsc = await bookEventDraftRepository
          .builderDraft()
          .find({ types: 'BOOK_LUNCH' })
          .orderAsc(['name'])
          .execute();
        // Assert
        expect(orderAsc).not.toStrictEqual(orderDesc);
      });

      describe('======> .groupBy()', () => {
        it('should group by column "types"', async () => {
          // Arrange
          const original = await bookEventDraftRepository.getAllDrafts();
          // Act
          const groupBy = await bookEventDraftRepository
            .builderDraft()
            .find({ types: 'BOOK_LUNCH' })
            .groupBy(['types'])
            .execute();

          // Assert
          expect(groupBy![0]).toBeDefined();
          expect(groupBy).not.toMatchObject(original!);
        });
      });

      describe('======> .limit()', () => {
        it('should return only 1 item with specified limit', async () => {
          const limit = await bookEventDraftRepository
            .builderDraft()
            .find({ types: 'BOOK_LUNCH' })
            .limit({ limit: 1 })
            .execute();
          expect(limit).toHaveLength(1);
        });
      });

      describe('======> .limit() with skip', () => {
        it('should return only 1 item when limit is 1 and skip is 1', async () => {
          const all = await bookEventDraftRepository.builderDraft().find({ types: 'BOOK_LUNCH' }).execute();
          const limit = await bookEventDraftRepository
            .builderDraft()
            .find({ types: 'BOOK_LUNCH' })
            .limit({ limit: 1, skip: 1 })
            .execute();

          expect(limit).toHaveLength(1);
          expect(limit).not.toEqual(all![0]);
        });
      });

      describe('======> .execute()', () => {
        it('It should RETURN : .execute should execute the Promise and return results', async () => {
          const all = await bookEventDraftRepository.builderDraft().find({ types: 'BOOK_LUNCH' }).execute();
          expect(all).toBeDefined();
        });
      });

      describe('.existsDraft()', () => {
        it('should return "true" when 1 item is found with the specified ID', async () => {
          // Act
          const exists = await bookEventDraftRepository.existsDraft({ ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' });

          // Assert
          expect(exists).toBe(true);
        });
      });

      describe('.countDrafts()', () => {
        it('should return a count number larger than "0"', async () => {
          // Act
          const count = await bookEventDraftRepository.countDrafts();

          // Assert
          expect(count).toBeGreaterThan(0);
        });
      });
    });
  });
});
