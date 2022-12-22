import { MigrationInterface, QueryRunner, Table } from 'typeorm'

const TABLE_NAME = 'seat_types'

export class CreateSeatTypeTable1659494434925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'smallint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['vip1', 'vip2', 'vip3', 'vip4', 'vip5', 'vip6'],
          },
          {
            name: 'surcharge',
            type: 'decimal',
            precision: 7,
            scale: 1,
            default: 0,
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
