import { NamingStrategyInterface, Table } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class CustomNamingStrategy
  extends SnakeNamingStrategy
  implements NamingStrategyInterface
{
  primaryKeyName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    const table =
      tableOrName instanceof Table
        ? tableOrName.name
        : tableOrName;
    const columnsSnakeCase = columnNames.join('_');

    return `pk_${table}_${columnsSnakeCase}`;
  }
}
