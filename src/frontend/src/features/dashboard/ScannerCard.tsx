import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQRScanner } from '@/qr-code/useQRScanner';
import { playBeep } from '@/lib/sfx';
import { buildQRPayload, parseQRPayload, QRPayloadData } from '@/lib/qrPayload';
import { loadQRLibrary, generateQRCodeSVG } from '@/lib/qrGenerator';
import { Camera, CameraOff, Loader2, QrCode } from 'lucide-react';

interface ScannerCardProps {
  onScanSuccess: (data: string) => void;
  onAddRecord: (name: string, caseNumber: string, crimeNumber: string, forwardDate: string) => void;
  scannedCaseNumber: string;
  onCaseNumberChange: (value: string) => void;
}

export default function ScannerCard({ 
  onScanSuccess, 
  onAddRecord, 
  scannedCaseNumber,
  onCaseNumberChange 
}: ScannerCardProps) {
  const [name, setName] = useState('');
  const [crimeNumber, setCrimeNumber] = useState('');
  const [forwardDate, setForwardDate] = useState('');
  const [lastScanned, setLastScanned] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [qrLibraryReady, setQrLibraryReady] = useState(false);
  const [generatedQRSVG, setGeneratedQRSVG] = useState('');

  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error: cameraError,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    videoRef,
    canvasRef
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 5,
    jsQRUrl: 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js'
  });

  // Load QR library on mount
  useEffect(() => {
    loadQRLibrary().then(loaded => {
      setQrLibraryReady(loaded);
    });
  }, []);

  // Handle QR scan results
  useEffect(() => {
    if (qrResults.length > 0) {
      const latestResult = qrResults[0];
      const scannedData = latestResult.data;
      setLastScanned(scannedData);
      onScanSuccess(scannedData);
      
      // Try to parse as full payload format
      const parsed = parseQRPayload(scannedData);
      
      if (parsed) {
        // Valid format - auto-fill all fields
        setName(parsed.name);
        onCaseNumberChange(parsed.caseNumber);
        setCrimeNumber(parsed.crimeNumber);
        setForwardDate(parsed.forwardDate);
      } else {
        // Invalid format - fallback to case number only
        onCaseNumberChange(scannedData);
      }
      
      playBeep();
    }
  }, [qrResults, onScanSuccess, onCaseNumberChange]);

  const handleAddRecord = () => {
    setValidationError('');

    if (!name.trim() || !scannedCaseNumber.trim()) {
      setValidationError('Name and Case Number are required');
      return;
    }

    onAddRecord(name, scannedCaseNumber, crimeNumber, forwardDate);
    
    // Clear form fields
    setName('');
    onCaseNumberChange('');
    setCrimeNumber('');
    setForwardDate('');
    setValidationError('');
    
    playBeep();
  };

  // Generate QR code when dialog opens
  const handleGenerateQR = () => {
    if (!qrLibraryReady) return;

    const payload = buildQRPayload({
      name,
      caseNumber: scannedCaseNumber,
      crimeNumber,
      forwardDate
    });

    const svg = generateQRCodeSVG(payload, 256);
    setGeneratedQRSVG(svg);
    setShowQRDialog(true);
  };

  const canGenerateQR = name.trim() && scannedCaseNumber.trim() && qrLibraryReady;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📷 Scanner / Manual Entry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Preview */}
        <div className="space-y-2">
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '200px' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <CameraOff className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Controls */}
          <div className="flex gap-2">
            {!isActive ? (
              <Button
                onClick={startScanning}
                disabled={!canStartScanning || isLoading}
                className="flex-1"
                variant="default"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Scanner
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={stopScanning}
                disabled={isLoading}
                className="flex-1"
                variant="secondary"
              >
                Stop Scanner
              </Button>
            )}
          </div>

          {/* Camera Error */}
          {cameraError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <strong>Camera Error:</strong> {cameraError.message}
              {cameraError.type === 'permission' && (
                <p className="mt-1">Please allow camera access to use the scanner.</p>
              )}
              {cameraError.type === 'not-supported' && (
                <p className="mt-1">Camera scanning is not available in this browser.</p>
              )}
            </div>
          )}

          {/* Scan Status */}
          {lastScanned && (
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
              Last Scanned: {lastScanned}
            </div>
          )}

          {isSupported === false && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              Camera scanning is not available. Please enter case details manually.
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-4">
          {/* Form Fields */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="case-number">Case Number *</Label>
            <Input
              id="case-number"
              type="text"
              placeholder="Case Number"
              value={scannedCaseNumber}
              onChange={(e) => onCaseNumberChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="crime-number">Crime Number</Label>
            <Input
              id="crime-number"
              type="text"
              placeholder="Crime Number"
              value={crimeNumber}
              onChange={(e) => setCrimeNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="forward-date">Forward Date</Label>
            <Input
              id="forward-date"
              type="date"
              value={forwardDate}
              onChange={(e) => setForwardDate(e.target.value)}
            />
          </div>

          {validationError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {validationError}
            </div>
          )}

          {/* Generate QR Code Button */}
          <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
            <Button 
              variant="outline"
              className="w-full"
              disabled={!canGenerateQR}
              onClick={handleGenerateQR}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generated QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <div 
                  className="bg-white p-4 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: generatedQRSVG }}
                />
                <div className="text-sm text-muted-foreground text-center">
                  <p className="font-semibold mb-1">Encoded Data:</p>
                  <p className="break-all">
                    {buildQRPayload({
                      name,
                      caseNumber: scannedCaseNumber,
                      crimeNumber,
                      forwardDate
                    })}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Scan this QR code to auto-fill all fields
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            onClick={handleAddRecord}
            className="w-full bg-[#b21f1f] hover:bg-[#8a1818]"
          >
            Add Record
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
