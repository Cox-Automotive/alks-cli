import commander from 'commander';
import tabtab from 'tabtab';
import program from '../program';

export async function handleCompletion(_options: commander.OptionValues) {
  const env = tabtab.parseEnv(process.env);

  const suggestions: string[] = [];
  suggestions.push('-v', '--verbose');

  const commands = program.commands;
  if (env.prev === 'alks') {
    // complete top-level commands
    suggestions.push(...commands.map((c) => c.name()));
  } else {
    for (const command of commands) {
      const subcommands = command.commands;

      if (env.prev === command.name()) {
        // complete subcommands
        suggestions.push(...subcommands.map((c) => c.name()));
      } else {
        for (const subcommand of subcommands) {
          // Use regex to ensure subcommand is surrounded by spaces (ie. don't match "session" against "sessions") 
          const subcommandRegex = new RegExp(`\\s${subcommand.name()}\\s`);
          if (subcommandRegex.test(env.line)) {
            // tabtab doesn't include this in their typings but the field does exist
            const rawOptions = (subcommand as any).options as {
              short?: string;
              long?: string;
            }[];
            const options = Object.values(
              rawOptions
                .flatMap((o) => [o.short, o.long])
                .filter((o): o is string => !!o)
            );

            // complete the flags/options for subcommands
            suggestions.push(...options);
          }
        }
      }
    }
  }

  tabtab.log(suggestions);
}
