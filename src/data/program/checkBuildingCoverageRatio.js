const checkBuildingCoverageRatio = (msg) => {
  const sites = msg.payload.sites;
  const building = msg.payload.building;
  const isCornerPlot = msg.payload.isCornerPlot;
  const limitArea = sites
    .map((site) => {
      let planedBuildingCoverageRatio = site.planedBuildingCoverageRatio;
      if (!!site.isFirePreventionDistricts && !!building.isFireproofBuilding) {
        if (
          site.type === '商業地域' ||
          site.type === '近隣商業地域' ||
          site.type === '第1種住居地域' ||
          site.type === '第2種住居地域' ||
          site.type === '準住居地域' ||
          site.type === '準工業地域' ||
          planedBuildingCoverageRatio >= 0.8
        ) {
          planedBuildingCoverageRatio = 1;
        } else {
          planedBuildingCoverageRatio += 0.1;
        }
      }
      if (!!isCornerPlot) planedBuildingCoverageRatio += 0.1;
      if (planedBuildingCoverageRatio > 1) planedBuildingCoverageRatio = 1;

      return site.area * planedBuildingCoverageRatio;
    })
    .reduce((a, b) => a + b);
  const newMsg = { req: msg.req, res: msg.res };
  if (building.area > limitArea) {
    newMsg.payload = {
      result: '建蔽率が定める数値を超えています。',
    };
  } else {
    newMsg.payload = {
      result: 'OK',
    };
  }
  return newMsg;
};
