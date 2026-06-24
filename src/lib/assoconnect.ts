import "server-only";

const BASE_URL = process.env.ASSOCONNECT_BASE_URL ?? "https://app.assoconnect.com/api/v1";

export type Organization = {
  "@id": string;
  "@type": string;
  brand: string;
  isAdvanced: boolean;
  isLegalIndependent: boolean;
  logoUrl: string;
  name: string;
  parent: string | null;
  phoneNumber: string;
  url: string;
};

async function request<T>(path: string): Promise<T> {
  const token = process.env.ASSOCONNECT_API_KEY;
  if (!token) throw new Error("ASSOCONNECT_API_KEY is not set");

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/ld+json",
      "X-AUTH-TOKEN": token,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`AssoConnect ${path} failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export function getOrganization(ulid = process.env.ASSOCONNECT_ORGANIZATION_ULID) {
  if (!ulid) throw new Error("ASSOCONNECT_ORGANIZATION_ULID is not set");
  return request<Organization>(`/organizations/${ulid}`);
}

export type ContactPostalAddress = {
  city: string | null;
  postal: string | null;
  street1: string | null;
  country: string;
  formattedAddress: string;
};

export type ContactRelation = {
  id: string;
  type: "MEMBERSHIP" | "AFFILIATION" | "DONATION";
  transactionId: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type Contact = {
  "@id": string;
  firstname: string;
  lastname: string;
  email: string | null;
  mobilePhone: string | null;
  landlinePhone: string | null;
  profilPictureUrl: string;
  postalAddress: ContactPostalAddress | null;
  relations: ContactRelation[];
};

export type ContactsPage = {
  "hydra:totalItems": number;
  "hydra:member": Contact[];
};

export function listContacts(organizationId: string, page = 1): Promise<ContactsPage> {
  if (!/^[A-Z0-9]{10,40}$/i.test(organizationId)) {
    throw new Error("Organization ID invalide");
  }
  return request<ContactsPage>(
    `/organizations/${organizationId}/contacts?page=${page}&itemsPerPage=25`
  );
}
