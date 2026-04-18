import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1776549702994 implements MigrationInterface {
  name = 'InitialSchema1776549702994';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "providerUserId" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0156df59a9af1200404d1131a6" ON "users" ("providerUserId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "prompts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(500) NOT NULL, "content" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "responseObject" jsonb, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_21f33798862975179e40b216a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd2aed4018953e15ce70f65b42" ON "prompts" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "prompts" ADD CONSTRAINT "FK_fd2aed4018953e15ce70f65b427" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prompts" DROP CONSTRAINT "FK_fd2aed4018953e15ce70f65b427"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd2aed4018953e15ce70f65b42"`,
    );
    await queryRunner.query(`DROP TABLE "prompts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0156df59a9af1200404d1131a6"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
