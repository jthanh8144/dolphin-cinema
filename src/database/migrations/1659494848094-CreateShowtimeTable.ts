import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'
import customNamingStrategy from '../naming-strategy/custom-naming-strategy'

const TABLE_NAME = 'showtimes'

export class CreateShowtimeTable1659494848094 implements MigrationInterface {
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
            name: 'cinema_room_id',
            type: 'int',
          },
          {
            name: 'time_id',
            type: 'smallint',
          },
          {
            name: 'movie_id',
            type: 'int',
          },
          {
            name: 'show_date',
            type: 'date',
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
        indices: [
          {
            columnNames: ['cinema_room_id', 'time_id', 'show_date'],
            isUnique: true,
          },
        ],
      }),
      true,
    )
    await queryRunner.createForeignKeys(TABLE_NAME, [
      new TableForeignKey({
        columnNames: ['cinema_room_id'],
        referencedTableName: 'cinema_rooms',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['time_id'],
        referencedTableName: 'times',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['movie_id'],
        referencedTableName: 'movies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const fkNames = [
      customNamingStrategy.foreignKeyName(
        TABLE_NAME,
        ['cinema_room_id'],
        'public.cinema_rooms',
      ),
      customNamingStrategy.foreignKeyName(
        TABLE_NAME,
        ['time_id'],
        'public.times',
      ),
      customNamingStrategy.foreignKeyName(
        TABLE_NAME,
        ['movie_id'],
        'public.movies',
      ),
    ]
    for (const name of fkNames) {
      await queryRunner.dropForeignKey(TABLE_NAME, name)
    }
    await queryRunner.dropTable(TABLE_NAME)
  }
}
