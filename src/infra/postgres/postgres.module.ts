import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../config/validation';
import { ConfigModule } from "@nestjs/config";
import { validate } from '../config/validation';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import * as schema from './tables';
import { DRIZZLE_DB_TAG } from '../consts';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    DrizzlePGModule.registerAsync({
      tag: DRIZZLE_DB_TAG,
      inject: [ConfigService<EnvVariables>],
      useFactory: (configService: ConfigService<EnvVariables>) => ({
        pg: {
          connection: 'client',
          config: {
            user: configService.getOrThrow('POSTGRES_USER'),
            password: configService.getOrThrow('POSTGRES_PASSWORD'),
            host: configService.getOrThrow('POSTGRES_HOST'),
            database: configService.getOrThrow('POSTGRES_DB'),
            port: configService.getOrThrow('POSTGRES_PORT')
          }
        },
        config: {
          schema,
        },
      })
    })
  ],
})
export class PostgresModule {}
