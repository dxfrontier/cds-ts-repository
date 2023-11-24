import path from 'path';
import cds from '@sap/cds';

export const startTestServer = (dirName: string, projectName: string) => {
  const project = path.join(dirName, '../../', projectName);
  return cds.test(project);
};
