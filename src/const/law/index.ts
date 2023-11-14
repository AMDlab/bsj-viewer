import { join } from 'path';

export const apiUrl = 'https://api.lawapi-prototype-test-elaws.e-gov.go.jp/api/2';
export const buildingStandardsName = 'building-standards';
export const buildingStandardsLawId = '325AC0000000201';
export const buildingStandardsLawEnforcementOrderName = 'building-standards-enforcement-order';
export const buildingStandardsLawEnforcementOrderId = '325CO0000000338_20230526_504CO0000000393';
export const dataDirectoryPath = './src/data';
export const lawdataFileName = 'lawdata.json';
export const lawdataDirName = 'lawdata';
export const buildingStandardsLawDataDir = join(
  dataDirectoryPath,
  lawdataDirName,
  buildingStandardsName
);
export const buildingStandardsLawDataPath = join(buildingStandardsLawDataDir, lawdataFileName);
export const buildingStandardsEnforcementOrderLawDataDir = join(
  dataDirectoryPath,
  lawdataDirName,
  buildingStandardsLawEnforcementOrderName
);
export const buildingStandardsEnforcementOrderLawDataPath = join(
  buildingStandardsEnforcementOrderLawDataDir,
  lawdataFileName
);
export const promptsDirName = 'prompts';
export const buildingStandardsPromptsDir = join(
  dataDirectoryPath,
  promptsDirName,
  buildingStandardsName
);
export const buildingStandardsEnforcementOrderPromptsDir = join(
  dataDirectoryPath,
  promptsDirName,
  buildingStandardsLawEnforcementOrderName
);
export const programDirName = 'program';
export const programDir = join(dataDirectoryPath, programDirName);

export const promptMapping: { [key: string]: string[] } = {
  floorAreaRatio: [join(buildingStandardsPromptsDir, '68.txt')],
  roomHeight: [join(buildingStandardsEnforcementOrderPromptsDir, '39.txt')],
};

export const programMapping: { [key: string]: string } = {
  floorAreaRatio: '',
  roomHeight: join(programDir, 'room-height.json'),
};
