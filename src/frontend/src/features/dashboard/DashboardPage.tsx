import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScannerCard from './ScannerCard';
import RecordedCasesTable from '../cases/RecordedCasesTable';
import { useCaseRecords, useAddCaseRecord } from '../cases/caseQueries';
import { getLiveLink, copyToClipboard } from '@/lib/liveLink';
import { Loader2, Link2, Check } from 'lucide-react';

interface DashboardPageProps {
  onLogout: () => void;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [manualNote, setManualNote] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  
  const { data: records = [], isLoading, error } = useCaseRecords();
  const addRecordMutation = useAddCaseRecord();

  const handleScanSuccess = (scannedData: string) => {
    setCaseNumber(scannedData);
  };

  const handleAddRecord = (name: string, caseNum: string, crimeNum: string, forwardDate: string) => {
    addRecordMutation.mutate({
      name,
      caseNumber: caseNum,
      crimeNumber: crimeNum || null,
      forwardDate: forwardDate || null,
      manualNote
    });
  };

  const handleCopyLink = async () => {
    const link = getLiveLink();
    const success = await copyToClipboard(link);
    
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-[#1a2a6c] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CJM3 - Case Management</h1>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleCopyLink}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              {linkCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Copy Live Link
                </>
              )}
            </Button>
            <Button 
              variant="secondary" 
              onClick={onLogout}
              className="bg-white text-[#b21f1f] hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Manual Note Box */}
        <Card className="border-l-4 border-l-[#fdbb2d]">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                📝 General Manual Typing / Notes:
              </label>
              <Textarea
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                placeholder="Type your notes here. They will be saved with the record..."
                rows={2}
                className="resize-y"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scanner Card */}
          <div className="lg:col-span-1">
            <ScannerCard 
              onScanSuccess={handleScanSuccess}
              onAddRecord={handleAddRecord}
              scannedCaseNumber={caseNumber}
              onCaseNumberChange={setCaseNumber}
            />
          </div>

          {/* Recorded Cases Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Recorded Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    Error loading records. Please try again.
                  </div>
                ) : (
                  <RecordedCasesTable records={records} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'cjm-case-management'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
