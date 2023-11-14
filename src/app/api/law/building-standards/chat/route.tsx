import OpenAI from 'openai';
import { programMapping, promptMapping, questionMapping } from '@/const/law';
import { readFileSync } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const maxDuration = 60;
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) return new Response('key is required', { status: 400 });

    const basePrompt = promptMapping['roomHeight']
      .map((path: string) => readFileSync(path, { encoding: 'utf-8' }))
      .join('\n');
    const fullBasePrompt = `${basePrompt}\n\nQ: ${questionMapping['roomHeight']}`;
    // const baseProgram = readFileSync(programMapping['roomHeight'], { encoding: 'utf-8' });
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
    const baseResponse = `A: ${data[0]['func']}`;

    const prompt = promptMapping[key]
      .map((path: string) => readFileSync(path, { encoding: 'utf-8' }))
      .join('\n');
    const fullPrompt = `${prompt}\n\nQ: ${questionMapping[key]}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'user', content: fullBasePrompt },
        { role: 'assistant', content: baseResponse },
        { role: 'user', content: fullPrompt },
      ],
    });

    return new Response(response.choices[0].message.content);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
