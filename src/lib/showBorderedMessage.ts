import Table from 'cli-table3';

export function showBorderedMessage(cols: number, msg: string) {
  const table = new Table({
    colWidths: [cols],
  });

  table.push([msg]);
  console.error(table.toString());
}
