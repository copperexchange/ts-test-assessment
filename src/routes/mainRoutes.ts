import express from 'express';
import http from 'http';
import { singleton } from 'tsyringe';
import TestRoutes from './testRoutes';

@singleton()
export default class MainRoutes {
  private app: express.Express;
  private server: http.Server;

  constructor(
    private testRoutes: TestRoutes,
  ) {
    this.app = express();
    this.app.use('/test', testRoutes.routes());
  }

  init(): void {
    this.server = this.app.listen(3000, () => {
      console.info('Server is running at PORT:', 3000);
    });
  }

  close(): void {
    this.server.close();
  }
}
