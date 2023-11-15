const checkRoomHeight = (msg) => {
  const rooms = msg.payload.rooms;
  const results = [];
  for (let room of rooms) {
    if (room.height < 2100) {
      results.push({
        name: room.name,
        result: '居室の天井の高さは、二・一メートル以上でなければなりません。',
      });
      continue;
    }
    results.push({ name: room.name, result: 'OK' });
  }
  const newMsg = { req: msg.req, res: msg.res, payload: results };
  return newMsg;
};
