export const generateFileName = (fileName: string): string =>
  Date.now() + '_' + fileName.split(' ').join('_')
