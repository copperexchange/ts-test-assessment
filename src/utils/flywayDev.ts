import 'reflect-metadata';
import config from 'config';

const dbConf = config.get<any>('db');

const resolve = () => ({
  flywayArgs: {
    url: `jdbc:postgresql://${dbConf.get('host')}:${dbConf.get('port')}/${dbConf.get('database')}`,
    schemas: 'public',
    locations: 'filesystem:migration',
    user: dbConf.get('user'),
    password: dbConf.get('password'),
    sqlMigrationSuffixes: '.sql',
  },
  version: '9.1.6',
  downloads: {
    expirationTimeInMs: -1,
  },
});

module.exports = resolve;
