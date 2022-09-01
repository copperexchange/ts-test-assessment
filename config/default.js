module.exports = {
  db: {
    host: 'localhost',
    port: 5432,
    database: 'test',
    user: 'postgres',
    password: '1234',
    initialSize: 2,
    maxActive: 128,
    connectionTimeout: 3000,
  },
};
