import OpenAI from 'openai';
import { promptMapping } from '@/const/law';
import { readFileSync } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model');
    if (!model) return new Response('model is required', { status: 400 });

    const prompt = promptMapping['floorAreaRatio']
      .map((path: string) => readFileSync(path, { encoding: 'utf-8' }))
      .join('\n');
    const fullPrompt = `${prompt}\n\nQ: プログラムを書いてください。`;
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: fullPrompt }],
    });

    return Response.json({ message: response });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
