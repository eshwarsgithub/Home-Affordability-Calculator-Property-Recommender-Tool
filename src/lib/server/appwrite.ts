import { Client, Databases, ID, Query, Models } from "node-appwrite";

type AppwriteConfig = {
  endpoint: string;
  projectId: string;
  apiKey: string;
  databaseId?: string;
  leadsCollectionId?: string;
  propertiesCollectionId?: string;
};

const getConfig = (): AppwriteConfig => {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const leadsCollectionId = process.env.APPWRITE_LEADS_COLLECTION_ID;
  const propertiesCollectionId = process.env.APPWRITE_PROPERTIES_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey) {
    throw new Error("Missing Appwrite credentials: configure APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, and APPWRITE_API_KEY.");
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

type DatabaseIdRequest = "leads" | "properties";

export function getDatabaseIds(): {
  databaseId: string;
  leadsCollectionId: string;
  propertiesCollectionId: string;
};
export function getDatabaseIds(request: "leads"): {
  databaseId: string;
  leadsCollectionId: string;
};
export function getDatabaseIds(request: "properties"): {
  databaseId: string;
  propertiesCollectionId: string;
};
export function getDatabaseIds(request1: "leads", request2: "properties"): {
  databaseId: string;
  leadsCollectionId: string;
  propertiesCollectionId: string;
};
export function getDatabaseIds(...requests: DatabaseIdRequest[]) {
  const { databaseId, leadsCollectionId, propertiesCollectionId } = getConfig();

  if (!databaseId) {
    throw new Error("Missing Appwrite database id: set APPWRITE_DATABASE_ID.");
  }

  const needs = requests.length > 0 ? requests : ["leads", "properties"];

  const result: {
    databaseId: string;
    leadsCollectionId?: string;
    propertiesCollectionId?: string;
  } = { databaseId };

  const requiresLeads = needs.includes("leads");
  const requiresProperties = needs.includes("properties");

  if (requiresLeads) {
    if (!leadsCollectionId) {
      throw new Error("Missing Appwrite leads collection id: set APPWRITE_LEADS_COLLECTION_ID.");
    }
    result.leadsCollectionId = leadsCollectionId;
  }

  if (requiresProperties) {
    if (!propertiesCollectionId) {
      throw new Error("Missing Appwrite properties collection id: set APPWRITE_PROPERTIES_COLLECTION_ID.");
    }
    result.propertiesCollectionId = propertiesCollectionId;
  }

  if (requiresLeads && requiresProperties) {
    return result as {
      databaseId: string;
      leadsCollectionId: string;
      propertiesCollectionId: string;
    };
  }

  if (requiresLeads) {
    return result as {
      databaseId: string;
      leadsCollectionId: string;
    };
  }

  if (requiresProperties) {
    return result as {
      databaseId: string;
      propertiesCollectionId: string;
    };
  }

  return result as {
    databaseId: string;
    leadsCollectionId: string;
    propertiesCollectionId: string;
  };
}

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
};

export { ID, Query };
