const checkEmergencyStaircase = (msg) => {
  const building = msg.payload.building;
  const buildingFloorCountAboveGround = building.FloorCountAboveGround;
  const buildingFloorCountUnderGround = building.FloorCountUnderGround;
  const hasEmergencyStaircase = msg.payload.hasEmergencyStaircase;
  const hasSpecialEmergencyStaircase = msg.payload.hasSpecialEmergencyStaircase;
  const staircaseCount = msg.payload.staircaseCount;
  const isFirePreventionStucture = msg.payload.isFirePreventionStucture;
  const isFirePreventionDistricts = msg.payload.isFirePreventionDistricts;
  if (
    buildingFloorCountAboveGround > 5 &&
    !isFirePreventionStucture &&
    !(
      isFirePreventionDistricts &&
      building.floors
        .filter((floor) => floor.level > 5)
        .map((floor) => floor.area)
        .reduce((a, b) => a + b) < 100
    ) &&
    !hasEmergencyStaircase &&
    !hasSpecialEmergencyStaircase
  ) {
    newMsg.payload = {
      result: '五階以上の階に通ずる直通階段は避難階段または特別避難階段でなければなりません。',
    };
    return newMsg;
  }
  if (
    buildingFloorCountUnderGround < 2 &&
    !isFirePreventionStucture &&
    !(
      isFirePreventionDistricts &&
      building.floors
        .filter((floor) => floor.level < -2)
        .map((floor) => floor.area)
        .reduce((a, b) => a + b) < 100
    ) &&
    !hasEmergencyStaircase &&
    !hasSpecialEmergencyStaircase
  ) {
    newMsg.payload = {
      result: '地下二階以下の階に通ずる直通階段は避難階段または特別避難階段でなければなりません。',
    };
    return newMsg;
  }
  if (buildingFloorCountAboveGround > 15 && !hasSpecialEmergencyStaircase) {
    newMsg.payload = {
      result: '十五階以上の階に通ずる直通階段は特別避難階段でなければなりません。',
    };
    return newMsg;
  }
  if (buildingFloorCountUnderGround < 3 && !hasSpecialEmergencyStaircase) {
    newMsg.payload = {
      result: '地下三階以下の階に通ずる直通階段は特別避難階段でなければなりません。',
    };
    return newMsg;
  }

  const hasMerchandise = building.floor.some((floor) => floor.level >= 3 && floor.hasMerchandise);
  if (hasMerchandise && staircaseCount < 2) {
    newMsg.payload = {
      result: '三階以上の階に通ずる直通階段は二つ以上設けなければなりません。',
    };
    return newMsg;
  }
  if (hasMerchandise && !hasEmergencyStaircase && !hasSpecialEmergencyStaircase) {
    newMsg.payload = {
      result: '三階以上の階に通ずる直通階段は避難階段または特別避難階段でなければなりません。',
    };
    return newMsg;
  }

  newMsg.payload = {
    result: 'OK',
  };
  return newMsg;
};
