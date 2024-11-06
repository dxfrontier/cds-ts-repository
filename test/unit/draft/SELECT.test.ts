import { o } from 'odata';

import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';

const { GET } = startTestServer(__dirname, 'bookshop');

describe('SELECT - drafts', () => {
  let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;

  beforeAll(async () => {
    const {
      config: { baseURL },
    } = await GET('http://www.google.com');

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
    it('should return all draft items from the database and validate specific fields', async () => {
      // Act
      const getAll = await bookEventDraftRepository.getAllDrafts();

      // Assert
      expect(getAll?.length).toBeGreaterThan(0);

      getAll?.forEach((draft) => {
        // Check DraftAdministrativeData_DraftUUID is present, defined, and non-empty
        expect(draft).toHaveProperty('DraftAdministrativeData_DraftUUID');
        expect(draft.DraftAdministrativeData_DraftUUID).toBeDefined();
        expect(typeof draft.DraftAdministrativeData_DraftUUID).toBe('string');
        expect(draft.DraftAdministrativeData_DraftUUID).not.toBe('');

        // Check HasActiveEntity is present, defined, and true
        expect(draft).toHaveProperty('HasActiveEntity');
        expect(draft.HasActiveEntity).toBeDefined();
        expect(draft.HasActiveEntity).toBe(true);
      });
    });
  });

  describe('.getDraftsDistinctColumns()', () => {
    it('should return distinct columns found in the database - .getDraftsDistinctColumns(["ID", "name"])', async () => {
      // Act
      const distinctColumns = await bookEventDraftRepository.getDraftsDistinctColumns([
        'ID',
        'name',
        'DraftAdministrativeData_DraftUUID',
        'HasActiveEntity',
      ]);

      // Assert
      expect(distinctColumns?.length).toBeGreaterThan(0);

      distinctColumns?.forEach((item) => {
        expect(item).toHaveProperty('ID');
        expect(item.ID).toBeDefined();
        expect(typeof item.ID).toBe('string'); // Adjust type check as needed

        expect(item).toHaveProperty('name');
        expect(item.name).toBeDefined();
        expect(typeof item.name).toBe('string'); // Adjust type check as needed

        // Verify DraftAdministrativeData_DraftUUID is non-empty
        expect(item).toHaveProperty('DraftAdministrativeData_DraftUUID');
        expect(item.DraftAdministrativeData_DraftUUID).toBeDefined();
        expect(item.DraftAdministrativeData_DraftUUID).not.toBe('');

        // Verify HasActiveEntity is true
        expect(item).toHaveProperty('HasActiveEntity', true);
      });
    });

    it('should return distinct columns found in the database - .getDraftsDistinctColumns("ID", "name")', async () => {
      // Act
      const distinctColumns = await bookEventDraftRepository.getDraftsDistinctColumns('ID', 'name');

      // Assert
      expect(distinctColumns?.length).toBeGreaterThan(0);

      distinctColumns?.forEach((item) => {
        expect(item).toHaveProperty('ID');
        expect(item.ID).toBeDefined();
        expect(typeof item.ID).toBe('string'); // Adjust type check as needed

        expect(item).toHaveProperty('name');
        expect(item.name).toBeDefined();
        expect(typeof item.name).toBe('string'); // Adjust type check as needed
      });
    });
  });

  describe('.paginateDrafts()', () => {
    it('should return a smaller length than .getAllDrafts() with specified limit', async () => {
      // Act
      const getAll = await bookEventDraftRepository.getAllDrafts();
      const draftsWithLimit = await bookEventDraftRepository.paginateDrafts({ limit: 1 });
      const draftsWithLimitAndSkip = await bookEventDraftRepository.paginateDrafts({ limit: 2, skip: 1 });

      // Assert
      expect(draftsWithLimit?.length).toBe(1); // Ensures the limit is respected
      expect(draftsWithLimit?.length).toBeLessThan(getAll!.length);

      expect(draftsWithLimitAndSkip?.length).toBe(2); // Ensures the limit is respected
      expect(draftsWithLimitAndSkip?.length).toBeLessThan(getAll!.length);

      // Ensure distinct results between paginated lists
      draftsWithLimitAndSkip?.forEach((draft) => {
        expect(draft).not.toEqual(draftsWithLimit![0]);

        // Verify required properties
        expect(draft).toHaveProperty('DraftAdministrativeData_DraftUUID');
        expect(draft.DraftAdministrativeData_DraftUUID).toBeDefined();
        expect(draft.DraftAdministrativeData_DraftUUID).not.toBe('');

        expect(draft).toHaveProperty('HasActiveEntity', true);
      });

      // Additional check to verify results are unique across pagination
      const combinedResults = [...draftsWithLimit!, ...draftsWithLimitAndSkip!];
      const uniqueResults = new Set(combinedResults.map((draft) => draft.ID)); // Assuming drafts have unique IDs
      expect(uniqueResults.size).toBe(combinedResults.length);
    });
  });

  describe('.findDrafts()', () => {
    it('should return multiple items with the specified type "BOOK_LUNCH"', async () => {
      // Arrange
      const getAll = await bookEventDraftRepository.getAllDrafts();

      // Act
      const findMultiple = await bookEventDraftRepository.findDrafts({ types: 'BOOK_LUNCH' });

      // Assert
      expect(findMultiple?.length).toBeGreaterThan(0);
      expect(getAll?.length).toBeGreaterThan(findMultiple!.length);

      // Verify each item has the specified type
      findMultiple?.forEach((draft) => {
        expect(draft).toHaveProperty('types', 'BOOK_LUNCH');

        expect(draft).toHaveProperty('DraftAdministrativeData_DraftUUID');
        expect(draft.DraftAdministrativeData_DraftUUID).toBeDefined();
        expect(draft.DraftAdministrativeData_DraftUUID).not.toBe('');

        expect(draft).toHaveProperty('HasActiveEntity', true);
      });
    });
  });

  describe('.findOneDraft()', () => {
    it('should return a single item with the specified name and validate specific fields', async () => {
      // Act
      const findOne = await bookEventDraftRepository.findOneDraft({ name: 'Empire 4' });

      // Assert
      expect(findOne).toBeDefined();

      // Verify that the result has the correct name
      expect(findOne).toHaveProperty('name', 'Empire 4');

      // Check that DraftAdministrativeData_DraftUUID is present, defined, and non-empty
      expect(findOne).toHaveProperty('DraftAdministrativeData_DraftUUID');
      expect(findOne?.DraftAdministrativeData_DraftUUID).toBeDefined();
      expect(typeof findOne?.DraftAdministrativeData_DraftUUID).toBe('string');
      expect(findOne?.DraftAdministrativeData_DraftUUID).not.toBe('');

      // Check that HasActiveEntity is present, defined, and true
      expect(findOne).toHaveProperty('HasActiveEntity', true);
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

        expand!.forEach((item) => {
          // Check that the expanded item contains the "author" property
          expect(item).toHaveProperty('author');
          expect(item.author).toBeDefined();

          // Validate that the item still contains the original properties
          expect(item).toHaveProperty('ID');
          expect(item.ID).toBeDefined();
          expect(typeof item.ID).toBe('string');

          // Check that DraftAdministrativeData_DraftUUID is present, defined, and non-empty
          expect(item).toHaveProperty('DraftAdministrativeData_DraftUUID');
          expect(item?.DraftAdministrativeData_DraftUUID).toBeDefined();
          expect(typeof item?.DraftAdministrativeData_DraftUUID).toBe('string');
          expect(item?.DraftAdministrativeData_DraftUUID).not.toBe('');

          // Ensure findOne does not contain the "author" property
          expect(findOne).not.toHaveProperty('author');
        });
      });
    });

    describe('======> .orderDesc()', () => {
      it('should find all values with "BOOK_LUNCH" and order them in descending order over the "name" property', async () => {
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

        // Check that both results have the same length
        expect(orderAsc?.length).toBe(orderDesc?.length);

        // Check that both arrays contain expected properties
        orderAsc?.forEach((item) => {
          expect(item).toHaveProperty('name');
          expect(typeof item.name).toBe('string'); // Adjust type check as needed
        });

        orderDesc?.forEach((item) => {
          expect(item).toHaveProperty('name');
          expect(typeof item.name).toBe('string'); // Adjust type check as needed
        });
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

        // Check that both results have the same length
        expect(orderAsc?.length).toBe(orderDesc?.length);

        // Check that both arrays contain expected properties
        orderAsc?.forEach((item) => {
          expect(item).toHaveProperty('name');
          expect(typeof item.name).toBe('string'); // Adjust type check as needed
        });

        orderDesc?.forEach((item) => {
          expect(item).toHaveProperty('name');
          expect(typeof item.name).toBe('string'); // Adjust type check as needed
        });
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
          expect(groupBy).not.toBeNull();
          expect(groupBy?.length).toBeGreaterThan(0); // Ensure there are grouped results

          // Check that the first grouped result is defined
          expect(groupBy![0]).toBeDefined();

          // Ensure grouped results contain the "types" property
          groupBy?.forEach((group) => {
            expect(group).toHaveProperty('types');
            expect(group.types).toBe('BOOK_LUNCH'); // Assuming grouping returns the same "types" value

            // Check for DraftAdministrativeData_DraftUUID property
            expect(group).toHaveProperty('DraftAdministrativeData_DraftUUID');
            expect(group.DraftAdministrativeData_DraftUUID).toBeDefined();
            expect(typeof group.DraftAdministrativeData_DraftUUID).toBe('string'); // Adjust type check as needed

            // Check for HasActiveEntity property
            expect(group).toHaveProperty('HasActiveEntity');
            expect(group.HasActiveEntity).toBeDefined();
            expect(typeof group.HasActiveEntity).toBe('boolean'); // Adjust type check as needed
          });

          // Ensure the original array is not matched by the grouped results
          expect(groupBy).not.toMatchObject(original!);

          // Optional: Ensure the original array and grouped results are of different lengths
          expect(original?.length).toBeGreaterThan(groupBy!.length);
        });
      });

      describe('======> .paginate()', () => {
        it('should return only 1 item with specified limit', async () => {
          const limit = await bookEventDraftRepository
            .builderDraft()
            .find({ types: 'BOOK_LUNCH' })
            .paginate({ limit: 1 })
            .execute();
          expect(limit).toHaveLength(1);
        });
      });

      describe('======> .paginate()', () => {
        it('should return only 1 item with specified limit', async () => {
          // Act
          const limit = await bookEventDraftRepository
            .builderDraft()
            .find({ types: 'BOOK_LUNCH' })
            .paginate({ limit: 1 })
            .execute();

          // Assert
          expect(limit).toHaveLength(1); // Ensure only one item is returned
          expect(limit![0]).toBeDefined(); // Ensure the item is defined

          // Check that specific properties are present
          expect(limit![0]).toHaveProperty('DraftAdministrativeData_DraftUUID');
          expect(limit![0].DraftAdministrativeData_DraftUUID).toBeDefined();
          expect(typeof limit![0].DraftAdministrativeData_DraftUUID).toBe('string'); // Adjust type check as needed

          expect(limit![0]).toHaveProperty('HasActiveEntity');
          expect(limit![0].HasActiveEntity).toBeDefined();
          expect(typeof limit![0].HasActiveEntity).toBe('boolean'); // Adjust type check as needed
        });
      });

      describe('======> .execute()', () => {
        it('should execute the Promise and return results', async () => {
          // Act
          const all = await bookEventDraftRepository.builderDraft().find({ types: 'BOOK_LUNCH' }).execute();

          // Assert
          expect(all).toBeDefined(); // Ensure results are defined
          expect(all!.length).toBeGreaterThan(0); // Ensure there is at least one result

          // Check that each item has expected properties
          all?.forEach((item) => {
            expect(item).toHaveProperty('DraftAdministrativeData_DraftUUID');
            expect(item.DraftAdministrativeData_DraftUUID).toBeDefined();
            expect(typeof item.DraftAdministrativeData_DraftUUID).toBe('string'); // Adjust type check as needed

            expect(item).toHaveProperty('HasActiveEntity');
            expect(item.HasActiveEntity).toBeDefined();
            expect(typeof item.HasActiveEntity).toBe('boolean'); // Adjust type check as needed
          });
        });
      });

      describe('.existsDraft()', () => {
        it('should return "true" when 1 item is found with the specified ID', async () => {
          // Act
          const exists = await bookEventDraftRepository.existsDraft({ ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360' });

          // Assert
          expect(exists).toBe(true); // Ensure the item exists

          // Optional: You can verify that the ID provided corresponds to an actual draft
          const foundDraft = await bookEventDraftRepository.findOneDraft({
            ID: '9b9c5591-52a3-41ea-ab85-40a5a7ae5360',
          });
          expect(foundDraft).toBeDefined();
          expect(foundDraft?.ID).toBe('9b9c5591-52a3-41ea-ab85-40a5a7ae5360'); // Ensure the returned draft has the correct ID
        });
      });

      describe('.countDrafts()', () => {
        it('should return a count number larger than "0"', async () => {
          // Act
          const count = await bookEventDraftRepository.countDrafts();

          // Assert
          expect(count).toBeDefined(); // Ensure the count is defined
          expect(typeof count).toBe('number'); // Check that the count is a number
          expect(count).toBeGreaterThan(0); // Ensure the count is greater than 0
        });
      });
    });
  });
});
