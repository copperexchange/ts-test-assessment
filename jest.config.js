/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
 
};

module.exports = config;
