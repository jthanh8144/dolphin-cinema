import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'
import customNamingStrategy from '../naming-strategy/custom-naming-strategy'

const TABLE_NAME = 'cinema_seats'

export class CreateCinemaSeatTable1659494942102 implements MigrationInterface {
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
            type: 'smallint',
          },
          {
            name: 'seat_id',
            type: 'int',
          },
          {
            name: 'seat_type_id',
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
            columnNames: ['cinema_room_id', 'seat_id'],
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
        columnNames: ['seat_id'],
        referencedTableName: 'seats',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['seat_type_id'],
        referencedTableName: 'seat_types',
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
        ['seat_id'],
        'public.seats',
      ),
      customNamingStrategy.foreignKeyName(
        TABLE_NAME,
        ['seat_type_id'],
        'public.seat_types',
      ),
    ]
    for (const name of fkNames) {
      await queryRunner.dropForeignKey(TABLE_NAME, name)
    }
    await queryRunner.dropTable(TABLE_NAME)
  }
}
