export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CampaignTarget = {
  token: string | null;
  landing_type: string | null;
  sent_at: string | null;
  clicked_at: string | null;
  submitted_at: string | null;
  submitted_email: string | null;
  submitted_username: string | null;
  submitted_password: string | null;
  recipients: {
    name: string;
    email: string;
  } | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function CampaignDetail({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params; // 👈 ต้อง await
  
    if (!id) {
      return <div className="p-6 text-red-500">Invalid campaign ID</div>;
    }
  

  const { data, error } = await supabase
    .from("campaign_targets")
    .select(`
      token,
      landing_type,
      sent_at,
      clicked_at,
      submitted_at,
      submitted_email,
      submitted_username,
      submitted_password,
      recipients:recipient_id (
        name,
        email
      )
    `)
    .eq("campaign_id", id);

  if (error) {
    return (
      <div className="p-6 text-red-500">
        {error.message}
      </div>
    );
  }

  const targets = (data ?? []) as unknown as CampaignTarget[];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Targets</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {targets.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No targets found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Landing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted Email</TableHead>
                  <TableHead>Submitted Username</TableHead>
                  <TableHead>Password</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {targets.map((row, index) => {
                  const status = row.submitted_at
                    ? "Submitted"
                    : row.clicked_at
                    ? "Clicked"
                    : "Pending";

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">
                          {row.recipients?.name ?? "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {row.recipients?.email ?? "—"}
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-xs">
                        {row.token ?? "—"}
                      </TableCell>

                      <TableCell>
                        {row.landing_type ?? "—"}
                      </TableCell>

                      <TableCell>
                        {status === "Submitted" && (
                          <Badge>Submitted</Badge>
                        )}
                        {status === "Clicked" && (
                          <Badge variant="secondary">Clicked</Badge>
                        )}
                        {status === "Pending" && (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        {row.submitted_email ?? "—"}
                      </TableCell>

                      <TableCell>
                        {row.submitted_username ?? "—"}
                      </TableCell>

                      <TableCell className="font-mono text-xs">
                        {row.submitted_password ?? "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
