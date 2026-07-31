// The default `node:sqlite` driver of cds 10 cannot stream on Node 22 (`stmt.setReturnArrays is not
// a function`), so the streaming suite is forced onto `better-sqlite3`. Setting the variable here is
// enough (even though the requires are hoisted above it by the transpiler) because `cds.env`
// materializes lazily, on its first access when the test server boots.
// `Note`: the variable stays set for the whole jest worker, so the suites scheduled after this one
// in the same worker also run on `better-sqlite3` - harmless today, as both drivers pass them.
process.env.cds_requires_db_driver = 'better-sqlite3';

import { PassThrough } from 'stream';

import { Book } from '#cds-models/CatalogService';

import { CoreRepository } from '../../../lib/core/CoreRepository';
import { Filter } from '../../../lib/util/filter/Filter';
import { createFakeExternalService } from '../../util/fakeExternalService';
import { getBookRepository } from '../../util/BookRepository';
import { startTestServer } from '../../util/util';

import type { Entity } from '../../../lib/types/types';

type FakeEntity = { ID?: number; name?: string };

const externalEntity: Entity = { name: 'EXTERNAL.FakeEntity' };

/**
 * Collects the bytes emitted by a readable/writable stream and parses them as the `JSON` array
 * `.pipeline()` / `.stream()` are serializing the results into.
 */
const collect = async (stream: NodeJS.ReadableStream): Promise<unknown[]> => {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
};

describe('SELECT', () => {
  startTestServer(__dirname, 'bookshop');
  let bookRepository: Awaited<ReturnType<typeof getBookRepository>>;

  beforeAll(async () => {
    bookRepository = await getBookRepository();
  });

  describe('.builder().find()', () => {
    describe('======> .forEach()', () => {
      it('should call the callback for every row of the table', async () => {
        // Arrange
        const rows: Book[] = [];

        // Act
        await bookRepository
          .builder()
          .find()
          .orderAsc('ID')
          .forEach((row) => rows.push(row));

        // Assert
        expect(rows.length).toEqual(6);
        expect(rows[0].ID).toEqual(201);
        expect(rows[0].title).toEqual('Wuthering Heights');
      });

      it('should call the callback only for the rows matching the filter', async () => {
        // Arrange
        const filter = new Filter<Book>({
          field: 'currency_code',
          operator: 'EQUALS',
          value: 'GBP',
        });

        const ids: (number | undefined)[] = [];

        // Act
        await bookRepository
          .builder()
          .find(filter)
          .orderAsc('ID')
          .forEach((row) => ids.push(row.ID));

        // Assert
        expect(ids).toEqual([201, 203, 207]);
      });

      it('should await an async callback before resolving', async () => {
        // Arrange
        const processed: (number | undefined)[] = [];

        // Act
        await bookRepository
          .builder()
          .find()
          .orderAsc('ID')
          .forEach(async (row) => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            processed.push(row.ID);
          });

        // Assert : every row was fully processed by the time '.forEach()' resolved
        expect(processed).toEqual([201, 203, 207, 251, 252, 271]);
      });

      it('should throw an error when an external service is used', async () => {
        // Arrange
        const repository = new CoreRepository<FakeEntity>(externalEntity, createFakeExternalService());

        // Act + Assert
        await expect(
          repository
            .builder()
            .find()
            .forEach(() => undefined),
        ).rejects.toThrow('forEach is currently not supported on External services !');
      });
    });

    describe('======> .pipeline()', () => {
      it('should write the serialized results into the destination stream', async () => {
        // Arrange
        const destination = new PassThrough();
        const written = collect(destination);

        // Act
        await bookRepository.builder().find().orderAsc('ID').pipeline(destination);

        // Assert
        const results = (await written) as Book[];

        expect(results.length).toEqual(6);
        expect(results[0].ID).toEqual(201);
      });

      it('should write only the rows matching the filter into the destination stream', async () => {
        // Arrange
        const filter = new Filter<Book>({
          field: 'currency_code',
          operator: 'EQUALS',
          value: 'USD',
        });

        const destination = new PassThrough();
        const written = collect(destination);

        // Act
        await bookRepository.builder().find(filter).orderAsc('ID').pipeline(destination);

        // Assert
        const results = (await written) as Book[];

        expect(results.map((result) => result.ID)).toEqual([251, 252]);
      });

      it('should throw an error when an external service is used', async () => {
        // Arrange
        const repository = new CoreRepository<FakeEntity>(externalEntity, createFakeExternalService());

        // Act + Assert
        await expect(repository.builder().find().pipeline(new PassThrough())).rejects.toThrow(
          'pipeline is currently not supported on External services !',
        );
      });
    });

    describe('======> .stream()', () => {
      it('should return a readable stream emitting the serialized results', async () => {
        // Act
        const stream = bookRepository.builder().find().orderAsc('ID').stream();

        // Assert
        const results = (await collect(stream)) as Book[];

        expect(results.length).toEqual(6);
        expect(results[5].ID).toEqual(271);
        expect(results[5].title).toEqual('Catweazle');
      });

      it('should compose with .columns(), .orderAsc() and .paginate()', async () => {
        // Act
        const stream = bookRepository.builder().find().columns('ID').orderAsc('ID').paginate({ limit: 3 }).stream();

        // Assert
        const results = await collect(stream);

        expect(results).toEqual([{ ID: 201 }, { ID: 203 }, { ID: 207 }]);
      });

      it('should emit the query error on the stream instead of rejecting unhandled', async () => {
        // Arrange : the stream is handed over before the query runs, so a failing query can only be
        // reported on the stream itself
        const stream = bookRepository
          .builder()
          .find()
          .columns('nonExistingColumn' as never)
          .stream();

        // Act
        const error = await new Promise<Error>((resolve) => stream.on('error', resolve));

        // Assert
        expect(error).toBeInstanceOf(Error);
      });

      it('should throw an error when an external service is used', () => {
        // Arrange
        const repository = new CoreRepository<FakeEntity>(externalEntity, createFakeExternalService());

        // Act + Assert
        expect(() => repository.builder().find().stream()).toThrow(
          'stream is currently not supported on External services !',
        );
      });
    });
  });
});
