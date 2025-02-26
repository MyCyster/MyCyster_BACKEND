import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1740597251686 implements MigrationInterface {
  name = ' $npmConfigName1740597251686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "email_verification_code" character varying, "is_email_verified" boolean NOT NULL DEFAULT false, "reset_password_token" character varying, "reset_password_expiration" TIMESTAMP DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."mood_enum" AS ENUM('happy', 'sad', 'anxious', 'blue', 'calm', 'irritated', 'fatigued', 'moody', 'overwhelmed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "mood" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mood" "public"."mood_enum" NOT NULL, "description" text, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_cd069bf46deedf0ef3a7771f44b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "mood" ADD CONSTRAINT "FK_ac35dd96931ae4c227c93462aab" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mood" DROP CONSTRAINT "FK_ac35dd96931ae4c227c93462aab"`,
    );
    await queryRunner.query(`DROP TABLE "mood"`);
    await queryRunner.query(`DROP TYPE "public"."mood_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
