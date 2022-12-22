import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'
import customNamingStrategy from '../naming-strategy/custom-naming-strategy'

const TABLE_NAME = 'tickets'

export class CreateTicketTable1659519300824 implements MigrationInterface {
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
            name: 'user_ticket_id',
            type: 'int',
          },
          {
            name: 'cinema_seat_id',
            type: 'int',
          },
          {
            name: 'price',
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
        indices: [
          { columnNames: ['cinema_seat_id', 'user_ticket_id'], isUnique: true },
        ],
      }),
      true,
    )
    await queryRunner.createForeignKeys(TABLE_NAME, [
      new TableForeignKey({
        columnNames: ['user_ticket_id'],
        referencedTableName: 'user_tickets',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['cinema_seat_id'],
        referencedTableName: 'cinema_seats',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const fkNames = [
      customNamingStrategy.foreignKeyName(
        TABLE_NAME,
        ['user_ticket_id'],
        'public.user_tickets',
      ),
      customNamingStrategy.foreignKeyName(
        TABLE_NAME,
        ['cinema_seat_id'],
        'public.cinema_seats',
      ),
    ]
    for (const name of fkNames) {
      await queryRunner.dropForeignKey(TABLE_NAME, name)
    }
    await queryRunner.dropTable(TABLE_NAME)
  }
}
