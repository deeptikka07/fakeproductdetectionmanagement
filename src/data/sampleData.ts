import { User, Manufacturer, Product, VerificationHistory, Complaint, ComplaintStatus, VerificationEvaluation, VerificationResult, OutcomeOverride } from '../types';

export const SUSPICIOUS_SCAN_THRESHOLD = 3;

export const INITIAL_USERS: User[] = [
  {
    userId: 1,
    username: 'admin',
    passwordHash: '$2a$10$wK1eT76S9tXqXm9R5gC8fOiO1Z6d1Z8jK3L8n5v9m2P1q4X7y0ZaW', // 'admin123'
    role: 'ADMIN',
    fullName: 'System Administrator',
    email: 'admin@fakeproductdetection.org',
    createdAt: '2025-01-15'
  },
  {
    userId: 2,
    username: 'apple_mfg',
    passwordHash: '$2a$10$wK1eT76S9tXqXm9R5gC8fOiO1Z6d1Z8jK3L8n5v9m2P1q4X7y0ZaW', // 'mfg123'
    role: 'MANUFACTURER',
    fullName: 'Apple Authorized Operations',
    email: 'compliance@apple-partner.com',
    createdAt: '2025-01-20'
  },
  {
    userId: 3,
    username: 'nike_mfg',
    passwordHash: '$2a$10$wK1eT76S9tXqXm9R5gC8fOiO1Z6d1Z8jK3L8n5v9m2P1q4X7y0ZaW', // 'mfg123'
    role: 'MANUFACTURER',
    fullName: 'Nike Global Authentication',
    email: 'verify@nike-brandprotection.com',
    createdAt: '2025-02-01'
  },
  {
    userId: 4,
    username: 'john_customer',
    passwordHash: '$2a$10$wK1eT76S9tXqXm9R5gC8fOiO1Z6d1Z8jK3L8n5v9m2P1q4X7y0ZaW', // 'pass123'
    role: 'CUSTOMER',
    fullName: 'John Doe',
    email: 'john.doe@gmail.com',
    createdAt: '2025-02-10'
  }
];

export const INITIAL_MANUFACTURERS: Manufacturer[] = [
  {
    manufacturerId: 1,
    manufacturerName: 'Apple Authorized Manufacturing Asia Ltd',
    address: 'One Infinite Loop, Cupertino, CA / Foxconn Logistics Hub, Taipei',
    contact: '+1-800-692-7753',
    email: 'anti-counterfeit@apple.com',
    userId: 2,
    isVerified: true
  },
  {
    manufacturerId: 2,
    manufacturerName: 'Nike Global Products & Apparel Inc',
    address: 'One Bowerman Drive, Beaverton, OR, USA',
    contact: '+1-800-344-6453',
    email: 'authenticity@nike.com',
    userId: 3,
    isVerified: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    productId: 1,
    productName: 'iPhone 16 Pro Max 256GB - Titanium Natural',
    brand: 'Apple',
    manufacturerId: 1,
    productCode: 'APPL-9821-X901',
    manufacturingDate: '2025-09-18',
    status: 'ACTIVE',
    category: 'Electronics & Mobile',
    batchNumber: 'BATCH-2025-A18',
    mrp: 1199
  },
  {
    productId: 2,
    productName: 'Air Jordan 1 Retro High OG - Chicago Colorway',
    brand: 'Nike',
    manufacturerId: 2,
    productCode: 'NIKE-AIR-4421',
    manufacturingDate: '2025-08-12',
    status: 'ACTIVE',
    category: 'Footwear & Apparel',
    batchNumber: 'BATCH-2025-NJ01',
    mrp: 180
  },
  {
    productId: 3,
    productName: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    manufacturerId: 1,
    productCode: 'SONY-WH-1002',
    manufacturingDate: '2025-07-22',
    status: 'ACTIVE',
    category: 'Audio Devices',
    batchNumber: 'BATCH-2025-SN05',
    mrp: 399
  },
  {
    productId: 4,
    productName: 'Rolex Submariner Date 41mm Oystersteel',
    brand: 'Rolex',
    manufacturerId: 1,
    productCode: 'ROLEX-SUB-7701',
    manufacturingDate: '2025-04-10',
    status: 'ACTIVE',
    category: 'Luxury Watches',
    batchNumber: 'BATCH-2025-RX77',
    mrp: 10250
  },
  {
    productId: 5,
    productName: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    brand: 'Samsung',
    manufacturerId: 1,
    productCode: 'SAMS-S24-9912',
    manufacturingDate: '2025-06-05',
    status: 'ACTIVE',
    category: 'Smartphones',
    batchNumber: 'BATCH-2025-SM99',
    mrp: 1299
  },
  {
    productId: 6,
    productName: 'Nike Air Max 90 Infrared Edition (HIGH DUPLICATION SUSPECT)',
    brand: 'Nike',
    manufacturerId: 2,
    productCode: 'NIKE-AIR-8899',
    manufacturingDate: '2025-05-14',
    status: 'ACTIVE',
    category: 'Footwear & Apparel',
    batchNumber: 'BATCH-2025-NK88',
    mrp: 140
  },
  {
    productId: 7,
    productName: 'MacBook Pro 16-inch M3 Max (MULTIPLE ATTEMPTS DETECTED)',
    brand: 'Apple',
    manufacturerId: 1,
    productCode: 'APPL-MBP-3312',
    manufacturingDate: '2025-03-29',
    status: 'ACTIVE',
    category: 'Computing',
    batchNumber: 'BATCH-2025-MB33',
    mrp: 2499
  },
  {
    productId: 8,
    productName: 'Anker PowerCore 24K Recalled Battery Unit',
    brand: 'Anker',
    manufacturerId: 1,
    productCode: 'RECALLED-BAT-001',
    manufacturingDate: '2025-01-10',
    status: 'BLOCKED',
    category: 'Accessories & Batteries',
    batchNumber: 'BATCH-2025-RECALL-9',
    mrp: 149
  },
  {
    productId: 9,
    productName: 'SmartWatch Pro Series Defective Sensor Model',
    brand: 'Apple',
    manufacturerId: 1,
    productCode: 'DEFECT-WATCH-99',
    manufacturingDate: '2025-02-15',
    status: 'BLOCKED',
    category: 'Wearables',
    batchNumber: 'BATCH-2025-DEF-02',
    mrp: 399
  },
  {
    productId: 10,
    productName: 'Chanel Coco Mademoiselle Eau De Parfum 100ml',
    brand: 'Chanel',
    manufacturerId: 2,
    productCode: 'LUX-PARFUM-551',
    manufacturingDate: '2025-08-30',
    status: 'ACTIVE',
    category: 'Fragrances & Cosmetics',
    batchNumber: 'BATCH-2025-CH55',
    mrp: 165
  }
];

export const INITIAL_VERIFICATIONS: VerificationHistory[] = [
  // Prior verifications for NIKE-AIR-8899 (already 4 times -> triggers SUSPICIOUS)
  {
    verificationId: 1,
    productCode: 'NIKE-AIR-8899',
    verificationDate: '2025-10-10',
    verificationTime: '10:14:22',
    result: 'GENUINE',
    ipAddress: '192.168.1.45',
    notes: 'Initial consumer purchase verification in retail store.'
  },
  {
    verificationId: 2,
    productCode: 'NIKE-AIR-8899',
    verificationDate: '2025-10-14',
    verificationTime: '14:20:05',
    result: 'GENUINE',
    ipAddress: '172.56.21.90',
    notes: 'Customer unboxing check.'
  },
  {
    verificationId: 3,
    productCode: 'NIKE-AIR-8899',
    verificationDate: '2025-10-18',
    verificationTime: '09:05:41',
    result: 'GENUINE',
    ipAddress: '103.21.244.2',
    notes: 'Reseller inspection scan.'
  },
  {
    verificationId: 4,
    productCode: 'NIKE-AIR-8899',
    verificationDate: '2025-10-22',
    verificationTime: '19:44:18',
    result: 'SUSPICIOUS',
    ipAddress: '45.112.87.11',
    notes: 'Exceeded threshold of 3 verifications. Suspected duplicated packaging code.'
  },
  // Prior verifications for APPL-MBP-3312 (5 times -> SUSPICIOUS)
  {
    verificationId: 5,
    productCode: 'APPL-MBP-3312',
    verificationDate: '2025-09-01',
    verificationTime: '11:00:12',
    result: 'GENUINE',
    ipAddress: '192.168.0.12',
    notes: 'Authorized reseller audit.'
  },
  {
    verificationId: 6,
    productCode: 'APPL-MBP-3312',
    verificationDate: '2025-09-15',
    verificationTime: '16:30:45',
    result: 'GENUINE',
    ipAddress: '192.168.0.15',
    notes: 'Warehouse scan.'
  },
  {
    verificationId: 7,
    productCode: 'APPL-MBP-3312',
    verificationDate: '2025-10-02',
    verificationTime: '12:15:30',
    result: 'GENUINE',
    ipAddress: '185.220.101.5',
    notes: 'Third party marketplace query.'
  },
  {
    verificationId: 8,
    productCode: 'APPL-MBP-3312',
    verificationDate: '2025-10-19',
    verificationTime: '18:22:10',
    result: 'SUSPICIOUS',
    ipAddress: '91.240.118.89',
    notes: 'Scan #4 from overseas IP.'
  },
  // Single prior scan for ROLEX-SUB-7701
  {
    verificationId: 9,
    productCode: 'ROLEX-SUB-7701',
    verificationDate: '2025-10-05',
    verificationTime: '15:10:00',
    result: 'GENUINE',
    ipAddress: '192.168.1.100',
    notes: 'Boutique register verification.'
  },
  // One invalid verification logged
  {
    verificationId: 10,
    productCode: 'RECALLED-BAT-001',
    verificationDate: '2025-10-25',
    verificationTime: '13:05:12',
    result: 'INVALID',
    ipAddress: '114.79.18.23',
    notes: 'Product status marked BLOCKED by manufacturer.'
  },
  // One not-found verification logged
  {
    verificationId: 11,
    productCode: 'FAKE-9999-XYZ',
    verificationDate: '2025-10-26',
    verificationTime: '21:12:44',
    result: 'NOT_FOUND',
    ipAddress: '202.14.88.9',
    notes: 'Code not present in central database.'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    complaintId: 1,
    productId: 6,
    productCode: 'NIKE-AIR-8899',
    userId: 4,
    userName: 'John Doe',
    userEmail: 'john.doe@gmail.com',
    description: 'Purchased from a local retailer. Box serial code NIKE-AIR-8899 gave a Suspicious warning on scanner. Sole stitching feels sub-standard and glue smell is strong.',
    complaintDate: '2025-10-23',
    status: 'REVIEWED',
    adminRemarks: 'Field inspector dispatched to verify retail lot #44 in Chicago.'
  },
  {
    complaintId: 2,
    productId: 8,
    productCode: 'RECALLED-BAT-001',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@outlook.com',
    description: 'Seller claimed battery was brand new authentic Anker, but verification system flagged it as INVALID/RECALLED. Requesting guidance for consumer refund.',
    complaintDate: '2025-10-26',
    status: 'RESOLVED',
    adminRemarks: 'Product confirmed from recalled battery batch. Sent official recall certificate to consumer for retailer chargeback.',
    resolvedAt: '2025-10-27'
  },
  {
    complaintId: 3,
    productId: 7,
    productCode: 'APPL-MBP-3312',
    userName: 'Marcus Vance',
    userEmail: 'mvance@techfirm.co',
    description: 'Bought refurbished unit from third party online vendor. Serial code had already been verified 5 times and was flagged as Suspicious.',
    complaintDate: '2025-10-28',
    status: 'PENDING',
    adminRemarks: ''
  }
];

const STORAGE_KEYS = {
  USERS: 'fpdms_users_v1',
  MANUFACTURERS: 'fpdms_manufacturers_v1',
  PRODUCTS: 'fpdms_products_v1',
  VERIFICATIONS: 'fpdms_verifications_v1',
  COMPLAINTS: 'fpdms_complaints_v1',
  CURRENT_USER: 'fpdms_current_user_v1'
};

export class ProductDatabaseService {
  private static get<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private static set<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  static getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static getManufacturers(): Manufacturer[] {
    return this.get<Manufacturer[]>(STORAGE_KEYS.MANUFACTURERS, INITIAL_MANUFACTURERS);
  }

  static getProducts(): Product[] {
    return this.get<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }

  static getVerifications(): VerificationHistory[] {
    return this.get<VerificationHistory[]>(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS);
  }

  static getComplaints(): Complaint[] {
    return this.get<Complaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  }

  static getCurrentUser(): User | null {
    return this.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  static setCurrentUser(user: User | null): void {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.MANUFACTURERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.VERIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  /**
   * Core Verification Logic matching VerifyServlet.java:
   * 1. Code not in database -> "Not Found"
   * 2. Code exists but product status is blocked/inactive -> "Invalid"
   * 3. Prior successful verification count >= 3 (threshold) -> "Suspicious"
   * 4. Otherwise -> "Genuine"
   * 5. Record every verification into VERIFICATION_HISTORY
   */
  static verifyProductCode(code: string, ipAddress: string = '127.0.0.1'): VerificationEvaluation {
    const cleanCode = code.trim().toUpperCase();
    const products = this.getProducts();
    const manufacturers = this.getManufacturers();
    const verifications = this.getVerifications();

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const matchedProduct = products.find(p => p.productCode.toUpperCase() === cleanCode);
    const matchedManufacturer = matchedProduct
      ? manufacturers.find(m => m.manufacturerId === matchedProduct.manufacturerId)
      : undefined;

    // Count past verifications for this code
    const priorVerifications = verifications.filter(v => v.productCode.toUpperCase() === cleanCode);
    const priorCount = priorVerifications.length;

    let result: VerificationResult;
    let message = '';
    let isFirst = priorCount === 0;

    if (!matchedProduct) {
      result = 'NOT_FOUND';
      message = 'Unrecognized product code. This item is not registered in our manufacturer database. High risk of counterfeit.';
    } else if (matchedProduct.outcomeOverride && matchedProduct.outcomeOverride !== 'DEFAULT') {
      // ADMIN OVERRIDE OUTCOME takes precedence
      result = matchedProduct.outcomeOverride as VerificationResult;
      if (result === 'GENUINE') {
        message = 'Administrator Policy Override: Product authenticated and verified as GENUINE by Administrator.';
      } else if (result === 'SUSPICIOUS') {
        message = 'Administrator Security Alert: Product flagged as SUSPICIOUS by Administrator investigation.';
      } else if (result === 'INVALID') {
        message = 'Administrator Action: Product designated as INVALID / RECALLED by Administrator.';
      } else {
        result = 'NOT_FOUND';
        message = 'Administrator Action: Product code removed or designated as NOT FOUND by Administrator.';
      }
    } else if (matchedProduct.status === 'BLOCKED') {
      result = 'INVALID';
      message = 'This product was previously registered but has been revoked, flagged as recalled, or marked inactive by the manufacturer.';
    } else if (priorCount >= SUSPICIOUS_SCAN_THRESHOLD) {
      result = 'SUSPICIOUS';
      message = `Warning: This product code has been verified ${priorCount + 1} times across different sessions. Genuine codes are typically verified 1 to 2 times upon customer unboxing. Repeated verification strongly suggests duplicate packaging or copied QR codes.`;
    } else {
      result = 'GENUINE';
      message = isFirst
        ? 'Verified Authentic! This is the first recorded customer verification for this unique security code.'
        : `Verified Authentic! This product code is genuine and within the standard verification threshold (Scan ${priorCount + 1} of ${SUSPICIOUS_SCAN_THRESHOLD}).`;
    }

    // Save attempt to history
    const newVerification: VerificationHistory = {
      verificationId: verifications.length > 0 ? Math.max(...verifications.map(v => v.verificationId)) + 1 : 1,
      productCode: cleanCode,
      verificationDate: dateStr,
      verificationTime: timeStr,
      result: result,
      ipAddress: ipAddress,
      notes: `Verification attempt via Web Console (${result}).`,
      scanCountAtVerification: priorCount + 1
    };

    const updatedVerifications = [newVerification, ...verifications];
    this.set(STORAGE_KEYS.VERIFICATIONS, updatedVerifications);

    return {
      result,
      product: matchedProduct,
      manufacturer: matchedManufacturer,
      totalScanCount: priorCount + 1,
      threshold: SUSPICIOUS_SCAN_THRESHOLD,
      verificationDate: dateStr,
      verificationTime: timeStr,
      message,
      isFirstVerification: isFirst
    };
  }

  static addProduct(product: Omit<Product, 'productId'>): Product {
    const products = this.getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.productId)) + 1 : 1;
    const newProduct: Product = {
      ...product,
      productId: newId,
      productCode: product.productCode.trim().toUpperCase(),
      outcomeOverride: product.outcomeOverride || 'DEFAULT'
    };
    this.set(STORAGE_KEYS.PRODUCTS, [newProduct, ...products]);
    return newProduct;
  }

  static updateProductStatus(productId: number, status: 'ACTIVE' | 'BLOCKED'): void {
    const products = this.getProducts();
    const updated = products.map(p => p.productId === productId ? { ...p, status } : p);
    this.set(STORAGE_KEYS.PRODUCTS, updated);
  }

  static updateProductOutcome(productId: number, outcomeOverride: OutcomeOverride): void {
    const products = this.getProducts();
    const updated = products.map(p => p.productId === productId ? { ...p, outcomeOverride } : p);
    this.set(STORAGE_KEYS.PRODUCTS, updated);
  }

  static updateProduct(productId: number, updates: Partial<Product>): void {
    const products = this.getProducts();
    const updated = products.map(p => p.productId === productId ? { ...p, ...updates } : p);
    this.set(STORAGE_KEYS.PRODUCTS, updated);
  }

  static deleteProduct(productId: number): void {
    const products = this.getProducts();
    this.set(STORAGE_KEYS.PRODUCTS, products.filter(p => p.productId !== productId));
  }

  static updateVerificationOutcome(verificationId: number, newResult: VerificationResult, notes?: string): void {
    const verifications = this.getVerifications();
    const updated = verifications.map(v => {
      if (v.verificationId === verificationId) {
        return {
          ...v,
          result: newResult,
          notes: notes !== undefined ? notes : v.notes
        };
      }
      return v;
    });
    this.set(STORAGE_KEYS.VERIFICATIONS, updated);
  }

  static deleteVerification(verificationId: number): void {
    const verifications = this.getVerifications();
    this.set(STORAGE_KEYS.VERIFICATIONS, verifications.filter(v => v.verificationId !== verificationId));
  }

  static submitComplaint(complaint: Omit<Complaint, 'complaintId' | 'complaintDate' | 'status'>): Complaint {
    const complaints = this.getComplaints();
    const products = this.getProducts();
    const matched = products.find(p => p.productCode.toUpperCase() === complaint.productCode.trim().toUpperCase());

    const newId = complaints.length > 0 ? Math.max(...complaints.map(c => c.complaintId)) + 1 : 1;
    const newComplaint: Complaint = {
      ...complaint,
      complaintId: newId,
      productId: matched ? matched.productId : undefined,
      complaintDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      adminRemarks: ''
    };
    this.set(STORAGE_KEYS.COMPLAINTS, [newComplaint, ...complaints]);
    return newComplaint;
  }

  static updateComplaintStatus(complaintId: number, status: ComplaintStatus, remarks: string): void {
    const complaints = this.getComplaints();
    const updated = complaints.map(c => {
      if (c.complaintId === complaintId) {
        return {
          ...c,
          status,
          adminRemarks: remarks,
          resolvedAt: status === 'RESOLVED' ? new Date().toISOString().split('T')[0] : c.resolvedAt
        };
      }
      return c;
    });
    this.set(STORAGE_KEYS.COMPLAINTS, updated);
  }

  static addManufacturer(mfr: Omit<Manufacturer, 'manufacturerId'>): Manufacturer {
    const list = this.getManufacturers();
    const newId = list.length > 0 ? Math.max(...list.map(m => m.manufacturerId)) + 1 : 1;
    const created: Manufacturer = {
      ...mfr,
      manufacturerId: newId,
      isVerified: true
    };
    this.set(STORAGE_KEYS.MANUFACTURERS, [...list, created]);
    return created;
  }

  static deleteManufacturer(manufacturerId: number): void {
    const list = this.getManufacturers();
    this.set(STORAGE_KEYS.MANUFACTURERS, list.filter(m => m.manufacturerId !== manufacturerId));
  }

  static deleteUser(userId: number): void {
    const list = this.getUsers();
    this.set(STORAGE_KEYS.USERS, list.filter(u => u.userId !== userId));
  }
}
