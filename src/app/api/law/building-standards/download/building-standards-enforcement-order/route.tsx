import { mkdir, writeFileSync } from 'fs';
import {
  buildingStandardsEnforcementOrderLawDataDir,
  buildingStandardsEnforcementOrderLawDataPath,
  buildingStandardsLawEnforcementOrderId,
} from '@/const/law';
import { getLawData } from '@/lib/api/law';

export async function GET() {
  try {
    const response = await getLawData({ lawId: buildingStandardsLawEnforcementOrderId });
    if (!response.ok) {
      return new Response(response.statusText, { status: response.status });
    }
    if (response.body == null) {
      return new Response('response.body is null', { status: 500 });
    }

    const data = await response.json();
    mkdir(buildingStandardsEnforcementOrderLawDataDir, { recursive: true }, (err) => {
      if (err) throw err;
    });
    writeFileSync(buildingStandardsEnforcementOrderLawDataPath, JSON.stringify(data), {
      flag: 'w',
    });
    return Response.json({ message: 'success' });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
