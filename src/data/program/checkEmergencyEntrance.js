const checkEmergencyEntrance = (msg) => {
  const building = msg.payload.building;
  const newMsg = { req: msg.req, res: msg.res };
  if (
    building.floors.some(
      (floor) =>
        floor.emergencyEntrance === false &&
        !floor.fireSafeFunction &&
        !floor.accesibleFromUpperFloor &&
        !floor.accesibleFromLowerFloor &&
        !building.hasElevator
    )
  ) {
    newMsg.payload.result = '非常用の進入口が設置されていない階があります。';
  } else {
    newMsg.payload.result = 'OK';
  }

  return newMsg;
};
