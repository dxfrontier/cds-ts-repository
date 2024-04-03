import { o } from 'odata';

import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';

describe('DELETE - drafts', () => {
  const { GET } = startTestServer(__dirname, 'bookshop');
  let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;

  beforeAll(async () => {
    const {
      config: { baseURL },
    } = await GET('https://www.abs-gmbh.de/');

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
      const getAll = await bookEventDraftRepository.getAllDrafts();

      // Act
      const deleteOperation = await bookEventDraftRepository.deleteDraft({
        ID: '9a8b7c6d-4e3f-2a1b-6c8d-5e9f0a3d1b2a',
      });
      const getAllAfter = await bookEventDraftRepository.getAllDrafts();

      // Assert
      expect(deleteOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });
  });

  describe('.deleteManyDrafts()', () => {
    it('should successfully delete multiple items from the table', async () => {
      // Act
      const getAll = await bookEventDraftRepository.getAllDrafts();
      const deleteAllOperation = await bookEventDraftRepository.deleteManyDrafts([
        { ID: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' },
        { ID: '8f7b7b5d-d8ee-48a9-9422-0068cf001244' },
      ]);
      const getAllAfter = await bookEventDraftRepository.getAllDrafts();

      // Assert
      expect(deleteAllOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });
  });

  describe('.deleteAllDrafts()', () => {
    it('should successfully delete all items from the table', async () => {
      // Act
      const getAll = await bookEventDraftRepository.getAllDrafts();
      const deleteAllOperation = await bookEventDraftRepository.deleteAllDrafts();
      const getAllAfter = await bookEventDraftRepository.getAllDrafts();

      // Assert
      expect(deleteAllOperation).toBe(true);
      expect(getAll!.length).toBeGreaterThan(getAllAfter!.length);
    });
  });
});
