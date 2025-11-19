import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { getDatabases, getDatabaseIds } from "@/lib/server/appwrite";

const { databaseId, leadsCollectionId } = getDatabaseIds();

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { lead, summary, loan } = payload || {};

    if (!lead || !lead.name || !lead.phone || !lead.email) {
      return NextResponse.json(
        {
          error: "Missing lead basics",
        },
        { status: 400 },
      );
    }

    const documentData = {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      tenureYears: loan?.tenureYears,
      downPaymentPercent: loan?.downPaymentPercent,
      eligibleLoanAmount: summary?.eligibleLoanAmount,
      affordablePrice: summary?.affordablePrice,
      maxEligibleEmi: summary?.maxEligibleEmi,
      foirApplied: summary?.foirApplied,
      createdAt: new Date().toISOString(),
    };

    const databases = getDatabases();
    await databases.createDocument(databaseId, leadsCollectionId, ID.unique(), documentData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead capture failed", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
