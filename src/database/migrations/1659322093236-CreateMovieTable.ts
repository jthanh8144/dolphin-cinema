import { MigrationInterface, QueryRunner, Table } from 'typeorm'

const TABLE_NAME = 'movies'

export class CreateMovieTable1659322093236 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'image',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'review_score',
            type: 'decimal',
            precision: 2,
            scale: 1,
            isNullable: true,
          },
          {
            name: 'release_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'showtime_duration',
            type: 'tsrange',
            isNullable: true,
          },
          {
            name: 'writer',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'director',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'language',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
            onUpdate: 'NOW()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME)
  }
}
