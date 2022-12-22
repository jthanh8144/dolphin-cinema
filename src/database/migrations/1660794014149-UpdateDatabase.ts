import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class UpdateDatabase1660794014149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET timezone = 'UTC${process.env.TIMEZONE}';`)
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar_url',
        type: 'text',
        isNullable: true,
      }),
    )
    await queryRunner.addColumn(
      'cinemas',
      new TableColumn({
        name: 'base_price',
        type: 'decimal',
        precision: 7,
        scale: 1,
        isNullable: true,
      }),
    )
    await queryRunner.query('UPDATE public.cinemas SET base_price = 45000')
    await queryRunner.query(
      'ALTER TABLE public.cinemas ALTER COLUMN base_price SET NOT NULL',
    )
    await queryRunner.query(
      'ALTER TABLE public.movies ALTER COLUMN image TYPE text',
    )
    await queryRunner.query(
      'ALTER TABLE public.movies ALTER COLUMN review_score SET DEFAULT 0',
    )
    await queryRunner.changeColumn(
      'movies',
      'showtime_duration',
      new TableColumn({
        name: 'showtime_duration',
        type: 'smallint',
        isNullable: true,
      }),
    )
    await queryRunner.addColumn(
      'movies',
      new TableColumn({
        name: 'trailer_url',
        type: 'text',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('public.users', 'avatar_url')
    await queryRunner.dropColumn('public.cinemas', 'base_price')
    await queryRunner.dropColumn('public.movies', 'trailer_url')
    await queryRunner.query(
      'ALTER TABLE public.movies ALTER COLUMN image TYPE varchar(255)',
    )
    await queryRunner.query(
      'ALTER TABLE public.movies ALTER COLUMN review_score DROP DEFAULT',
    )
    await queryRunner.changeColumn(
      'movies',
      'showtime_duration',
      new TableColumn({
        name: 'showtime_duration',
        type: 'tsrange',
        isNullable: true,
      }),
    )
  }
}
