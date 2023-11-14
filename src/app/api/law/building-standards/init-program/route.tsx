import OpenAI from 'openai';
import { programDir, promptMapping } from '@/const/law';
import { mkdir, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  try {
    const data = [
      {
        id: 'db1ff368a6553a25',
        type: 'function',
        z: '5b3a532588595481',
        name: '居室の天井の高さ判定',
        func: 'const rooms = msg.payload.rooms;\nconst results = []\nfor(let room of rooms) {\n    if (room.height < 2.1) {\n        results.push({ name: room.name, result: "居室の天井の高さは、二・一メートル以上でなければなりません。" });\n        continue\n    } \n    results.push({ name: room.name, result: "OK" });\n}\n\nlet newMsg = { payload: results };\nnewMsg.req = msg.req;\nnewMsg.res = msg.res;\n\nreturn newMsg;',
        outputs: 1,
        noerr: 0,
        initialize: '',
        finalize: '',
        libs: [],
        x: 500,
        y: 120,
        wires: [['c386428d11fc83ef']],
      },
    ];
    mkdir(programDir, { recursive: true }, (err) => {
      if (err) throw err;
    });
    writeFileSync(join(programDir, 'room-height.json'), JSON.stringify(data), {
      flag: 'w',
    });

    return Response.json({ message: 'success' });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
