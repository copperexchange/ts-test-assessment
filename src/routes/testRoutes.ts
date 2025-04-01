import { singleton } from 'tsyringe';
import TestService from '../services/testService';
import { Request, Response, Router } from 'express';

@singleton()
export default class TestRoutes {
  constructor(
    private testService: TestService,
  ) {}

  routes(): Router {
    return Router()
      .get('/', async (_req: Request, res: Response) => {
        const resp = await this.testService.getInfo();
        res.send(resp);
      });
  }
}
