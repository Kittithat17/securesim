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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Employee = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};



export default async function EmployeesPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase
    .from("recipients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-6 text-red-500">{error.message}</div>;
  }

  const employees = (data ?? []) as Employee[];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {employees.length === 0 ? (
            <div className="text-muted-foreground text-sm">
              No employees found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">
                      {emp.name}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {emp.email}
                    </TableCell>

                    <TableCell className="font-mono text-xs">
                      {emp.id}
                    </TableCell>

                    <TableCell className="text-xs">
                      {new Date(emp.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}