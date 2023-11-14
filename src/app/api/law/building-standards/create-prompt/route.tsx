import { dataDirectoryPath, lawdataFileName, buildingStandardsLawId, apiUrl } from '@/const/law';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const articles = extractArticles(join(dataDirectoryPath, 'type1', lawdataFileName));
    articles.forEach((article: any, index: number) => {
      const text = format(article['children']);
      writeFileSync(join(dataDirectoryPath, 'prompts', `${index}.txt`), text, { flag: 'w' });
    });

    return Response.json({ message: 'success' });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}

const extractArticles = (filePath: string) => {
  const data = readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(data)
    ['law_full_text']['children'].find((child: any) => child['tag'] === 'LawBody')
    ['children'].find((child: any) => child['tag'] === 'MainProvision')
    ['children'].map((child: any) => child['children'])
    .flat()
    .filter((child: any) => child['tag'] !== 'ChapterTitle');
};

const format = (body: any[], level: number = 0) => {
  const contents: any[] = [];
  body.forEach((item: any) => {
    const children = item['children'];
    if (children.length == 0) return;

    const type = item['tag'] as string;
    if (typeof children[0] === 'string') {
      const text = children[0] as string;
      contents.push(`${' '.repeat(level * 2)}${type}: ${text}`);
    } else {
      contents.push(`${' '.repeat(level * 2)}${type}:`);
      contents.push(format(children, level + 1));
    }
  });
  return contents.join('\n');
};
