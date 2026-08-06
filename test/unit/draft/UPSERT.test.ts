import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';

describe('UPSERT - drafts', () => {
  startTestServer(__dirname, 'bookshop');

  let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;

  beforeAll(async () => {
    bookEventDraftRepository = await getBookEventRepository();
  });

  describe('.updateOrCreateDraft()', () => {
    it('should create a new draft row when it does not exist yet', async () => {
      // Arrange
      const draftId = 'e0000000-0000-4000-8000-000000000008';

      // Act
      const result = await bookEventDraftRepository.updateOrCreateDraft({
        ID: draftId,
        name: 'Upsert Draft Event',
        types: 'BOOK_SIGNING',
      });
      const created = await bookEventDraftRepository.findOneDraft({ ID: draftId });

      // Assert
      expect(result).toBe(true);
      expect(created).toBeDefined();
      expect(created?.name).toBe('Upsert Draft Event');
      // updateOrCreateDraft never defaults HasActiveEntity (unlike createDraft/createManyDrafts): on
      // the create path of an upsert it stays NULL unless the caller provides it (column is nullable).
      expect(created?.HasActiveEntity).toBeNull();
      expect(created?.DraftAdministrativeData_DraftUUID).toBeDefined();
    });

    it('should update the same draft row on a second call, preserving the DraftAdministrativeData_DraftUUID when passed back', async () => {
      // Arrange
      const draftId = 'e0000000-0000-4000-8000-000000000008';
      const existingDraft = await bookEventDraftRepository.findOneDraft({ ID: draftId });
      const existingDraftUuid = existingDraft!.DraftAdministrativeData_DraftUUID;

      // Act
      const result = await bookEventDraftRepository.updateOrCreateDraft({
        ID: draftId,
        name: 'Upsert Draft Event - updated',
        types: 'BOOK_SIGNING',
        DraftAdministrativeData_DraftUUID: existingDraftUuid,
      });
      const updated = await bookEventDraftRepository.findOneDraft({ ID: draftId });

      // Assert
      expect(result).toBe(true);
      expect(updated?.name).toBe('Upsert Draft Event - updated');
      expect(updated?.DraftAdministrativeData_DraftUUID).toBe(existingDraftUuid);
    });

    it('should create and update draft rows in the same mixed batch call', async () => {
      // Arrange
      const existingId = 'e0000000-0000-4000-8000-000000000009';
      const newId = 'e0000000-0000-4000-8000-000000000010';

      await bookEventDraftRepository.updateOrCreateDraft({
        ID: existingId,
        name: 'Existing Draft Before Batch',
        types: 'BOOK_SIGNING',
      });

      // Act
      const result = await bookEventDraftRepository.updateOrCreateDraft(
        { ID: existingId, name: 'Existing Draft After Batch', types: 'BOOK_SIGNING' },
        { ID: newId, name: 'Brand New Draft In Batch', types: 'AUTHOR_TALK' },
      );

      const existing = await bookEventDraftRepository.findOneDraft({ ID: existingId });
      const created = await bookEventDraftRepository.findOneDraft({ ID: newId });

      // Assert
      expect(result).toBe(true);
      expect(existing?.name).toBe('Existing Draft After Batch');
      expect(created).toBeDefined();
      expect(created?.name).toBe('Brand New Draft In Batch');
      // Same as the single-entry create path: HasActiveEntity is never defaulted by
      // updateOrCreateDraft, so the newly-created row's column stays NULL.
      expect(created?.HasActiveEntity).toBeNull();
      expect(created?.DraftAdministrativeData_DraftUUID).toBeDefined();
    });

    it('should create multiple draft rows using the single-array form - .updateOrCreateDraft([{}, {}])', async () => {
      // Arrange
      const firstId = 'e0000000-0000-4000-8000-000000000011';
      const secondId = 'e0000000-0000-4000-8000-000000000012';

      // Act
      const result = await bookEventDraftRepository.updateOrCreateDraft([
        { ID: firstId, name: 'Array Form Upsert Event 1', types: 'BOOK_SIGNING' },
        { ID: secondId, name: 'Array Form Upsert Event 2', types: 'BOOK_LUNCH' },
      ]);

      const firstDraft = await bookEventDraftRepository.findOneDraft({ ID: firstId });
      const secondDraft = await bookEventDraftRepository.findOneDraft({ ID: secondId });

      // Assert
      expect(result).toBe(true);
      expect(firstDraft).toBeDefined();
      expect(secondDraft).toBeDefined();
      expect(firstDraft?.name).toBe('Array Form Upsert Event 1');
      expect(secondDraft?.name).toBe('Array Form Upsert Event 2');
      expect(firstDraft?.DraftAdministrativeData_DraftUUID).toBeDefined();
      expect(secondDraft?.DraftAdministrativeData_DraftUUID).toBeDefined();
      expect(firstDraft?.DraftAdministrativeData_DraftUUID).not.toBe(secondDraft?.DraftAdministrativeData_DraftUUID);
    });

    it('should leave HasActiveEntity untouched on update when the caller omits it', async () => {
      // Arrange: a draft activated through the Fiori draftEdit flow has HasActiveEntity: true -
      // simulate that starting state directly via createDraft.
      const draftId = 'e0000000-0000-4000-8000-000000000013';

      await bookEventDraftRepository.createDraft({
        ID: draftId,
        name: 'Active Linked Draft',
        types: 'BOOK_SIGNING',
        HasActiveEntity: true,
      });
      const before = await bookEventDraftRepository.findOneDraft({ ID: draftId });
      const existingDraftUuid = before!.DraftAdministrativeData_DraftUUID;

      // Act: a partial update via updateOrCreateDraft that omits HasActiveEntity entirely.
      const result = await bookEventDraftRepository.updateOrCreateDraft({
        ID: draftId,
        DraftAdministrativeData_DraftUUID: existingDraftUuid,
        name: 'Active Linked Draft - renamed',
      });
      const after = await bookEventDraftRepository.findOneDraft({ ID: draftId });

      // Assert
      expect(result).toBe(true);
      expect(after?.name).toBe('Active Linked Draft - renamed');
      expect(after?.HasActiveEntity).toBe(true);
    });
  });
});
