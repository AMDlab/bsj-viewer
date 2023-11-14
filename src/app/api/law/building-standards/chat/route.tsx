import OpenAI from 'openai';
import { programMapping, promptMapping, questionMapping } from '@/const/law';
import { readFileSync } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) return new Response('key is required', { status: 400 });

    const basePrompt = promptMapping['roomHeight']
      .map((path: string) => readFileSync(path, { encoding: 'utf-8' }))
      .join('\n');
    const fullBasePrompt = `${basePrompt}\n\nQ: ${questionMapping['roomHeight']}`;
    const baseProgram = readFileSync(programMapping['roomHeight'], { encoding: 'utf-8' });
    const baseResponse = `A: ${JSON.parse(baseProgram)[0]['func']}`;

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
