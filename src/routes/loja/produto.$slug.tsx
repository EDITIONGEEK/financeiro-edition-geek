import { createFileRoute, notFound } from "@tanstack/react-router";
import { PublicStore } from "../../components/public-store";
import { findPublicProduct } from "../../lib/public-store";

export const Route = createFileRoute("/loja/produto/$slug")({ component: ProductPage });

function ProductPage() {
  const { slug } = Route.useParams();
  const product = findPublicProduct(slug);
  if (!product) throw notFound();
  return <PublicStore selectedProduct={product} />;
}
