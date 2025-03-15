import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Mood } from './mood-tracker/entities/mood.entity';
import { Users } from './user/entities/user.entity';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [Mood, Users],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
