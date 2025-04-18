import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMealPlanTable1744993853709 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('meal_plan', 'meal_types', 'meal_type');

    await queryRunner.query(`
            ALTER TABLE meal_plan 
            ALTER COLUMN meal_type TYPE varchar
            USING meal_type::varchar
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert the type change
    await queryRunner.query(`
        ALTER TABLE meal_plan 
        ALTER COLUMN meal_type TYPE text[] 
        USING meal_type::text[]
      `);

    // Revert the column rename
    await queryRunner.renameColumn('meal_plan', 'smeal_type', 'meal_types');
  }
}
