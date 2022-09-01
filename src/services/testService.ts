import { autoInjectable } from 'tsyringe';
import TestRepository from '../storage/testRepository';
import Test from '../datamodel/test';

@autoInjectable()
export default class TestService {
  constructor(
    private testRepository: TestRepository,
  ) {}

  async getInfo(): Promise<Test> {
    return this.testRepository.getById('1');
  }
}
