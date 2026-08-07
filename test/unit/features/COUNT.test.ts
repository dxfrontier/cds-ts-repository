import { o } from 'odata';

import { Book } from '#cds-models/CatalogService';

import { Filter } from '../../../lib/util/filter/Filter';
import { getBookRepository } from '../../util/BookRepository';
import { getBookEventRepository } from '../../util/BookEventRepository';
import { startTestServer } from '../../util/util';

/**
 * Feature 1 : efficient count() / countWhere() / exists().
 *
 * These now resolve through a single `count(*)` aggregate row (regular DB branch) instead of
 * materializing every matching row and reading `.length`. The public return types are unchanged
 * (`Promise<number>` / `Promise<boolean>`), so these tests assert the values stay correct.
 */
describe('FEATURE - efficient count / countWhere / exists', () => {
  const { GET } = startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.count()', () => {
    it('should return a numeric count equal to the number of rows in the table', async () => {
      // Arrange
      const all = await bookRepository.getAll();

      // Act
      const count = await bookRepository.count();

      // Assert
      expect(typeof count).toBe('number');
      expect(count).toBe(all!.length);
      expect(count).toBe(6);
    });
  });

  describe('.countWhere()', () => {
    it('should count entries matching the provided keys', async () => {
      // Act
      const count = await bookRepository.countWhere({ currency_code: 'GBP' });

      // Assert
      expect(typeof count).toBe('number');
      expect(count).toBe(3);
    });

    it('should count entries matching a Filter instance', async () => {
      // Arrange
      const filter = new Filter<Book>({ field: 'stock', operator: 'GREATER THAN', value: 12 });

      // Act
      const count = await bookRepository.countWhere(filter);

      // Assert
      expect(count).toBe(3);
    });

    it('should return 0 when no entries match', async () => {
      // Act
      const count = await bookRepository.countWhere({ ID: 99999 });

      // Assert
      expect(count).toBe(0);
    });
  });

  describe('.exists()', () => {
    it('should return true when a matching row exists (by key)', async () => {
      // Act
      const exists = await bookRepository.exists({ ID: 201 });

      // Assert
      expect(exists).toBe(true);
    });

    it('should return true when a matching row exists (by non-key column)', async () => {
      // Act
      const exists = await bookRepository.exists({ currency_code: 'GBP' });

      // Assert
      expect(exists).toBe(true);
    });

    it('should return false when no matching row exists', async () => {
      // Act
      const exists = await bookRepository.exists({ ID: 99999 });

      // Assert
      expect(exists).toBe(false);
    });
  });

  describe('draft variants (shared implementation) - countDrafts / countDraftsWhere / existsDraft', () => {
    let bookEventDraftRepository: Awaited<ReturnType<typeof getBookEventRepository>>;
    const activatedDraftId = '9b9c5591-52a3-41ea-ab85-40a5a7ae5360';

    beforeAll(async () => {
      const {
        config: { baseURL },
      } = await GET('http://www.google.com');

      const activateDraft = async (base: string, uuid: string): Promise<void> => {
        await o(`${base}/odata/v4/catalog/`)
          .post(`BookEvents(ID=${uuid},IsActiveEntity=true)/CatalogService.draftEdit`, {})
          .query();
      };

      if (baseURL != null) {
        await activateDraft(baseURL, activatedDraftId);
        await activateDraft(baseURL, '84c67833-a9cb-450c-ae02-a32c3a7a6f6b');
        await activateDraft(baseURL, '2f4d6e7a-8b18-4a6f-bc3e-9c8d6b74cfe1');
        await activateDraft(baseURL, '3d5e8f7c-6a9b-4d02-af87-91b480a573d1');
      }

      bookEventDraftRepository = await getBookEventRepository();
    });

    it('.countDrafts() should return a positive numeric count', async () => {
      // Arrange
      const all = await bookEventDraftRepository.getAllDrafts();

      // Act
      const count = await bookEventDraftRepository.countDrafts();

      // Assert
      expect(typeof count).toBe('number');
      expect(count).toBe(all!.length);
      expect(count).toBeGreaterThan(0);
    });

    it('.countDraftsWhere() should count matching drafts and return 0 for no match', async () => {
      // Act
      const matching = await bookEventDraftRepository.countDraftsWhere({ types: 'BOOK_LUNCH' });
      const none = await bookEventDraftRepository.countDraftsWhere({
        ID: '00000000-0000-0000-0000-000000000000',
      });

      // Assert
      expect(matching).toBeGreaterThan(0);
      expect(none).toBe(0);
    });

    it('.existsDraft() should return true for an activated draft and false otherwise', async () => {
      // Act
      const exists = await bookEventDraftRepository.existsDraft({ ID: activatedDraftId });
      const missing = await bookEventDraftRepository.existsDraft({
        ID: '00000000-0000-0000-0000-000000000000',
      });

      // Assert
      expect(exists).toBe(true);
      expect(missing).toBe(false);
    });
  });
});
