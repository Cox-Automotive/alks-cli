import commander from 'commander';

export function getLastMatchingProgram(program: commander.Command) {
  let command: commander.Command = program;
  for (const arg of program.args) {
    const commands = command.commands.map((c) => c.name());
    if (!commands.includes(arg)) {
      break;
    }
    command = command.commands.find(
      (c) => c.name() == arg
    ) as commander.Command;
  }
  return command;
}
