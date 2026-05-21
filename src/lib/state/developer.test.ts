import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

describe('updateDeveloper', () => {
  let tmpDir: string;
  let tmpDb: string;
  let updateDeveloper: typeof import('./developer').updateDeveloper;
  let getDeveloper: typeof import('./developer').getDeveloper;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'alks-developer-test-'));
    tmpDb = path.join(tmpDir, 'alks.db');
    process.env.ALKS_DB = tmpDb;
    jest.resetModules();
    const mod = require('./developer');
    updateDeveloper = mod.updateDeveloper;
    getDeveloper = mod.getDeveloper;
  });

  afterEach(async () => {
    delete process.env.ALKS_DB;
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('persists server when no DB file exists yet', async () => {
    await updateDeveloper({ server: 'https://example.com/rest' });

    const dev = await getDeveloper();
    expect(dev.server).toBe('https://example.com/rest');
  });

  it('preserves existing fields when updating a different field', async () => {
    await updateDeveloper({
      server: 'https://example.com/rest',
      userid: 'bobby',
    });
    await updateDeveloper({ outputFormat: 'json' });

    const dev = await getDeveloper();
    expect(dev.server).toBe('https://example.com/rest');
    expect(dev.userid).toBe('bobby');
    expect(dev.outputFormat).toBe('json');
  });

  // Regression test for the double-loadDatabase bug.
  // When the DB file exists with an empty account collection (zero records),
  // getDeveloper returns a fresh `{}` object — not a reference into the live
  // collection. Under the old code, getCollection was called *before*
  // getDeveloper, so the collection reference used for the write was orphaned
  // by the second loadDatabase. The orphaned insert was never serialized and
  // db.save() wrote an empty collection back to disk, silently dropping the
  // new server value.
  it('persists server when the DB file has an empty account collection', async () => {
    // Pre-seed the file with an empty account collection — the state that
    // triggers the bug. Use LokiJS directly so the on-disk format includes
    // all the collection metadata LokiJS needs to deserialize.
    const Loki = require('lokijs');
    await new Promise<void>((resolve, reject) => {
      const seedDb = new Loki(tmpDb);
      seedDb.addCollection('account');
      seedDb.saveDatabase((err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Reload modules so the production code opens the seeded file fresh
    jest.resetModules();
    const mod = require('./developer');

    await mod.updateDeveloper({ server: 'https://example.com/rest' });

    const dev = await mod.getDeveloper();
    expect(dev.server).toBe('https://example.com/rest');
  });

  it('updates an existing field rather than appending a duplicate', async () => {
    await updateDeveloper({ server: 'https://old.example.com/rest' });
    await updateDeveloper({ server: 'https://new.example.com/rest' });

    const dev = await getDeveloper();
    expect(dev.server).toBe('https://new.example.com/rest');
  });
});
