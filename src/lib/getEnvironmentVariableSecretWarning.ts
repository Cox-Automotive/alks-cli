import clc from 'cli-color';

export function getEnvironmentVariableSecretWarning(varName: string): string {
  return clc.red(
    `WARNING: Using the ${varName} environment variable is not recommended since other applications may accidentally log it. Proceed with caution.`
  );
}
