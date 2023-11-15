import {
  buildingStandardsEnforcementOrderPromptsDir,
  buildingStandardsLawEnforcementOrderLawId,
} from '@/const/law';
import { createPrompt } from '@/lib/api/law';

export async function GET() {
  try {
    createPrompt(
      buildingStandardsEnforcementOrderPromptsDir,
      buildingStandardsLawEnforcementOrderLawId
    );
    return Response.json({ message: 'success' });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
