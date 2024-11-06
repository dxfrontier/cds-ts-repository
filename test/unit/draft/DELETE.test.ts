import { o } from 'odata';

import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';

const { GET } = startTestServer(__dirname, 'bookshop');

describe('DELETE - drafts', () => {
  let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;

  beforeAll(async () => {
    const {
      config: { baseURL },
    } = await GET('http://www.google.com');

    const _activateDraft = async (baseURL: string, uuid: string) => {
      await o(`${baseURL}/odata/v4/catalog/`)
        .post(`BookEvents(ID=${uuid},IsActiveEntity=true)/CatalogService.draftEdit`, {})
        .query();
    };

    await _activateDraft(baseURL!, '9a8b7c6d-4e3f-2a1b-6c8d-5e9f0a3d1b2a');
    await _activateDraft(baseURL!, 'f47ac10b-58cc-4372-a567-0e02b2c3d479');
    await _activateDraft(baseURL!, '8f7b7b5d-d8ee-48a9-9422-0068cf001244');
    await _activateDraft(baseURL!, '9b9c5591-52a3-41ea-ab85-40a5a7ae5360');

    bookEventDraftRepository = await getBookEventRepository();
  });

  describe('.deleteDraft()', () => {
    it('should successfully delete an item from the table', async () => {
      // Arrange
      const draftIdToDelete = '9a8b7c6d-4e3f-2a1b-6c8d-5e9f0a3d1b2a';
      const initialDrafts = await bookEventDraftRepository.getAllDrafts();
      expect(initialDrafts).toContainEqual(expect.objectContaining({ ID: draftIdToDelete })); // Ensure the draft exists before deletion

      // Act
      const deleteOperation = await bookEventDraftRepository.deleteDraft({ ID: draftIdToDelete });
      const draftsAfterDelete = await bookEventDraftRepository.getAllDrafts();

      // Assert
      expect(deleteOperation).toBe(true);
      expect(draftsAfterDelete?.length).toBeLessThan(initialDrafts!.length); // Ensure one draft is removed
      expect(draftsAfterDelete).not.toContainEqual(expect.objectContaining({ ID: draftIdToDelete })); // Ensure the draft is no longer present
    });
  });

  describe('.deleteManyDrafts()', () => {
    it('should successfully delete multiple items from the table', async () => {
      // Arrange
      const draftIdsToDelete = ['f47ac10b-58cc-4372-a567-0e02b2c3d479', '8f7b7b5d-d8ee-48a9-9422-0068cf001244'];
      const initialDrafts = await bookEventDraftRepository.getAllDrafts();
      draftIdsToDelete.forEach((id) => {
        expect(initialDrafts).toContainEqual(expect.objectContaining({ ID: id })); // Ensure each draft exists before deletion
      });

      // Act
      const deleteOperation = await bookEventDraftRepository.deleteManyDrafts(
        draftIdsToDelete.map((id) => ({ ID: id })),
      );
      const draftsAfterDelete = await bookEventDraftRepository.getAllDrafts();

      // Assert
      expect(deleteOperation).toBe(true);
      expect(draftsAfterDelete?.length).toBeLessThan(initialDrafts!.length); // Ensure multiple drafts are removed
      draftIdsToDelete.forEach((id) => {
        expect(draftsAfterDelete).not.toContainEqual(expect.objectContaining({ ID: id })); // Ensure each draft is no longer present
      });
    });
  });

  describe('.deleteAllDrafts()', () => {
    it('should successfully delete all items from the table', async () => {
      // Arrange
      const initialDrafts = await bookEventDraftRepository.getAllDrafts();
      expect(initialDrafts?.length).toBeGreaterThan(0); // Ensure there are drafts to delete

      // Act
      const deleteOperation = await bookEventDraftRepository.deleteAllDrafts();
      const draftsAfterDelete = await bookEventDraftRepository.getAllDrafts();

      // Assert
      expect(deleteOperation).toBe(true);
      expect(draftsAfterDelete?.length).toBe(0); // Ensure no drafts are left
    });
  });
});
