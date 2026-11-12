import { VerificationHistory } from '../types';

export function exportVerificationsToCSV(verifications: VerificationHistory[]): void {
  const headers = ['Verification ID', 'Product Code', 'Verification Date', 'Verification Time', 'Result', 'IP Address', 'Notes'];
  
  const rows = verifications.map(v => [
    v.verificationId,
    `"${v.productCode}"`,
    `"${v.verificationDate}"`,
    `"${v.verificationTime}"`,
    `"${v.result}"`,
    `"${v.ipAddress || '127.0.0.1'}"`,
    `"${(v.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `verification_audit_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
