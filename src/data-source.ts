import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Prompt } from './prompts/entities/prompt.entity';
import { User } from './prompts/entities/user.entity';

/**
 * Single source of truth for TypeORM configuration.
 *
 * Imported by:
 *   - app.module.ts (runtime, via TypeOrmModule.forRoot)
 *   - the TypeORM CLI (via the default DataSource export below)
 *
 * Change config here and both the running app and migration commands pick it up.
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  ssl: true,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'prompt_api',
  entities: [Prompt, User],
  synchronize: false,
  migrations: [__dirname + '/migration/**/*{.js,.ts}'],

  // optional
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
};

/**
 * Default export used by the TypeORM CLI:
 *   typeorm-ts-node-commonjs -d src/data-source.ts migration:generate ...
 */
export default new DataSource(dataSourceOptions);
