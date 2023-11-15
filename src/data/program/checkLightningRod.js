const checkLightningRod = (msg) => {
  const buildingHeight = msg.payload.buildingHeight;
  const hasLightningRod = msg.payload.hasLightningRod;
  const isSafeSite = msg.payload.isSafeSite;
  const newMsg = { req: msg.req, res: msg.res };
  if (buildingHeight <= 20000) {
    newMsg.payload = { result: 'OK' };
  } else if (!!hasLightningRod) {
    newMsg.payload = { result: 'OK' };
  } else if (!!isSafeSite) {
    newMsg.payload = { result: 'OK' };
  } else {
    newMsg.payload = {
      result: '高さ二十メートルをこえる建築物には、有効に避雷設備を設けなければなりません。',
    };
  }
  return newMsg;
};
