import { Model, DataTypes } from 'sequelize';
import database from '../Connection';

export interface InfoData {
  name: string | null;
  title: string | null;
  content: string | null;
  aliases: string;
  link: string;
  image: string;
}

export class Infos extends Model<InfoData> {
  declare name: string;

  declare title: string;

  declare content: string;

  declare aliases: string;

  declare link: string;

  declare image: string;
}

Infos.init({
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  title: DataTypes.STRING,
  content: DataTypes.STRING,
  aliases: DataTypes.STRING,
  link: DataTypes.STRING,
  image: DataTypes.STRING,
}, {
  sequelize: database,
  tableName: 'infos',
});
