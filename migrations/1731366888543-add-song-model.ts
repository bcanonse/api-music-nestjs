import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSongModel1731366888543
  implements MigrationInterface
{
  name = 'AddSongModel1731366888543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "songs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "artists" character varying array NOT NULL, "released_date" date NOT NULL, "duration" TIME NOT NULL, "lyrics" text NOT NULL, CONSTRAINT "pk_songs_id" PRIMARY KEY ("id")); COMMENT ON COLUMN "songs"."title" IS 'Title of the song'; COMMENT ON COLUMN "songs"."artists" IS 'List of artist of the song'; COMMENT ON COLUMN "songs"."released_date" IS 'Release date publish of the song'; COMMENT ON COLUMN "songs"."duration" IS 'Duration of the song'`,
    );
  }

  public async down(
    queryRunner: QueryRunner,
  ): Promise<void> {
    await queryRunner.query(`DROP TABLE "songs"`);
  }
}
