import express from 'express';
import { autoInjectable, singleton } from 'tsyringe';
import TestRoutes from './testRoutes';

@autoInjectable()
@singleton()
export default class MainRoutes {
  private app: any;

  constructor(
    private testRoutes: TestRoutes,
  ) {
    this.app = express();
    this.app.use('/test', testRoutes.routes());
  }

  init() {
    this.app.listen(3000, () => {
      console.info('Server is running at PORT:', 3000);
    });
  }
}
