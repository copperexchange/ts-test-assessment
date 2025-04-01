import { injectable } from 'tsyringe';
import TestRepository from '../storage/testRepository';
import Test from '../datamodel/test';

@injectable()
export default class TestService {
  constructor(
    private testRepository: TestRepository,
  ) {}

  async getInfo(): Promise<Test> {
    return this.testRepository.getById('1');
  }

  async insertMany(data: Test[]): Promise<Test[]> {
    return this.testRepository.insertMany(data);
  }
}
