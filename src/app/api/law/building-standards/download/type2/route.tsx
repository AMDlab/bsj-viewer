import { buildingStandardsLawId, dataDirectoryPath, lawdataFileName } from '@/const/law';
import { getLawData } from '@/lib/api/law/get-law-data';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const result = await getLawData({ lawId: buildingStandardsLawId });
  if (!result.isSuccess) {
    return new Response(result.error?.message, { status: 500 });
  }

  writeFileSync(join(dataDirectoryPath, 'type2', lawdataFileName), JSON.stringify(result.value), {
    flag: 'w',
  });
  return Response.json({ message: 'success' });
}
