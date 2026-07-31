import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';

describe('INSERT - drafts', () => {
  startTestServer(__dirname, 'bookshop');

  let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;

  beforeAll(async () => {
    bookEventDraftRepository = await getBookEventRepository();
  });

  describe('.createDraft()', () => {
    it('should create a draft row with an auto-generated DraftAdministrativeData_DraftUUID and HasActiveEntity defaulted to false', async () => {
      // Arrange
      const draftId = 'e0000000-0000-4000-8000-000000000001';
      const entry = {
        ID: draftId,
        name: 'Minimal Draft Event',
        types: 'BOOK_SIGNING',
      };

      // Act
      const insertResult = await bookEventDraftRepository.createDraft(entry);
      const created = await bookEventDraftRepository.findOneDraft({ ID: draftId });

      // Assert
      expect(insertResult.query.INSERT.entries).toHaveLength(1);
      expect(insertResult.query.INSERT.entries[0]).toMatchObject({
        ID: draftId,
        name: 'Minimal Draft Event',
        types: 'BOOK_SIGNING',
      });

      expect(created).toBeDefined();
      expect(created).toMatchObject({
        ID: draftId,
        name: 'Minimal Draft Event',
        types: 'BOOK_SIGNING',
      });
      expect(created?.HasActiveEntity).toBe(false);
      expect(created?.DraftAdministrativeData_DraftUUID).toBeDefined();

      // normalizeDraftEntry must not mutate the caller's object
      expect(entry).not.toHaveProperty('DraftAdministrativeData_DraftUUID');
      expect(entry).not.toHaveProperty('HasActiveEntity');
    });

    it('should honor a caller-provided DraftAdministrativeData_DraftUUID and HasActiveEntity without overwriting them', async () => {
      // Arrange
      const draftId = 'e0000000-0000-4000-8000-000000000002';
      const providedDraftUuid = 'e0000000-0000-4000-8000-000000000003';

      // Act
      await bookEventDraftRepository.createDraft({
        ID: draftId,
        name: 'Explicit Draft Event',
        types: 'AUTHOR_TALK',
        DraftAdministrativeData_DraftUUID: providedDraftUuid,
        HasActiveEntity: true,
      });
      const created = await bookEventDraftRepository.findOneDraft({ ID: draftId });

      // Assert
      expect(created).toBeDefined();
      expect(created?.DraftAdministrativeData_DraftUUID).toBe(providedDraftUuid);
      expect(created?.HasActiveEntity).toBe(true);
    });
  });

  describe('.createManyDrafts()', () => {
    it('should create multiple draft rows with distinct auto-generated DraftAdministrativeData_DraftUUID values - .createManyDrafts({}, {})', async () => {
      // Arrange
      const firstId = 'e0000000-0000-4000-8000-000000000004';
      const secondId = 'e0000000-0000-4000-8000-000000000005';

      // Act
      const createManyResult = await bookEventDraftRepository.createManyDrafts(
        { ID: firstId, name: 'Batch Draft Event 1', types: 'BOOK_SIGNING' },
        { ID: secondId, name: 'Batch Draft Event 2', types: 'BOOK_LUNCH' },
      );

      const firstDraft = await bookEventDraftRepository.findOneDraft({ ID: firstId });
      const secondDraft = await bookEventDraftRepository.findOneDraft({ ID: secondId });

      // Assert
      expect(createManyResult.query.INSERT.entries).toHaveLength(2);
      expect(createManyResult.query.INSERT.entries[0]).toMatchObject({
        ID: firstId,
        name: 'Batch Draft Event 1',
        types: 'BOOK_SIGNING',
      });
      expect(createManyResult.query.INSERT.entries[1]).toMatchObject({
        ID: secondId,
        name: 'Batch Draft Event 2',
        types: 'BOOK_LUNCH',
      });

      expect(firstDraft).toBeDefined();
      expect(secondDraft).toBeDefined();
      expect(firstDraft?.HasActiveEntity).toBe(false);
      expect(secondDraft?.HasActiveEntity).toBe(false);
      expect(firstDraft?.DraftAdministrativeData_DraftUUID).toBeDefined();
      expect(secondDraft?.DraftAdministrativeData_DraftUUID).toBeDefined();
      expect(firstDraft?.DraftAdministrativeData_DraftUUID).not.toBe(secondDraft?.DraftAdministrativeData_DraftUUID);
    });

    it('should create multiple draft rows in the database - .createManyDrafts([{}, {}])', async () => {
      // Arrange
      const firstId = 'e0000000-0000-4000-8000-000000000006';
      const secondId = 'e0000000-0000-4000-8000-000000000007';

      // Act
      const createManyResult = await bookEventDraftRepository.createManyDrafts([
        { ID: firstId, name: 'Array Form Draft Event 1', types: 'BOOK_SIGNING' },
        { ID: secondId, name: 'Array Form Draft Event 2', types: 'BOOK_LUNCH' },
      ]);

      const firstDraft = await bookEventDraftRepository.findOneDraft({ ID: firstId });
      const secondDraft = await bookEventDraftRepository.findOneDraft({ ID: secondId });

      // Assert
      expect(createManyResult.query.INSERT.entries).toHaveLength(2);
      expect(firstDraft).toBeDefined();
      expect(secondDraft).toBeDefined();
      expect(firstDraft?.DraftAdministrativeData_DraftUUID).toBeDefined();
      expect(secondDraft?.DraftAdministrativeData_DraftUUID).toBeDefined();
      expect(firstDraft?.DraftAdministrativeData_DraftUUID).not.toBe(secondDraft?.DraftAdministrativeData_DraftUUID);
    });
  });
});
