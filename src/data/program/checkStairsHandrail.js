const checkStairsHandrail = (msg) => {
  const stairs = msg.payload.stairs;
  const newMsg = { req: msg.req, res: msg.res };
  if (stairs.some((stair) => stair.handrails.length === 0 && stair.height > 1000)) {
    newMsg.payload = {
      result: '階段には、手すりを設けなければなりません。',
    };
  } else if (
    stairs.some(
      (stair) =>
        stair.width > 3000 &&
        !stair.handrails.some((handrail) => handrail.position === 'middle') &&
        stair.eachHeight > 150 &&
        stair.eachDepth < 300 &&
        stair.height > 1000
    )
  ) {
    newMsg.payload = {
      result: '階段の幅が三メートルをこえる場合においては、中間に手すりを設けなければなりません。',
    };
  }

  return newMsg;
};
