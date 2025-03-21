import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImageUrlToUsersTable1742307542082
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the 'image_url' column to the 'users' table
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'image_url',
        type: 'text',
        isNullable: true, // Allows null values if no image is provided
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'image_url');
  }
}
