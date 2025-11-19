import { Client, Databases, ID, Query, Models } from "node-appwrite";

type AppwriteConfig = {
  endpoint: string;
  projectId: string;
  apiKey: string;
  databaseId: string;
  leadsCollectionId: string;
  propertiesCollectionId: string;
};

const getConfig = (): AppwriteConfig => {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const leadsCollectionId = process.env.APPWRITE_LEADS_COLLECTION_ID;
  const propertiesCollectionId = process.env.APPWRITE_PROPERTIES_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey) {
    throw new Error("Missing Appwrite credentials: ensure APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY are configured.");
  }

  if (!databaseId || !leadsCollectionId || !propertiesCollectionId) {
    throw new Error("Missing Appwrite IDs: set APPWRITE_DATABASE_ID, APPWRITE_LEADS_COLLECTION_ID, APPWRITE_PROPERTIES_COLLECTION_ID.");
  }

  return {
    endpoint,
    projectId,
    apiKey,
    databaseId,
    leadsCollectionId,
    propertiesCollectionId,
  };
};

let cachedClient: Client | undefined;
let cachedDatabases: Databases | undefined;

const getClient = () => {
  if (cachedClient) return cachedClient;
  const { endpoint, projectId, apiKey } = getConfig();
  cachedClient = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return cachedClient;
};

export const getDatabases = () => {
  if (cachedDatabases) return cachedDatabases;
  cachedDatabases = new Databases(getClient());
  return cachedDatabases;
};

export const getDatabaseIds = () => {
  const { databaseId, leadsCollectionId, propertiesCollectionId } = getConfig();
  return { databaseId, leadsCollectionId, propertiesCollectionId };
};

export type LeadsDocument = Models.Document & {
  name: string;
  phone: string;
  email: string;
  tenureYears?: number;
  downPaymentPercent?: number;
  eligibleLoanAmount?: number;
  affordablePrice?: number;
  maxEligibleEmi?: number;
  foirApplied?: number;
};

export type PropertyDocument = Models.Document & {
  name: string;
  location: string;
  configuration?: string;
  price: number;
  carpetArea?: string;
  possession?: string;
  highlights?: string[];
  imageUrl?: string;
  whatsappNumber?: string;
  detailsUrl?: string;
  latitude?: number;
  longitude?: number;
  roi?: number;
  occupancyRate?: number;
  heroImages?: string[];
  videoUrl?: string;
  tags?: string[];
  certification?: string;
};

export { ID, Query };
