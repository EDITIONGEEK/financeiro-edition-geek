export type CatalogPhoto = { url: string; cropX: number; cropY: number; order: number };

export type CatalogProduct = {
  id: string;
  catalogId: string;
  name: string;
  photoUrl: string;
  price: number;
  description: string;
  available: boolean;
  order: number;
  cropX: number;
  cropY: number;
  photos: CatalogPhoto[];
};

export type Catalog = {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  status: "active" | "inactive";
  validUntil: string;
  createdAt: string;
  products: CatalogProduct[];
};

const storageKey = "edition-geek-catalogs";

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function readCatalogs(): Catalog[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(storageKey) || "[]") as Catalog[]; } catch { return []; }
}

export function writeCatalogs(catalogs: Catalog[]) {
  localStorage.setItem(storageKey, JSON.stringify(catalogs));
  window.dispatchEvent(new Event("edition-geek-catalogs-changed"));
}

export function newCatalog(): Catalog {
  return { id: crypto.randomUUID(), name: "", slug: "", description: "", coverImageUrl: "", status: "inactive", validUntil: "", createdAt: new Date().toISOString().slice(0, 10), products: [] };
}

export function newCatalogProduct(catalogId: string, order = 0): CatalogProduct {
  return { id: crypto.randomUUID(), catalogId, name: "", photoUrl: "", price: 0, description: "", available: true, order, cropX: 50, cropY: 50, photos: [] };
}

export function catalogIsAvailable(catalog: Catalog) {
  return catalog.status === "active" && (!catalog.validUntil || catalog.validUntil >= new Date().toISOString().slice(0, 10));
}
