import 'reflect-metadata';
import child_process from 'child_process';
import { container } from 'tsyringe';
import MainRoutes from './routes/mainRoutes';

const start = async () => {
  child_process.execSync('flyway -c ./dist/utils/flywayDev migrate', { stdio: 'inherit' });

  const router = container.resolve(MainRoutes);
  router.init();
};

start();
