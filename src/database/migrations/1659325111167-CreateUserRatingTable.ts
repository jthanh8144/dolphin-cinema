import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'
import customNamingStrategy from '../naming-strategy/custom-naming-strategy'

const TABLE_NAME = 'user_ratings'

export class CreateUserRatingTable1659325111167 implements MigrationInterface {
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
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'movie_id',
            type: 'int',
          },
          {
            name: 'score',
            type: 'smallint',
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
            columnNames: ['user_id', 'movie_id'],
            isUnique: true,
          },
        ],
      }),
      true,
    )
    await queryRunner.createForeignKeys(TABLE_NAME, [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
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
        ['user_id'],
        'public.users',
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
