export interface CallerInfo {
  func: string;
  fileName: string;
  filePath: string;
  line: number;
  char: number;
}

export function getCallerInfo(): CallerInfo {
  const error = new Error();

  const stack = (error.stack as string).split('\n');

  const stackLine = stack.length < 4 ? (stack.pop() as string) : stack[3];

  const parts = stackLine.trim().slice(3).split(' ');

  const info = [
    parts[0],
    ...parts[parts.length - 1].replace(/\(|\)/g, '').split(':'),
  ];

  const fileComponents = info[1].split('/');

  return {
    func: info[0],
    fileName: fileComponents[fileComponents.length - 1],
    filePath: fileComponents.slice(0, fileComponents.length - 1).join('/'),
    line: Number(info[2]),
    char: Number(info[3]),
  };
}
