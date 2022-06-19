import path from 'node:path';
import { Sequelize } from 'sequelize';

const databaseConnection = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: path.join(process.cwd(), 'data/database.sqlite'),
});

export = databaseConnection;
