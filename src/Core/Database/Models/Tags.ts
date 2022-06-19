import { Model, DataTypes } from 'sequelize';
import database from '../Connection';

export interface TagData {
  name: string | null;
  description: string | null;
  username: string | null;
  usage_count: number;
}

export class Tag extends Model<TagData> {
  declare data: TagData;

  declare name: string;

  declare description: string;

  declare username: string;

  declare usage_count: number;
}

Tag.init({
  name: {
    type: DataTypes.STRING,
    unique: true,
  },
  description: DataTypes.TEXT,
  username: DataTypes.STRING,
  usage_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
}, {
  sequelize: database,
  tableName: 'tags',
});
