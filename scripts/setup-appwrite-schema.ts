import { Client, Databases, ID, Query } from "node-appwrite";
import { config } from "dotenv";
import { properties as seedProperties } from "../src/data/properties";

config({ path: ".env.local" });
config();

type AttributeConfig = {
  key: string;
  type: "string" | "integer" | "float" | "datetime" | "boolean";
  required?: boolean;
  size?: number;
  default?: string | number | boolean | null;
  array?: boolean;
  codes?: string[]; // reserved for enums in future tweaks
};

if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
  console.error("Missing Appwrite environment variables.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const databaseId = process.env.APPWRITE_DATABASE_ID || "harihara-data";
const leadsCollectionId = process.env.APPWRITE_LEADS_COLLECTION_ID || "leads";
const propertiesCollectionId = process.env.APPWRITE_PROPERTIES_COLLECTION_ID || "properties";

const leadsAttributes: AttributeConfig[] = [
  { key: "name", type: "string", size: 96, required: true },
  { key: "phone", type: "string", size: 16, required: true },
  { key: "email", type: "string", size: 160, required: true },
  { key: "tenureYears", type: "integer", required: false },
  { key: "downPaymentPercent", type: "float", required: false },
  { key: "eligibleLoanAmount", type: "float", required: false },
  { key: "affordablePrice", type: "float", required: false },
  { key: "maxEligibleEmi", type: "float", required: false },
  { key: "foirApplied", type: "float", required: false },
  { key: "createdAt", type: "datetime", required: false },
];

const propertyAttributes: AttributeConfig[] = [
  { key: "name", type: "string", size: 120, required: true },
  { key: "location", type: "string", size: 160, required: true },
  { key: "configuration", type: "string", size: 80, required: false },
  { key: "price", type: "float", required: true },
  { key: "carpetArea", type: "string", size: 48, required: false },
  { key: "possession", type: "string", size: 64, required: false },
  { key: "highlights", type: "string", size: 128, required: false, array: true },
  { key: "imageUrl", type: "string", size: 256, required: false },
  { key: "whatsappNumber", type: "string", size: 24, required: false },
  { key: "detailsUrl", type: "string", size: 256, required: false },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureAttributes(
  dbId: string,
  collectionId: string,
  attributes: AttributeConfig[],
) {
  for (const attribute of attributes) {
    try {
      switch (attribute.type) {
        case "string": {
          await databases.createStringAttribute(dbId, collectionId, attribute.key, attribute.size ?? 255, attribute.required ?? false, attribute.default?.toString() ?? undefined, attribute.array ?? false);
          break;
        }
        case "integer": {
          await databases.createIntegerAttribute(
            dbId,
            collectionId,
            attribute.key,
            attribute.required ?? false,
            undefined,
            undefined,
            attribute.default as number | undefined,
            attribute.array ?? false,
          );
          break;
        }
        case "float": {
          await databases.createFloatAttribute(
            dbId,
            collectionId,
            attribute.key,
            attribute.required ?? false,
            undefined,
            undefined,
            attribute.default as number | undefined,
            attribute.array ?? false,
          );
          break;
        }
        case "datetime": {
          await databases.createDatetimeAttribute(dbId, collectionId, attribute.key, attribute.required ?? false, attribute.default as string | undefined, attribute.array ?? false);
          break;
        }
        case "boolean": {
          await databases.createBooleanAttribute(dbId, collectionId, attribute.key, attribute.required ?? false, attribute.default as boolean | undefined, attribute.array ?? false);
          break;
        }
        default: {
          console.warn(`Skipping unsupported attribute type for ${attribute.key}`);
        }
      }
      await delay(500);
    } catch (error) {
      console.error(`Failed to create attribute ${attribute.key} on ${collectionId}:`, (error as Error).message);
    }
  }
}

async function main() {
  try {
    const db = await databases.create(databaseId, databaseId);
    console.log("Database ready", db.$id);
  } catch (error) {
    console.log("Database may already exist:", (error as Error).message);
  }

  try {
    const leadsCollection = await databases.createCollection(databaseId, leadsCollectionId, leadsCollectionId);
    console.log("Leads collection ready", leadsCollection.$id);
  } catch (error) {
    console.log("Leads collection may already exist:", (error as Error).message);
  }

  await delay(500);
  await ensureAttributes(databaseId, leadsCollectionId, leadsAttributes);

  try {
    const propertiesCollection = await databases.createCollection(databaseId, propertiesCollectionId, propertiesCollectionId);
    console.log("Properties collection ready", propertiesCollection.$id);
  } catch (error) {
    console.log("Properties collection may already exist:", (error as Error).message);
  }

  await delay(500);
  await ensureAttributes(databaseId, propertiesCollectionId, propertyAttributes);

  try {
    const existing = await databases.listDocuments(databaseId, propertiesCollectionId, [Query.limit(1)]);
    if (existing.total === 0) {
      console.log("Seeding property catalogue...");
      for (const property of seedProperties) {
        try {
          await databases.createDocument(databaseId, propertiesCollectionId, property.id ?? ID.unique(), {
            name: property.name,
            location: property.location,
            configuration: property.configuration,
            price: property.price,
            carpetArea: property.carpetArea,
            possession: property.possession,
            highlights: property.highlights,
            imageUrl: property.imageUrl,
            whatsappNumber: property.whatsappNumber,
            detailsUrl: property.detailsUrl,
          });
          await delay(300);
        } catch (seedError) {
          console.error(`Failed to seed property ${property.id}`, (seedError as Error).message);
        }
      }
    }
  } catch (seedCheckError) {
    console.error("Could not inspect property collection before seeding:", (seedCheckError as Error).message);
  }

  console.log("Schema setup completed.");
}

main().catch((error) => {
  console.error("Setup failed", error);
  process.exit(1);
});
