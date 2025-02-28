import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import appConfig from './config/app.config';
import * as dotenv from 'dotenv';
import { MoodTrackerModule } from './mood-tracker/mood-tracker.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    AuthModule,
    UserModule,
    MoodTrackerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
