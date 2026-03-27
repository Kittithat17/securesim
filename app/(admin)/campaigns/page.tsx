//app/%28admin%29/campaigns/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
export const dynamic = "force-dynamic";
export default async function CampaignsPage() {
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Campaigns</h1>

        <Link
          href="/campaigns/new"
          className="px-4 py-2 bg-black text-white rounded"
        >
          + New Campaign
        </Link>
      </div>
      <div className="space-y-4">
        {data?.map((c) => (
          <div key={c.id} className="p-4 border rounded flex justify-between">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
            <Link href={`/campaigns/${c.id}`} className="text-primary">
              View
            </Link>
            
          </div>
        ))}
      </div>
    </div>
  );
}
