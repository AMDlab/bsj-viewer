const checkRoomUnderGround = (msg) => {
  const building = msg.payload.building;
  const newMsg = { req: msg.req, res: msg.res };
  if (
    building.type == '住宅' &&
    building.floors.some(
      (floor) =>
        floor.level < 0 &&
        floor.rooms.some((room) => room.type === '居室' && !room.hasSanitaryMeasures)
    )
  ) {
    newMsg.payload = {
      result: '地階の居室は衛生上必要な政令で定める技術的基準に適合する必要があります。',
    };
  } else if (
    building.type == '学校' &&
    building.floors.some(
      (floor) =>
        floor.level < 0 &&
        floor.rooms.some((room) => room.type === '教室' && !room.hasSanitaryMeasures)
    )
  ) {
    newMsg.payload = {
      result: '地階の教室は衛生上必要な政令で定める技術的基準に適合する必要があります。',
    };
  } else if (
    building.type == '病院' &&
    building.floors.some(
      (floor) =>
        floor.level < 0 &&
        floor.rooms.some((room) => room.type === '病室' && !room.hasSanitaryMeasures)
    )
  ) {
    newMsg.payload = {
      result: '地階の病室は衛生上必要な政令で定める技術的基準に適合する必要があります。',
    };
  } else if (
    building.type == '寄宿舎' &&
    building.floors.some(
      (floor) =>
        floor.level < 0 &&
        floor.rooms.some((room) => room.type === '寝室' && !room.hasSanitaryMeasures)
    )
  ) {
    newMsg.payload = {
      result: '地階の寝室は衛生上必要な政令で定める技術的基準に適合する必要があります。',
    };
  } else {
    newMsg.payload = {
      result: 'OK',
    };
  }
  return newMsg;
};
