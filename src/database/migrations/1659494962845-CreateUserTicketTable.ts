import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'
import customNamingStrategy from '../naming-strategy/custom-naming-strategy'

const TABLE_NAME = 'user_tickets'

export class CreateUserTicketTable1659494962845 implements MigrationInterface {
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
            name: 'showtime_id',
            type: 'smallint',
          },
          {
            name: 'total_price',
            type: 'decimal',
            precision: 7,
            scale: 1,
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
    await queryRunner.createForeignKeys(TABLE_NAME, [
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['showtime_id'],
        referencedTableName: 'showtimes',
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
        ['showtime_id'],
        'public.showtimes',
      ),
    ]
    for (const name of fkNames) {
      await queryRunner.dropForeignKey(TABLE_NAME, name)
    }
    await queryRunner.dropTable(TABLE_NAME)
  }
}
