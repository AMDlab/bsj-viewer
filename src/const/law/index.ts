import { join } from 'path';

export const apiUrl = 'https://api.lawapi-prototype-test-elaws.e-gov.go.jp/api/2';
export const buildingStandardsName = 'building-standards';
export const buildingStandardsLawId = '325AC0000000201';
export const buildingStandardsLawEnforcementOrderName = 'building-standards-enforcement-order';
export const buildingStandardsLawEnforcementOrderLawId = '325CO0000000338_20230526_504CO0000000393';
export const dataDirectoryPath = './src/data';
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
  floorAreaRatio: [join(buildingStandardsPromptsDir, '78.txt')],
  roomHeight: [join(buildingStandardsEnforcementOrderPromptsDir, '39.txt')],
  lightningRod: [join(buildingStandardsPromptsDir, '54.txt')],
  disasterRiskArea: [join(buildingStandardsPromptsDir, '62.txt')],
  buildingCoverageRatio: [join(buildingStandardsPromptsDir, '79.txt')],
  emergencyStaircase: [join(buildingStandardsEnforcementOrderPromptsDir, '181.txt')],
  premisesPassage: [join(buildingStandardsEnforcementOrderPromptsDir, '195.txt')],
  emergencyEntrance: [join(buildingStandardsEnforcementOrderPromptsDir, '192.txt')],
  roomUnderGround: [join(buildingStandardsPromptsDir, '50.txt')],
  firePreventionArea: [join(buildingStandardsPromptsDir, '97.txt')],
  stairsHandrail: [join(buildingStandardsEnforcementOrderPromptsDir, '45.txt')],
};

export const programMapping: { [key: string]: string } = {
  roomHeight: join(programDir, 'checkRoomHeight.js'),
  lightningRod: join(programDir, 'checkLightningRod.js'),
  disasterRiskArea: join(programDir, 'checkDisasterRiskArea.js'),
  buildingCoverageRatio: join(programDir, 'checkBuildingCoverageRatio.js'),
  emergencyStaircase: join(programDir, 'checkEmergencyStaircase.js'),
  premisesPassage: join(programDir, 'checkPremisesPassage.js'),
  emergencyEntrance: join(programDir, 'checkEmergencyEntrance.js'),
  roomUnderGround: join(programDir, 'checkRoomUnderGround.js'),
  firePreventionArea: join(programDir, 'checkFirePreventionArea.js'),
  stairsHandrail: join(programDir, 'checkStairsHandrail.js'),
};

export const questionMapping: { [key: string]: string } = {
  floorAreaRatio:
    'この法規を基に容積率が適しているかどうか判定するjavascriptのプログラムを書いてください。',
  roomHeight:
    'この法規を基に居室の天井高さが適しているかどうか判定するjavascriptのプログラムを書いてください。',
  lightningRod:
    'この法規を基に避雷針の有無が適しているかどうか判定するjavascriptのプログラムを書いてください。',
  disasterRiskArea:
    'この法規を建物を建てられるかどうか判定するjavascriptのプログラムを書いてください。',
  buildingCoverageRatio:
    'この法規を建ぺい率が適しているかどうか判定するjavascriptのプログラムを書いてください。',
  emergencyStaircase:
    'この法規を避難階段の設置が適しているかどうか判定するjavascriptのプログラムを書いてください。',
  premisesPassage:
    'この法規を敷地内の通路が適しているかどうか判定するjavascriptのプログラムを書いてください。',
  emergencyEntrance:
    'この法規を非常用の進入口の設置が適しているかどうか判定するjavascriptのプログラムを書いてください。',
  roomUnderGround:
    'この法規を地階における住宅等の居室が適しているかどうか判定するjavascriptのプログラムを書いてください。',
  firePreventionArea:
    'この法規を防火地域または準防火地域の建物として適しているかどうか判定するjavascriptのプログラムを書いてください。',
  stairsHandrail:
    'この法規を階段の手すりの設置が適しているかどうか判定するjavascriptのプログラムを書いてください。',
};
