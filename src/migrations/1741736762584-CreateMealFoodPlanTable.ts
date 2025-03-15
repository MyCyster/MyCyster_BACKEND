import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateMealFoodPlanTable1741736762584
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'meal_plan_food',
        columns: [
          {
            name: 'meal_plan_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'food_id',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Foreign Key for Meal Plan
    await queryRunner.createForeignKey(
      'meal_plan_food',
      new TableForeignKey({
        columnNames: ['meal_plan_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meal_plan',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign Key for Food
    await queryRunner.createForeignKey(
      'meal_plan_food',
      new TableForeignKey({
        columnNames: ['food_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'food',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('meal_plan_food');
  }
}
