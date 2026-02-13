import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/lib/csv';
import type { CaseRecord } from '@/backend';

interface RecordedCasesTableProps {
  records: CaseRecord[];
}

export default function RecordedCasesTable({ records }: RecordedCasesTableProps) {
  const handleDownloadCSV = () => {
    exportToCSV(records);
  };

  // Sort records by createdAt descending (newest first)
  const sortedRecords = [...records].sort((a, b) => {
    return Number(b.createdAt - a.createdAt);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={handleDownloadCSV}
          className="bg-[#27ae60] hover:bg-[#229954]"
          disabled={records.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Case No.</TableHead>
              <TableHead>Crime No.</TableHead>
              <TableHead>Forward Date</TableHead>
              <TableHead>Manual Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No records yet. Add your first case record above.
                </TableCell>
              </TableRow>
            ) : (
              sortedRecords.map((record, index) => (
                <TableRow key={`${record.caseNumber}-${record.createdAt}-${index}`}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.caseNumber}</TableCell>
                  <TableCell>{record.crimeNumber || '-'}</TableCell>
                  <TableCell>{record.forwardDate || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.manualNote || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
