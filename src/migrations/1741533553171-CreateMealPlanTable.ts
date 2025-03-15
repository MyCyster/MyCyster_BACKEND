import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMealPlanTable1741533553171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'meal_plan',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'meal_types',
            type: 'text[]',
          },
          {
            name: 'days_count',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'calorie_goal',
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
            name: 'dietary_restrictions',
            type: 'text',
            isNullable: true,
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
      'meal_plan',
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
    const table = await queryRunner.getTable('meal_plan');
    const foreignKey = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('user_id'),
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('meal_plan', foreignKey);
    }
    await queryRunner.dropTable('meal_plan');
  }
}
