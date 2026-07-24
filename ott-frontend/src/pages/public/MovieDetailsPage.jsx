import { PageContainer } from "../../components/layout/PageContainer";
import { Spinner } from "../../components/feedback/Spinner";

export function MovieDetailsPage() {
  return (
    <PageContainer className="page-section">
      <h1 className="sr-only">Movie details</h1>
      <div className="grid min-h-80 place-items-center">
        <Spinner label="Loading movie details" />
      </div>
    </PageContainer>
  );
}
