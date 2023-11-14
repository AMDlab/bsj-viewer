import { mkdir, writeFileSync } from 'fs';
import {
  buildingStandardsLawId,
  buildingStandardsLawDataPath,
  buildingStandardsLawDataDir,
} from '@/const/law';
import { getLawData } from '@/lib/api/law';

export async function GET() {
  try {
    const response = await getLawData({ lawId: buildingStandardsLawId });
    if (!response.ok) {
      return new Response(response.statusText, { status: response.status });
    }
    if (response.body == null) {
      return new Response('response.body is null', { status: 500 });
    }

    const data = await response.json();
    mkdir(buildingStandardsLawDataDir, { recursive: true }, (err) => {
      if (err) throw err;
    });
    writeFileSync(buildingStandardsLawDataPath, JSON.stringify(data), {
      flag: 'w',
    });
    return Response.json({ message: 'success' });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
