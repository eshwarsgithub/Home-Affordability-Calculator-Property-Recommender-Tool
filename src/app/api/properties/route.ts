import { NextResponse } from "next/server";
import { getDatabases, getDatabaseIds, Query } from "@/lib/server/appwrite";

const { databaseId, propertiesCollectionId } = getDatabaseIds();

export async function GET() {
  try {
    const databases = getDatabases();
    const documents = await databases.listDocuments(databaseId, propertiesCollectionId, [
      Query.limit(24),
      Query.orderAsc("price"),
    ]);

    return NextResponse.json({ properties: documents.documents });
  } catch (error) {
    console.error("Property listing failed", error);
    return NextResponse.json({ properties: [] }, { status: 200 });
  }
}
