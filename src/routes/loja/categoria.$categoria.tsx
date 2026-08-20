import { createFileRoute } from "@tanstack/react-router";
import { PublicStore } from "../../components/public-store";

export const Route = createFileRoute("/loja/categoria/$categoria")({ component: CategoryPage });

function CategoryPage() {
  const { categoria } = Route.useParams();
  return <PublicStore category={categoria} />;
}
