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
      const findAnItem = await bookEventDraftRepository.findOneDraft({ ID: '7e9b3cd2-1f78-4d48-8b0f-6a62dcf0f592' });

      // Act
      const updatedItem = await bookEventDraftRepository.updateDraft(
        { ID: '3d5e8f7c-6a9b-4d02-af87-91b480a573d1' },
        { name: ' a new name' },
      );
      const findAnItemAfterUpdate = await bookEventDraftRepository.findOneDraft({
        ID: '3d5e8f7c-6a9b-4d02-af87-91b480a573d1',
      });

      // Assert
      expect(updatedItem).toBe(true);
      expect(findAnItem).not.toMatchObject(findAnItemAfterUpdate!);
    });
  });
});
