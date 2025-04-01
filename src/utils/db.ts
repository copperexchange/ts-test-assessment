import { singleton } from 'tsyringe';
import { instanceToPlain, plainToInstance, ClassConstructor } from 'class-transformer';
import config, { IConfig } from 'config';
import format from 'pg-format';
import { ClientBase, Pool } from 'pg';
import camelcaseKeys from 'camelcase-keys';
import { pg as parameterize } from 'yesql';

type DbClient = ClientBase | Pool;

async function singleQuery<T>(client: DbClient, query: string, mapper: ClassConstructor<T>, params?: { [key: string]: any }): Promise<T[]> {
  const result = await client.query(parameterize(query)(instanceToPlain(params)));

  if (typeof result.rows !== 'undefined') {
    return camelcaseKeys(result.rows).map((row: any) => plainToInstance(mapper, row));
  }

  return result.rows;
}

async function bulkQuery<T>(client: DbClient, query: string, mapper: ClassConstructor<T>, params?: any[]): Promise<T[]> {
  if ((params?.length ?? 0) !== 0) {
    const result = await client.query(format(query, params));

    if (typeof result.rows !== 'undefined') {
      return camelcaseKeys(result.rows).map((row: any) => plainToInstance(mapper, row));
    }

    return result.rows;
  }

  return Promise.resolve([]);
}

@singleton()
export class Db {
  private readonly db: Pool;

  constructor() {
    const options = config.get<IConfig>('db');

    this.db = new Pool({
      user: options.get<string>('user'),
      host: options.get<string>('host'),
      database: options.get<string>('database'),
      password: options.get<string>('password'),
      port: options.get<number>('port'),
      max: options.get<number>('maxActive'),
      connectionTimeoutMillis: options.get<number>('connectionTimeout'),
    });
  }

  query<T>(query: string, mapper: ClassConstructor<T>, params?: { [key: string]: any }): Promise<T[]> {
    return singleQuery(this.db, query, mapper, params);
  }

  bulkInsert<T>(query: string, mapper: ClassConstructor<T>, params?: any[]): Promise<T[]> {
    return bulkQuery(this.db, query, mapper, params);
  }

  async transactional(f: (client: {
    query: <T>(query: string, mapper: ClassConstructor<T>, params?: { [p: string]: any }) => Promise<T[]>;
    bulkInsert: <T>(query: string, mapper: ClassConstructor<T>, params?: any[]) => Promise<T[]> }) => Promise<any>) {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // eslint-disable-next-line max-len
      const single = <T>(query: string, mapper: ClassConstructor<T>, params?: { [key: string]: any }): Promise<T[]> => singleQuery(client, query, mapper, params);

      const bulk = <T>(query: string, mapper: ClassConstructor<T>, params?: any[]): Promise<T[]> => bulkQuery(client, query, mapper, params);

      const res = await f({ query: single, bulkInsert: bulk });

      await client.query('COMMIT');

      return res;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async close() {
    await this.db.end();
  }
}
