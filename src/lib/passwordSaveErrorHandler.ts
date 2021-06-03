import { red } from 'cli-color';
import { isWindows } from './isWindows';

export function passwordSaveErrorHandler(err: Error) {
  console.error(red('Error saving password!'), err.message);

  if (isWindows()) {
    console.error(
      red(
        'It looks like you\'re on Windows. This is most likely a script permission error. Please run: "Set-ExecutionPolicy -Scope CurrentUser remotesigned", press "Y" and try again.'
      )
    );
  }
}
