import { NextResponse } from "next/server";
import { getDatabases, getDatabaseIds, Query } from "@/lib/server/appwrite";

export async function GET() {
  try {
    const { databaseId, propertiesCollectionId } = getDatabaseIds("properties");
    const databases = getDatabases();
    const documents = await databases.listDocuments(databaseId, propertiesCollectionId, [
      Query.limit(24),
      Query.orderAsc("price"),
    ]);

    return NextResponse.json({ properties: documents.documents });
  } catch (error) {
    console.error("Property listing failed", error);
    // Return an empty list to the client to keep the UI functional when Appwrite
    // is not configured or an upstream error occurs.
    return NextResponse.json({ properties: [] }, { status: 200 });
  }
}
