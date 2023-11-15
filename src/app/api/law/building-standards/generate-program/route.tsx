import OpenAI from 'openai';
import { promptMapping, questionMapping } from '@/const/law';
import { readFileSync } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    if (!key) return new Response('key is required', { status: 400 });

    const prompt = promptMapping[key]
      .map((path: string) => readFileSync(path, { encoding: 'utf-8' }))
      .join('\n');
    const fullPrompt = `${prompt}\n\nQ: ${questionMapping[key]}`;
    const response = await openai.chat.completions.create({
      model: process.env.MODEL_NAME!,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    return Response.json({ message: response });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
