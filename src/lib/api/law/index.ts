import { apiUrl } from '@/const/law';
import { mkdir, writeFileSync } from 'fs';
import { join } from 'path';

export const createPrompt = async (promptsDir: string, lawId: string) => {
  mkdir(promptsDir, { recursive: true }, (err) => {
    if (err) throw err;
  });
  const response = await getLawData({ lawId });
  if (!response.ok) {
    return new Response(response.statusText, { status: response.status });
  }
  if (response.body == null) {
    return new Response('response.body is null', { status: 500 });
  }

  const data = await response.json();
  const articles = format(data.law_full_text.children)
    .replace(/\n([^\s]+)/g, '$1')
    .replace(/\n\n/g, '\n')
    .split(/\s+Article:/)
    .filter((text) => text.includes('ArticleTitle:'))
    .map((text) => {
      const t1 = text
        .split('\n')
        .filter((line) => !line.match(/^\s*$/))
        .join('\n');
      const spaces = t1.match(/^\s+/);
      return t1
        .split('\n')
        .map((line) => line.replace(new RegExp(`^${spaces}`), ''))
        .join('\n');
    });

  articles.forEach((article, index) => {
    writeFileSync(join(promptsDir, `${index}.txt`), article, { flag: 'w' });
  });
};

const getLawData = async ({ lawId }: { lawId: string }) => {
  const query = {
    law_id: lawId,
  };
  const url = `${apiUrl}/lawdata?${new URLSearchParams(query)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  return response;
};

const format = (data: any[], level: number = 0, parentType: string = '') => {
  const contents: any[] = [];
  data.forEach((item: any, index: number) => {
    if (typeof item === 'string') {
      if (parentType === 'Rt') return;
      if (parentType === 'Ruby') {
        contents.push(item);
        return;
      }
      contents.push(`${' '.repeat(level * 2)}${parentType}: ${item}`);
      return;
    } else {
      if (index === 0 && !!parentType) contents.push(`${' '.repeat(level * 2)}${parentType}:`);
    }

    const children = item['children'] || [];
    const type = item['tag'] as string;
    if (children.length == 0) {
      contents.push(`${' '.repeat(level * 2)}${type}:`);
      return;
    }
    contents.push(format(children, level + 1, type));
  });
  return contents.join('\n');
};
