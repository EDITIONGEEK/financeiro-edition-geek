import { createFileRoute } from "@tanstack/react-router";
import { PublicCatalogPage } from "../components/catalogs";

export const Route = createFileRoute("/catalogo/$slug")({ component: CatalogRoute });

function CatalogRoute() {
  const { slug } = Route.useParams() as { slug: string };
  return <PublicCatalogPage slug={slug} />;
}
