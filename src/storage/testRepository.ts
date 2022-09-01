import { injectable } from 'tsyringe';
import Test from '../datamodel/test';
import { Db } from '../utils/db';


@injectable()
export default class TestRepository {
  constructor(private db: Db) {}

  async getById(id: string): Promise<Test> {
    return (await this.db.query(`
      SELECT * FROM test
      WHERE id = $id
    `, Test, { id }))[0];
  }
}
