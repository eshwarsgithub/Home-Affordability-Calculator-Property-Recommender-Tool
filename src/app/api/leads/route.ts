import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { getDatabases, getDatabaseIds } from "@/lib/server/appwrite";

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

    const { databaseId, leadsCollectionId } = getDatabaseIds("leads");

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
    const message = error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
