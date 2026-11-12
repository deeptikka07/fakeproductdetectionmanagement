export type UserRole = 'ADMIN' | 'MANUFACTURER' | 'CUSTOMER';

export interface User {
  userId: number;
  username: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface Manufacturer {
  manufacturerId: number;
  manufacturerName: string;
  address: string;
  contact: string;
  email: string;
  userId?: number;
  isVerified?: boolean;
}

export type ProductStatus = 'ACTIVE' | 'BLOCKED';
export type OutcomeOverride = 'DEFAULT' | 'GENUINE' | 'SUSPICIOUS' | 'INVALID' | 'NOT_FOUND';

export interface Product {
  productId: number;
  productName: string;
  brand: string;
  manufacturerId: number;
  productCode: string; // UNIQUE
  manufacturingDate: string;
  status: ProductStatus;
  outcomeOverride?: OutcomeOverride;
  category?: string;
  batchNumber?: string;
  mrp?: number;
}

export type VerificationResult = 'GENUINE' | 'INVALID' | 'SUSPICIOUS' | 'NOT_FOUND';

export interface VerificationHistory {
  verificationId: number;
  productCode: string;
  verificationDate: string; // YYYY-MM-DD
  verificationTime: string; // HH:mm:ss
  result: VerificationResult;
  ipAddress?: string;
  notes?: string;
  scanCountAtVerification?: number;
}

export type ComplaintStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED';

export interface Complaint {
  complaintId: number;
  productId?: number;
  productCode: string;
  userId?: number;
  userName: string;
  userEmail: string;
  description: string;
  complaintDate: string;
  status: ComplaintStatus;
  adminRemarks?: string;
  resolvedAt?: string;
}

export interface VerificationEvaluation {
  result: VerificationResult;
  product?: Product;
  manufacturer?: Manufacturer;
  totalScanCount: number;
  threshold: number;
  verificationDate: string;
  verificationTime: string;
  message: string;
  isFirstVerification: boolean;
}
