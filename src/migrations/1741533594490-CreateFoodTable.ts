import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFoodTable1741533594490 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'food',
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
            type: 'text',
            isNullable: false,
          },
          {
            name: 'meal_type',
            type: 'text', // Breakfast, Lunch, Dinner, Snack
            isNullable: false,
          },
          {
            name: 'calories',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'protein',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'carbohydrates',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'fats',
            type: 'integer',
            isNullable: false,
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
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('food');
  }
}
