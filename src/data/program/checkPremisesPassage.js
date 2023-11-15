const checkPremisesPassage = (msg) => {
  const hasPassage = msg.payload.hasPassage;
  const passageWidth = msg.payload.passageWidth;
  const newMsg = { req: msg.req, res: msg.res };
  const buildingFloorCount = msg.payload.buildingFloorCount;
  const buildingTotalFloorArea = msg.payload.buildingTotalFloorArea;

  if (buildingFloorCount > 3 || buildingTotalFloorArea >= 200) {
    if (!hasPassage || passageWidth < 1500) {
      newMsg.payload = {
        result:
          '建築物の敷地内に、道又は公園、広場その他の空地に通ずる幅員が一・五メートル通路を設けなければなりません。',
      };
    } else {
      newMsg.payload = { result: 'OK' };
    }
  } else {
    if (!hasPassage || passageWidth < 900) {
      newMsg.payload = {
        result:
          '建築物の敷地内に、道又は公園、広場その他の空地に通ずる幅員が九十センチメートル通路を設けなければなりません。',
      };
    } else {
      newMsg.payload = { result: 'OK' };
    }
  }
  return newMsg;
};
