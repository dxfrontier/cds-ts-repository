import { o } from 'odata';

import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';

const { GET } = startTestServer(__dirname, 'bookshop');

describe('UPDATE - drafts', () => {
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

    await _activateDraft(baseURL!, '7e9b3cd2-1f78-4d48-8b0f-6a62dcf0f592');
    await _activateDraft(baseURL!, '3d5e8f7c-6a9b-4d02-af87-91b480a573d1');

    bookEventDraftRepository = await getBookEventRepository();
  });

  describe('.updateDraft()', () => {
    it('should successfully update an item in the database', async () => {
      // Arrange
      const draftIdToUpdate = '3d5e8f7c-6a9b-4d02-af87-91b480a573d1';
      const newDraftData = { name: 'a new name' };

      const originalDraft = await bookEventDraftRepository.findOneDraft({ ID: draftIdToUpdate });
      expect(originalDraft).toBeDefined(); // Ensure the original draft exists

      // Act
      const updateResult = await bookEventDraftRepository.updateDraft({ ID: draftIdToUpdate }, newDraftData);
      const updatedDraft = await bookEventDraftRepository.findOneDraft({ ID: draftIdToUpdate });

      // Assert
      expect(updateResult).toBe(true); // Ensure the update operation was successful
      expect(updatedDraft).toBeDefined(); // Ensure the updated draft exists
      expect(updatedDraft).toMatchObject(newDraftData); // Check if the updated properties are correct
      expect(originalDraft).not.toMatchObject(updatedDraft!); // Ensure the original draft and updated draft are not the same
    });
  });
});
