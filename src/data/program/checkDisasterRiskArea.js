const checkDisasterRiskArea = (msg) => {
  const isDisasterRiskArea = msg.payload.isDisasterRiskArea;
  const isResidence = msg.payload.isResidence;
  const newMsg = { req: msg.req, res: msg.res };
  if (!!isDisasterRiskArea) {
    newMsg.payload = { result: 'OK' };
  } else if (!!isResidence) {
    newMsg.payload = {
      result: '災害危険区域内における住居の用に供する建築物の建築は禁止されています。',
    };
  } else {
    newMsg.payload = {
      result:
        '災害危険区域内における住居以外の用に供する建築物の建築に関する制限がある可能性があります。',
    };
  }
  return newMsg;
};
