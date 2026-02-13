import type { CaseRecord } from '@/backend';

function escapeCSVValue(value: string | undefined | null): string {
  if (!value) return '""';
  
  // Convert to string and escape quotes
  const stringValue = String(value);
  
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return `"${stringValue}"`;
}

export function exportToCSV(records: CaseRecord[]) {
  // CSV Header
  const headers = ['Name', 'Case No', 'Crime No', 'Forward Date', 'Note'];
  let csv = headers.join(',') + '\n';

  // Sort records by createdAt descending (newest first) to match table order
  const sortedRecords = [...records].sort((a, b) => {
    return Number(b.createdAt - a.createdAt);
  });

  // CSV Rows
  sortedRecords.forEach(record => {
    const row = [
      escapeCSVValue(record.name),
      escapeCSVValue(record.caseNumber),
      escapeCSVValue(record.crimeNumber || ''),
      escapeCSVValue(record.forwardDate || ''),
      escapeCSVValue(record.manualNote)
    ];
    csv += row.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'CJM_Case_Data.csv';
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}
