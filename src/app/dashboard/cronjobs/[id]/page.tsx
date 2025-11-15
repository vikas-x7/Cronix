import JobDetail from "@/client/dashboard/pages/JobDetail";

type Params = { params: Promise<{ id: string }> };

export default async function JobDetailPage({ params }: Params) {
    const { id } = await params;
    return <JobDetail jobId={id} />;
}
