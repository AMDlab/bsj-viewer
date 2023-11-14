import { apiUrl } from '@/const/law';

export const getLawData = async ({ lawId }: { lawId: string }) => {
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
