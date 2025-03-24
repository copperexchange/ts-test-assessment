import { injectable } from 'tsyringe';
import Test from '../datamodel/test';
import { Db } from '../utils/db';

@injectable()
export default class TestRepository {
  constructor(private db: Db) {}

  async getById(id: string): Promise<Test> {
    return (await this.db.query(`
      SELECT * FROM test
      WHERE id = :id
    `, Test, { id }))[0];
  }

  async insertMany(data: Test[]): Promise<Test[]> {
    return await this.db.bulkInsert(
      'INSERT INTO test (id, val) VALUES %L RETURNING *',
      Test, data.map((test) => [test.id, test.val]),
    );
  }
}
