import { MigrationInterface, QueryRunner } from 'typeorm';

export class movies1643215092098 implements MigrationInterface {
  name = 'movies1643215092098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "movies" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "genre" character varying NOT NULL, "released" date NOT NULL, "director" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "movies"`);
  }
}
