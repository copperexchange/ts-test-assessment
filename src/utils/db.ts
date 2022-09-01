import { singleton } from 'tsyringe';
import { instanceToPlain, plainToInstance, ClassConstructor } from 'class-transformer';
import { IConfig } from 'config';
import format from 'pg-format';
import config from 'config';

const { Pool } = require('pg');
const pgNamed = require('node-postgres-named');
const camelcaseKeys = require('camelcase-keys');

function singleQuery<T>(client: any, query: string, mapper: ClassConstructor<T>, params?: { [key: string]: any }): Promise<T[]> {
  return client.query(query, instanceToPlain(params)).then((res: any) => {
    if (typeof res.rows !== 'undefined') {
      return camelcaseKeys(res.rows).map((row: any) => plainToInstance(mapper, row));
    }
    return res;
  });
}

function bulkQuery<T>(client: any, query: string, mapper: ClassConstructor<T>, params?: any[]): Promise<T[]> {
  if ((params?.length ?? 0) !== 0) {
    return client.query(format(query, params)).then((res: any) => {
      if (typeof res.rows !== 'undefined') {
        return camelcaseKeys(res.rows).map((row: any) => plainToInstance(mapper, row));
      }
      return res;
    });
  }

  return Promise.resolve([]);
}

@singleton()
export class Db {
  private readonly db: any;

  constructor() {
    const options = config.get<IConfig>('db');

    this.db = new Pool({
      user: options.get<string>('user'),
      host: options.get<string>('host'),
      database: options.get<string>('database'),
      password: options.get<string>('password'),
      port: options.get<string>('port'),
      max: options.get<number>('maxActive'),
      connectionTimeoutMillis: options.get<number>('connectionTimeout'),
    });
    pgNamed.patch(this.db);
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
    pgNamed.patch(client);

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
}
