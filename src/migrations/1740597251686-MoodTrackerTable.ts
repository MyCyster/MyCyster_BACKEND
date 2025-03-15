import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMoodTable1739650415584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ENUM type for mood values
    await queryRunner.query(
      `CREATE TYPE "mood_enum" AS ENUM('happy', 'sad', 'anxious', 'blue', 'calm', 'irritated', 'fatigued', 'moody', 'overwhelmed')`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'mood',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'mood',
            type: 'enum',
            enumName: 'mood_enum',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_deleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'mood',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('mood', 'user_id');
    await queryRunner.dropTable('mood');
    await queryRunner.query('DROP TYPE "mood_enum"');
  }
}
