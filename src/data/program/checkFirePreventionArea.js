const checkFirePreventionArea = (msg) => {
  const site = msg.payload.site;
  const building = msg.payload.building;
  const newMsg = { req: msg.req, res: msg.res };
  if (!site.isFirePreventionArea && !site.isSemiFirePreventionArea) {
    newMsg.payload = {
      result: 'OK',
    };
    return newMsg;
  }

  if (building.parts.some((part) => part.hasfireSpeedLine && !part.hasFireProtectionFacility)) {
    newMsg.payload = {
      result: '防火設備が必要です。',
    };
    return newMsg;
  } else if (building.parts.some((part) => !part.hasFireProtectionSpec)) {
    newMsg.payload = {
      result: '建築物の規模に応じて政令で定める技術的基準に適合する必要があります。',
    };
    return newMsg;
  }

  newMsg.payload = {
    result: 'OK',
  };
  return newMsg;
};
