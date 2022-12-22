import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class UpdateAdminTable1663144250521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'admins',
      new TableColumn({
        name: 'is_default_password',
        type: 'boolean',
        default: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('public.admins', 'is_default_password')
  }
}
