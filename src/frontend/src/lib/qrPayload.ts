/**
 * QR payload utilities for encoding and decoding case record data.
 * Format: Name|CaseNo|CrimeNo|Date
 */

const DELIMITER = '|';

export interface QRPayloadData {
  name: string;
  caseNumber: string;
  crimeNumber: string;
  forwardDate: string;
}

/**
 * Build QR payload string from form values
 */
export function buildQRPayload(data: QRPayloadData): string {
  const { name, caseNumber, crimeNumber, forwardDate } = data;
  return [
    name.trim(),
    caseNumber.trim(),
    crimeNumber.trim(),
    forwardDate.trim()
  ].join(DELIMITER);
}

/**
 * Parse scanned QR code data
 * Returns parsed data if valid format, null otherwise
 */
export function parseQRPayload(scannedValue: string): QRPayloadData | null {
  if (!scannedValue) return null;
  
  const parts = scannedValue.split(DELIMITER);
  
  // Must have exactly 4 parts for valid format
  if (parts.length !== 4) {
    return null;
  }
  
  return {
    name: parts[0] || '',
    caseNumber: parts[1] || '',
    crimeNumber: parts[2] || '',
    forwardDate: parts[3] || ''
  };
}
