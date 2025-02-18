import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1739650415583 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, create the uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'email_verification_code',
            type: 'varchar',
            isNullable: true,
            default: null, // Changed from true to null since default: true doesn't make sense for varchar
          },
          {
            name: 'is_email_verified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reset_password_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'reset_password_expiration',
            type: 'date',
            isNullable: true, // Added isNullable since this might not be set initially
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
