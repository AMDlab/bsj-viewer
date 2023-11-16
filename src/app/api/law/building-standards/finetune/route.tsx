import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { programMapping, promptMapping, questionMapping } from '@/const/law';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = 'gpt-3.5-turbo-1106';
export async function GET(request: Request) {
  const basicAuth = request.headers.get('authorization');
  if (!basicAuth) return new Response('Unauthorized', { status: 401 });
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');
    if (user !== process.env.BASIC_AUTH_USER || pwd !== process.env.BASIC_AUTH_PASSWORD) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const keys = Object.keys(programMapping);
  try {
    const data = keys.map((key: string) => {
      const prompt = promptMapping[key]
        .map((path: string) => readFileSync(path, { encoding: 'utf-8' }))
        .join('\n');
      const fullPrompt = `${prompt}\n\nQ: ${questionMapping[key]}`;
      const program = readFileSync(programMapping[key], { encoding: 'utf-8' });
      return {
        messages: [
          { role: 'user', content: fullPrompt },
          { role: 'assistant', content: program },
        ],
      };
    });

    let time = new Date().getTime();
    const file = await openai.files.create({
      file: new File([data.map((datum) => JSON.stringify(datum)).join('\n')], `${time}.jsonl`),
      purpose: 'fine-tune',
    });

    const result = await openai.fineTuning.jobs.create({
      training_file: file.id,
      model,
    });
    return Response.json({ message: result });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
