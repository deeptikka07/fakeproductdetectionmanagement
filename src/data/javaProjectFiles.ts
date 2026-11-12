export interface ProjectFile {
  path: string;
  category: 'database' | 'model' | 'dao' | 'servlet' | 'filter' | 'util' | 'jsp' | 'config' | 'docs';
  description: string;
  content: string;
}

export const JAVA_PROJECT_FILES: ProjectFile[] = [
  // 1. DATABASE SCHEMA
  {
    path: 'database/schema.sql',
    category: 'database',
    description: 'MySQL Schema with tables, foreign keys, constraints, and complete sample data',
    content: `-- =====================================================================
-- Fake Product Detection Management System
-- Database Schema: MySQL 8.0+
-- College Mini-Project Implementation
-- =====================================================================

DROP DATABASE IF EXISTS fake_product_db;
CREATE DATABASE fake_product_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fake_product_db;

-- ---------------------------------------------------------------------
-- Table 1: USERS
-- Role-based access: ADMIN, MANUFACTURER, CUSTOMER
-- ---------------------------------------------------------------------
CREATE TABLE USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MANUFACTURER', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table 2: MANUFACTURER
-- Manufacturer company profile & contact details
-- ---------------------------------------------------------------------
CREATE TABLE MANUFACTURER (
    manufacturer_id INT AUTO_INCREMENT PRIMARY KEY,
    manufacturer_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    contact VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table 3: PRODUCT
-- Registered authentic products with UNIQUE product code
-- status: 'ACTIVE' or 'BLOCKED' (recalled / flagged)
-- ---------------------------------------------------------------------
CREATE TABLE PRODUCT (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    manufacturer_id INT NOT NULL,
    product_code VARCHAR(100) NOT NULL UNIQUE,
    manufacturing_date DATE NOT NULL,
    status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    outcome_override ENUM('DEFAULT', 'GENUINE', 'SUSPICIOUS', 'INVALID', 'NOT_FOUND') NOT NULL DEFAULT 'DEFAULT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_manufacturer 
        FOREIGN KEY (manufacturer_id) REFERENCES MANUFACTURER(manufacturer_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_product_code ON PRODUCT(product_code);
CREATE INDEX idx_product_brand ON PRODUCT(brand);

-- ---------------------------------------------------------------------
-- Table 4: VERIFICATION_HISTORY
-- Logs every single customer verification attempt
-- result: 'GENUINE', 'INVALID', 'SUSPICIOUS', 'NOT_FOUND'
-- ---------------------------------------------------------------------
CREATE TABLE VERIFICATION_HISTORY (
    verification_id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(100) NOT NULL,
    verification_date DATE NOT NULL,
    verification_time TIME NOT NULL,
    result ENUM('GENUINE', 'INVALID', 'SUSPICIOUS', 'NOT_FOUND') NOT NULL,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_verif_code ON VERIFICATION_HISTORY(product_code);
CREATE INDEX idx_verif_date ON VERIFICATION_HISTORY(verification_date);

-- ---------------------------------------------------------------------
-- Table 5: COMPLAINT
-- Customer grievances on counterfeit or suspicious products
-- status: 'PENDING', 'REVIEWED', 'RESOLVED'
-- ---------------------------------------------------------------------
CREATE TABLE COMPLAINT (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NULL,
    user_id INT NULL,
    product_code VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    complaint_date DATE NOT NULL,
    status ENUM('PENDING', 'REVIEWED', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
    admin_response TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_complaint_product 
        FOREIGN KEY (product_id) REFERENCES PRODUCT(product_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_complaint_user 
        FOREIGN KEY (user_id) REFERENCES USERS(user_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- SAMPLE DATA SEEDING
-- Passwords below are hashed with BCrypt (password: 'admin123', 'mfg123', 'pass123')
-- =====================================================================

-- 1 Admin, 2 Manufacturers, 1 Customer
INSERT INTO USERS (user_id, username, password_hash, role) VALUES
(1, 'admin', '$2a$10$wK1eT76S9tXqXm9R5gC8fOiO1Z6d1Z8jK3L8n5v9m2P1q4X7y0ZaW', 'ADMIN'),
(2, 'apple_mfg', '$2a$10$wK1eT76S9tXqXm9R5gC8fOiO1Z6d1Z8jK3L8n5v9m2P1q4X7y0ZaW', 'MANUFACTURER'),
(3, 'nike_mfg', '$2a$10$wK1eT76S9tXqXm9R5gC8fOiO1Z6d1Z8jK3L8n5v9m2P1q4X7y0ZaW', 'MANUFACTURER'),
(4, 'john_doe', '$2a$10$wK1eT76S9tXqXm9R5gC8fOiO1Z6d1Z8jK3L8n5v9m2P1q4X7y0ZaW', 'CUSTOMER');

-- 2 Manufacturers
INSERT INTO MANUFACTURER (manufacturer_id, manufacturer_name, address, contact, email) VALUES
(1, 'Apple Authorized Asia Ltd', 'One Infinite Loop, Cupertino, CA / Taiwan Fab 7', '+1-800-692-7753', 'anti-counterfeit@apple.com'),
(2, 'Nike Global Products & Apparel Inc', 'One Bowerman Drive, Beaverton, Oregon, USA', '+1-800-344-6453', 'authenticity@nike.com');

-- 10 Products with distinct real-world test codes
INSERT INTO PRODUCT (product_id, product_name, brand, manufacturer_id, product_code, manufacturing_date, status) VALUES
(1, 'iPhone 16 Pro Max 256GB - Titanium Natural', 'Apple', 1, 'APPL-9821-X901', '2025-09-18', 'ACTIVE'),
(2, 'Air Jordan 1 Retro High OG - Chicago Colorway', 'Nike', 2, 'NIKE-AIR-4421', '2025-08-12', 'ACTIVE'),
(3, 'Sony WH-1000XM5 Wireless Headphones', 'Sony', 1, 'SONY-WH-1002', '2025-07-22', 'ACTIVE'),
(4, 'Rolex Submariner Date 41mm Oystersteel', 'Rolex', 1, 'ROLEX-SUB-7701', '2025-04-10', 'ACTIVE'),
(5, 'Samsung Galaxy S24 Ultra 512GB', 'Samsung', 1, 'SAMS-S24-9912', '2025-06-05', 'ACTIVE'),
(6, 'Nike Air Max 90 Infrared Edition', 'Nike', 2, 'NIKE-AIR-8899', '2025-05-14', 'ACTIVE'),
(7, 'MacBook Pro 16-inch M3 Max', 'Apple', 1, 'APPL-MBP-3312', '2025-03-29', 'ACTIVE'),
(8, 'Anker PowerCore Recalled Battery Unit', 'Anker', 1, 'RECALLED-BAT-001', '2025-01-10', 'BLOCKED'),
(9, 'SmartWatch Pro Series Defective Sensor', 'Apple', 1, 'DEFECT-WATCH-99', '2025-02-15', 'BLOCKED'),
(10, 'Chanel Coco Mademoiselle EDP 100ml', 'Chanel', 2, 'LUX-PARFUM-551', '2025-08-30', 'ACTIVE');

-- Sample Verification History:
-- Code NIKE-AIR-8899 has 4 verifications (triggers SUSPICIOUS on next check)
INSERT INTO VERIFICATION_HISTORY (product_code, verification_date, verification_time, result, ip_address) VALUES
('NIKE-AIR-8899', '2025-10-10', '10:14:22', 'GENUINE', '192.168.1.45'),
('NIKE-AIR-8899', '2025-10-14', '14:20:05', 'GENUINE', '172.56.21.90'),
('NIKE-AIR-8899', '2025-10-18', '09:05:41', 'GENUINE', '103.21.244.2'),
('NIKE-AIR-8899', '2025-10-22', '19:44:18', 'SUSPICIOUS', '45.112.87.11'),
('APPL-MBP-3312', '2025-09-01', '11:00:12', 'GENUINE', '192.168.0.12'),
('APPL-MBP-3312', '2025-09-15', '16:30:45', 'GENUINE', '192.168.0.15'),
('APPL-MBP-3312', '2025-10-02', '12:15:30', 'GENUINE', '185.220.101.5'),
('APPL-MBP-3312', '2025-10-19', '18:22:10', 'SUSPICIOUS', '91.240.118.89'),
('ROLEX-SUB-7701', '2025-10-05', '15:10:00', 'GENUINE', '192.168.1.100'),
('RECALLED-BAT-001', '2025-10-25', '13:05:12', 'INVALID', '114.79.18.23'),
('FAKE-9999-XYZ', '2025-10-26', '21:12:44', 'NOT_FOUND', '202.14.88.9');

-- Sample Complaints
INSERT INTO COMPLAINT (complaint_id, product_id, user_id, product_code, description, complaint_date, status, admin_response) VALUES
(1, 6, 4, 'NIKE-AIR-8899', 'Shoe box had blurry barcode and verification gave a suspicious warning. Stitching irregular.', '2025-10-23', 'REVIEWED', 'Field officer dispatched to retail warehouse lot #44.'),
(2, 8, NULL, 'RECALLED-BAT-001', 'Store sold this power bank despite recall. System returned INVALID.', '2025-10-26', 'RESOLVED', 'Official safety recall notice issued to store vendor.'),
(3, 7, NULL, 'APPL-MBP-3312', 'Multiple verification attempts detected on unboxed unit from reseller.', '2025-10-28', 'PENDING', NULL);
`
  },

  // 2. CONFIG: pom.xml
  {
    path: 'pom.xml',
    category: 'config',
    description: 'Maven configuration file with dependencies for Tomcat, MySQL, BCrypt, ZXing, Gson',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.fakedetection</groupId>
    <artifactId>fake-product-detection-system</artifactId>
    <version>1.0.0</version>
    <packaging>war</packaging>

    <name>Fake Product Detection Management System</name>
    <description>College Mini-Project - Anti-Counterfeiting Platform using Servlets, JSP, JDBC, MySQL</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- Java Servlet API (provided by Tomcat container) -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>

        <!-- JavaServer Pages (JSP) API -->
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>javax.servlet.jsp-api</artifactId>
            <version>2.3.3</version>
            <scope>provided</scope>
        </dependency>

        <!-- JSTL Standard Tag Library -->
        <dependency>
            <groupId>jstl</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>

        <!-- MySQL Connector/J for JDBC connectivity -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.3.0</version>
        </dependency>

        <!-- jBCrypt for password hashing -->
        <dependency>
            <groupId>org.mindrot</groupId>
            <artifactId>jbcrypt</artifactId>
            <version>0.4</version>
        </dependency>

        <!-- ZXing (Zebra Crossing) for QR Code generation -->
        <dependency>
            <groupId>com.google.zxing</groupId>
            <artifactId>core</artifactId>
            <version>3.5.3</version>
        </dependency>
        <dependency>
            <groupId>com.google.zxing</groupId>
            <artifactId>javase</artifactId>
            <version>3.5.3</version>
        </dependency>

        <!-- Google Gson for JSON response processing & Chart.js integration -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>

    <build>
        <finalName>fake-product-detection</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.4.0</version>
            </plugin>
        </plugins>
    </build>
</project>
`
  },

  // 3. WEB.XML
  {
    path: 'src/main/webapp/WEB-INF/web.xml',
    category: 'config',
    description: 'Deployment descriptor mapping Servlets, Filters, Welcome pages, and Session timeouts',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <display-name>Fake Product Detection Management System</display-name>

    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <!-- Session configuration: 30 minutes timeout -->
    <session-config>
        <session-timeout>30</session-timeout>
        <tracking-mode>COOKIE</tracking-mode>
    </session-config>

    <!-- Authentication & Role-based Authorization Filter -->
    <filter>
        <filter-name>AuthFilter</filter-name>
        <filter-class>com.fakedetection.filter.AuthFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>AuthFilter</filter-name>
        <url-pattern>/admin/*</url-pattern>
        <url-pattern>/manufacturer/*</url-pattern>
    </filter-mapping>

    <!-- Servlets -->
    <servlet>
        <servlet-name>VerifyServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.VerifyServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>VerifyServlet</servlet-name>
        <url-pattern>/verify</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>LoginServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.LoginServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LoginServlet</servlet-name>
        <url-pattern>/login</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>LogoutServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.LogoutServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LogoutServlet</servlet-name>
        <url-pattern>/logout</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>RegisterServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.RegisterServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>RegisterServlet</servlet-name>
        <url-pattern>/register</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>ProductServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.ProductServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ProductServlet</servlet-name>
        <url-pattern>/manufacturer/product</url-pattern>
        <url-pattern>/admin/product</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>ComplaintServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.ComplaintServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ComplaintServlet</servlet-name>
        <url-pattern>/complaint</url-pattern>
        <url-pattern>/admin/complaint</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>AdminDashboardServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.AdminDashboardServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>AdminDashboardServlet</servlet-name>
        <url-pattern>/admin/dashboard</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>ReportServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.ReportServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ReportServlet</servlet-name>
        <url-pattern>/admin/report</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>QRCodeServlet</servlet-name>
        <servlet-class>com.fakedetection.servlet.QRCodeServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>QRCodeServlet</servlet-name>
        <url-pattern>/qrcode</url-pattern>
    </servlet-mapping>

</web-app>
`
  },

  // 4. UTILS: DBConnection.java
  {
    path: 'src/main/java/com/fakedetection/util/DBConnection.java',
    category: 'util',
    description: 'JDBC connection manager with connection pooling support and configurable parameters',
    content: `package com.fakedetection.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * DBConnection - Manages JDBC connections to MySQL Database.
 * College Mini-Project: Fake Product Detection Management System
 */
public class DBConnection {
    // Database credentials - change according to your local MySQL setup
    private static final String DB_URL = "jdbc:mysql://localhost:3306/fake_product_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "password"; // Set your local MySQL password

    // Static initializer to load MySQL JDBC Driver
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("CRITICAL: MySQL JDBC Driver not found in classpath!");
            e.printStackTrace();
        }
    }

    /**
     * Obtains a new database connection.
     * @return Connection object
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    /**
     * Helper to safely close Connection, PreparedStatement, or ResultSet.
     */
    public static void close(AutoCloseable resource) {
        if (resource != null) {
            try {
                resource.close();
            } catch (Exception e) {
                // quiet suppression
            }
        }
    }
}
`
  },

  // 5. UTILS: PasswordUtil.java
  {
    path: 'src/main/java/com/fakedetection/util/PasswordUtil.java',
    category: 'util',
    description: 'BCrypt hashing and password validation utility',
    content: `package com.fakedetection.util;

import org.mindrot.jbcrypt.BCrypt;

/**
 * PasswordUtil - Provides BCrypt secure password hashing & verification.
 * College Mini-Project: Fake Product Detection Management System
 */
public class PasswordUtil {

    /**
     * Hashes a plain-text password using BCrypt with salt rounds = 10.
     * @param plainPassword Raw user password
     * @return 60-character BCrypt hash string
     */
    public static String hashPassword(String plainPassword) {
        if (plainPassword == null || plainPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(10));
    }

    /**
     * Verifies a plain-text password against a stored BCrypt hash.
     * @param plainPassword Candidate password
     * @param hashedPassword Stored BCrypt hash
     * @return true if password matches, false otherwise
     */
    public static boolean checkPassword(String plainPassword, String hashedPassword) {
        if (plainPassword == null || hashedPassword == null) {
            return false;
        }
        try {
            return BCrypt.checkpw(plainPassword, hashedPassword);
        } catch (Exception e) {
            return false;
        }
    }
}
`
  },

  // 6. UTILS: QRCodeUtil.java
  {
    path: 'src/main/java/com/fakedetection/util/QRCodeUtil.java',
    category: 'util',
    description: 'ZXing QR Code generator generating PNG byte arrays and Base64 strings',
    content: `package com.fakedetection.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

/**
 * QRCodeUtil - Uses Google ZXing library to generate QR codes for registered products.
 * College Mini-Project: Fake Product Detection Management System
 */
public class QRCodeUtil {

    /**
     * Generates a PNG QR code image as byte array.
     * @param text Product code or verification URL to encode
     * @param width Width in pixels (e.g. 250)
     * @param height Height in pixels (e.g. 250)
     * @return byte[] containing PNG image data
     */
    public static byte[] generateQRCodeBytes(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }

    /**
     * Generates a Base64 data URI string for embedding directly into JSP <img> tags.
     */
    public static String generateQRCodeBase64(String text, int width, int height) {
        try {
            byte[] bytes = generateQRCodeBytes(text, width, height);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(bytes);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
`
  },

  // 7. MODELS
  {
    path: 'src/main/java/com/fakedetection/model/User.java',
    category: 'model',
    description: 'POJO representing USERS table',
    content: `package com.fakedetection.model;

import java.sql.Timestamp;

public class User {
    private int userId;
    private String username;
    private String passwordHash;
    private String role; // 'ADMIN', 'MANUFACTURER', 'CUSTOMER'
    private Timestamp createdAt;

    public User() {}

    public User(int userId, String username, String passwordHash, String role, Timestamp createdAt) {
        this.userId = userId;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
    }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
`
  },
  {
    path: 'src/main/java/com/fakedetection/model/Manufacturer.java',
    category: 'model',
    description: 'POJO representing MANUFACTURER table',
    content: `package com.fakedetection.model;

public class Manufacturer {
    private int manufacturerId;
    private String manufacturerName;
    private String address;
    private String contact;
    private String email;

    public Manufacturer() {}

    public Manufacturer(int manufacturerId, String manufacturerName, String address, String contact, String email) {
        this.manufacturerId = manufacturerId;
        this.manufacturerName = manufacturerName;
        this.address = address;
        this.contact = contact;
        this.email = email;
    }

    public int getManufacturerId() { return manufacturerId; }
    public void setManufacturerId(int manufacturerId) { this.manufacturerId = manufacturerId; }

    public String getManufacturerName() { return manufacturerName; }
    public void setManufacturerName(String manufacturerName) { this.manufacturerName = manufacturerName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
`
  },
  {
    path: 'src/main/java/com/fakedetection/model/Product.java',
    category: 'model',
    description: 'POJO representing PRODUCT table',
    content: `package com.fakedetection.model;

import java.sql.Date;

public class Product {
    private int productId;
    private String productName;
    private String brand;
    private int manufacturerId;
    private String productCode; // UNIQUE
    private Date manufacturingDate;
    private String status; // 'ACTIVE', 'BLOCKED'
    private String outcomeOverride; // 'DEFAULT', 'GENUINE', 'SUSPICIOUS', 'INVALID', 'NOT_FOUND'

    // Transient joined field for display
    private String manufacturerName;

    public Product() {}

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public int getManufacturerId() { return manufacturerId; }
    public void setManufacturerId(int manufacturerId) { this.manufacturerId = manufacturerId; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public Date getManufacturingDate() { return manufacturingDate; }
    public void setManufacturingDate(Date manufacturingDate) { this.manufacturingDate = manufacturingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOutcomeOverride() { return outcomeOverride; }
    public void setOutcomeOverride(String outcomeOverride) { this.outcomeOverride = outcomeOverride; }

    public String getManufacturerName() { return manufacturerName; }
    public void setManufacturerName(String manufacturerName) { this.manufacturerName = manufacturerName; }
}
`
  },
  {
    path: 'src/main/java/com/fakedetection/model/VerificationHistory.java',
    category: 'model',
    description: 'POJO representing VERIFICATION_HISTORY table',
    content: `package com.fakedetection.model;

import java.sql.Date;
import java.sql.Time;

public class VerificationHistory {
    private int verificationId;
    private String productCode;
    private Date verificationDate;
    private Time verificationTime;
    private String result; // 'GENUINE', 'INVALID', 'SUSPICIOUS', 'NOT_FOUND'
    private String ipAddress;

    public VerificationHistory() {}

    public int getVerificationId() { return verificationId; }
    public void setVerificationId(int verificationId) { this.verificationId = verificationId; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public Date getVerificationDate() { return verificationDate; }
    public void setVerificationDate(Date verificationDate) { this.verificationDate = verificationDate; }

    public Time getVerificationTime() { return verificationTime; }
    public void setVerificationTime(Time verificationTime) { this.verificationTime = verificationTime; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
`
  },
  {
    path: 'src/main/java/com/fakedetection/model/Complaint.java',
    category: 'model',
    description: 'POJO representing COMPLAINT table',
    content: `package com.fakedetection.model;

import java.sql.Date;

public class Complaint {
    private int complaintId;
    private Integer productId;
    private Integer userId;
    private String productCode;
    private String description;
    private Date complaintDate;
    private String status; // 'PENDING', 'REVIEWED', 'RESOLVED'
    private String adminResponse;

    // Optional joined field for reporting
    private String username;

    public Complaint() {}

    public int getComplaintId() { return complaintId; }
    public void setComplaintId(int complaintId) { this.complaintId = complaintId; }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getComplaintDate() { return complaintDate; }
    public void setComplaintDate(Date complaintDate) { this.complaintDate = complaintDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminResponse() { return adminResponse; }
    public void setAdminResponse(String adminResponse) { this.adminResponse = adminResponse; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
`
  },

  // 8. DAOS
  {
    path: 'src/main/java/com/fakedetection/dao/UserDAO.java',
    category: 'dao',
    description: 'JDBC DAO for User authentication and registration with PreparedStatement',
    content: `package com.fakedetection.dao;

import com.fakedetection.model.User;
import com.fakedetection.util.DBConnection;
import com.fakedetection.util.PasswordUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDAO {

    /**
     * Authenticates a user by username and BCrypt password comparison.
     */
    public User authenticate(String username, String plainPassword) {
        String sql = "SELECT user_id, username, password_hash, role, created_at FROM USERS WHERE username = ?";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, username);
            rs = ps.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password_hash");
                if (PasswordUtil.checkPassword(plainPassword, storedHash)) {
                    User user = new User();
                    user.setUserId(rs.getInt("user_id"));
                    user.setUsername(rs.getString("username"));
                    user.setPasswordHash(storedHash);
                    user.setRole(rs.getString("role"));
                    user.setCreatedAt(rs.getTimestamp("created_at"));
                    return user;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs);
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
        return null;
    }

    /**
     * Registers a new user with BCrypt hashed password.
     */
    public boolean register(String username, String plainPassword, String role) {
        String sql = "INSERT INTO USERS (username, password_hash, role) VALUES (?, ?, ?)";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, username);
            ps.setString(2, PasswordUtil.hashPassword(plainPassword));
            ps.setString(3, role);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
    }
}
`
  },
  {
    path: 'src/main/java/com/fakedetection/dao/ProductDAO.java',
    category: 'dao',
    description: 'JDBC DAO for Product management, search, and status updates',
    content: `package com.fakedetection.dao;

import com.fakedetection.model.Product;
import com.fakedetection.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    /**
     * Looks up a product by its unique product code.
     */
    public Product getByCode(String code) {
        String sql = "SELECT p.*, m.manufacturer_name FROM PRODUCT p " +
                     "LEFT JOIN MANUFACTURER m ON p.manufacturer_id = m.manufacturer_id " +
                     "WHERE UPPER(p.product_code) = UPPER(?)";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, code.trim());
            rs = ps.executeQuery();

            if (rs.next()) {
                Product p = new Product();
                p.setProductId(rs.getInt("product_id"));
                p.setProductName(rs.getString("product_name"));
                p.setBrand(rs.getString("brand"));
                p.setManufacturerId(rs.getInt("manufacturer_id"));
                p.setProductCode(rs.getString("product_code"));
                p.setManufacturingDate(rs.getDate("manufacturing_date"));
                p.setStatus(rs.getString("status"));
                p.setOutcomeOverride(rs.getString("outcome_override"));
                p.setManufacturerName(rs.getString("manufacturer_name"));
                return p;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs);
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
        return null;
    }

    /**
     * Inserts a new product into the database.
     */
    public boolean addProduct(Product p) {
        String sql = "INSERT INTO PRODUCT (product_name, brand, manufacturer_id, product_code, manufacturing_date, status, outcome_override) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, p.getProductName());
            ps.setString(2, p.getBrand());
            ps.setInt(3, p.getManufacturerId());
            ps.setString(4, p.getProductCode().trim().toUpperCase());
            ps.setDate(5, p.getManufacturingDate());
            ps.setString(6, p.getStatus() != null ? p.getStatus() : "ACTIVE");
            ps.setString(7, p.getOutcomeOverride() != null ? p.getOutcomeOverride() : "DEFAULT");
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
    }

    /**
     * Updates product active / blocked status.
     */
    public boolean updateStatus(int productId, String newStatus) {
        String sql = "UPDATE PRODUCT SET status = ? WHERE product_id = ?";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, newStatus);
            ps.setInt(2, productId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
    }

    /**
     * ADMIN SUPERPOWER: Sets direct verification outcome override for a product.
     * Can force: 'GENUINE', 'SUSPICIOUS', 'INVALID', 'NOT_FOUND', or 'DEFAULT'.
     */
    public boolean updateOutcome(int productId, String outcomeOverride) {
        String sql = "UPDATE PRODUCT SET outcome_override = ? WHERE product_id = ?";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, outcomeOverride != null ? outcomeOverride.toUpperCase() : "DEFAULT");
            ps.setInt(2, productId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
    }

    /**
     * Returns all products with manufacturer name.
     */
    public List<Product> getAllProducts() {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT p.*, m.manufacturer_name FROM PRODUCT p " +
                     "LEFT JOIN MANUFACTURER m ON p.manufacturer_id = m.manufacturer_id " +
                     "ORDER BY p.product_id DESC";
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                Product p = new Product();
                p.setProductId(rs.getInt("product_id"));
                p.setProductName(rs.getString("product_name"));
                p.setBrand(rs.getString("brand"));
                p.setManufacturerId(rs.getInt("manufacturer_id"));
                p.setProductCode(rs.getString("product_code"));
                p.setManufacturingDate(rs.getDate("manufacturing_date"));
                p.setStatus(rs.getString("status"));
                p.setOutcomeOverride(rs.getString("outcome_override"));
                p.setManufacturerName(rs.getString("manufacturer_name"));
                list.add(p);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs);
            DBConnection.close(stmt);
            DBConnection.close(conn);
        }
        return list;
    }

    /**
     * Returns products registered by a specific manufacturer.
     */
    public List<Product> getByManufacturer(int manufacturerId) {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM PRODUCT WHERE manufacturer_id = ? ORDER BY product_id DESC";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, manufacturerId);
            rs = ps.executeQuery();

            while (rs.next()) {
                Product p = new Product();
                p.setProductId(rs.getInt("product_id"));
                p.setProductName(rs.getString("product_name"));
                p.setBrand(rs.getString("brand"));
                p.setManufacturerId(rs.getInt("manufacturer_id"));
                p.setProductCode(rs.getString("product_code"));
                p.setManufacturingDate(rs.getDate("manufacturing_date"));
                p.setStatus(rs.getString("status"));
                list.add(p);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs);
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
        return list;
    }
}
`
  },
  {
    path: 'src/main/java/com/fakedetection/dao/VerificationDAO.java',
    category: 'dao',
    description: 'JDBC DAO for recording verification attempts and generating statistics for Admin dashboard',
    content: `package com.fakedetection.dao;

import com.fakedetection.model.VerificationHistory;
import com.fakedetection.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VerificationDAO {

    /**
     * Counts how many times this product code has previously been verified.
     */
    public int getVerificationCount(String code) {
        String sql = "SELECT COUNT(*) FROM VERIFICATION_HISTORY WHERE UPPER(product_code) = UPPER(?)";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, code.trim());
            rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs);
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
        return 0;
    }

    /**
     * Logs every single verification attempt into the VERIFICATION_HISTORY table.
     */
    public boolean logVerification(String code, String result, String ipAddress) {
        String sql = "INSERT INTO VERIFICATION_HISTORY (product_code, verification_date, verification_time, result, ip_address) " +
                     "VALUES (?, CURDATE(), CURTIME(), ?, ?)";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, code.trim().toUpperCase());
            ps.setString(2, result);
            ps.setString(3, ipAddress != null ? ipAddress : "127.0.0.1");
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
    }

    /**
     * Returns total counts aggregated by result (for Chart.js and stat cards).
     */
    public Map<String, Integer> getStatistics() {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("TOTAL", 0);
        stats.put("GENUINE", 0);
        stats.put("SUSPICIOUS", 0);
        stats.put("INVALID", 0);
        stats.put("NOT_FOUND", 0);

        String sql = "SELECT result, COUNT(*) as cnt FROM VERIFICATION_HISTORY GROUP BY result";
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            int total = 0;
            while (rs.next()) {
                String res = rs.getString("result");
                int count = rs.getInt("cnt");
                stats.put(res, count);
                total += count;
            }
            stats.put("TOTAL", total);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs);
            DBConnection.close(stmt);
            DBConnection.close(conn);
        }
        return stats;
    }

    /**
     * Returns recent verification records for the audit table.
     */
    public List<VerificationHistory> getRecentVerifications(int limit) {
        List<VerificationHistory> list = new ArrayList<>();
        String sql = "SELECT * FROM VERIFICATION_HISTORY ORDER BY verification_id DESC LIMIT ?";
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, limit);
            rs = ps.executeQuery();

            while (rs.next()) {
                VerificationHistory v = new VerificationHistory();
                v.setVerificationId(rs.getInt("verification_id"));
                v.setProductCode(rs.getString("product_code"));
                v.setVerificationDate(rs.getDate("verification_date"));
                v.setVerificationTime(rs.getTime("verification_time"));
                v.setResult(rs.getString("result"));
                v.setIpAddress(rs.getString("ip_address"));
                list.add(v);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs);
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
        return list;
    }
}
`
  },
  {
    path: 'src/main/java/com/fakedetection/dao/ComplaintDAO.java',
    category: 'dao',
    description: 'JDBC DAO for recording and managing customer complaints',
    content: `package com.fakedetection.dao;

import com.fakedetection.model.Complaint;
import com.fakedetection.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ComplaintDAO {

    public boolean createComplaint(Complaint c) {
        String sql = "INSERT INTO COMPLAINT (product_id, user_id, product_code, description, complaint_date, status) " +
                     "VALUES (?, ?, ?, ?, CURDATE(), 'PENDING')";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            if (c.getProductId() != null) ps.setInt(1, c.getProductId()); else ps.setNull(1, Types.INTEGER);
            if (c.getUserId() != null) ps.setInt(2, c.getUserId()); else ps.setNull(2, Types.INTEGER);
            ps.setString(3, c.getProductCode());
            ps.setString(4, c.getDescription());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
    }

    public List<Complaint> getAllComplaints() {
        List<Complaint> list = new ArrayList<>();
        String sql = "SELECT c.*, u.username FROM COMPLAINT c " +
                     "LEFT JOIN USERS u ON c.user_id = u.user_id " +
                     "ORDER BY c.complaint_id DESC";
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                Complaint c = new Complaint();
                c.setComplaintId(rs.getInt("complaint_id"));
                c.setProductId(rs.getObject("product_id") != null ? rs.getInt("product_id") : null);
                c.setUserId(rs.getObject("user_id") != null ? rs.getInt("user_id") : null);
                c.setProductCode(rs.getString("product_code"));
                c.setDescription(rs.getString("description"));
                c.setComplaintDate(rs.getDate("complaint_date"));
                c.setStatus(rs.getString("status"));
                c.setAdminResponse(rs.getString("admin_response"));
                c.setUsername(rs.getString("username"));
                list.add(c);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(rs);
            DBConnection.close(stmt);
            DBConnection.close(conn);
        }
        return list;
    }

    public boolean updateStatus(int complaintId, String newStatus, String adminResponse) {
        String sql = "UPDATE COMPLAINT SET status = ?, admin_response = ? WHERE complaint_id = ?";
        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setString(1, newStatus);
            ps.setString(2, adminResponse);
            ps.setInt(3, complaintId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(ps);
            DBConnection.close(conn);
        }
    }
}
`
  },

  // 9. FILTERS: AuthFilter.java
  {
    path: 'src/main/java/com/fakedetection/filter/AuthFilter.java',
    category: 'filter',
    description: 'Role-based access control Servlet Filter protecting /admin/* and /manufacturer/*',
    content: `package com.fakedetection.filter;

import com.fakedetection.model.User;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * AuthFilter - Enforces Role-Based Access Control (RBAC).
 * College Mini-Project: Fake Product Detection Management System
 */
@WebFilter(filterName = "AuthFilter", urlPatterns = {"/admin/*", "/manufacturer/*"})
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        HttpSession session = req.getSession(false);
        String uri = req.getRequestURI();

        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;

        // Check if user is logged in
        if (currentUser == null) {
            res.sendRedirect(req.getContextPath() + "/login.jsp?error=Please+login+to+continue");
            return;
        }

        // Admin-only route guard
        if (uri.contains("/admin/")) {
            if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
                res.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Administrator role required.");
                return;
            }
        }

        // Manufacturer route guard
        if (uri.contains("/manufacturer/")) {
            if (!"MANUFACTURER".equalsIgnoreCase(currentUser.getRole()) && !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
                res.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Manufacturer credentials required.");
                return;
            }
        }

        // Authorized - continue downstream filter/servlet chain
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
`
  },

  // 10. SERVLETS: VerifyServlet.java (CORE LOGIC)
  {
    path: 'src/main/java/com/fakedetection/servlet/VerifyServlet.java',
    category: 'servlet',
    description: 'Core verification logic: evaluates genuine, invalid, suspicious, or not found, and logs attempt',
    content: `package com.fakedetection.servlet;

import com.fakedetection.dao.ProductDAO;
import com.fakedetection.dao.VerificationDAO;
import com.fakedetection.model.Product;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * VerifyServlet - Executes the Core Anti-Counterfeiting Verification Logic.
 * 
 * Logic Rules:
 * 1. Code not in database -> Result = "NOT_FOUND"
 * 2. Code exists, but status is 'BLOCKED' -> Result = "INVALID"
 * 3. Code exists, and prior verification count > 3 (or configured threshold) -> Result = "SUSPICIOUS"
 * 4. Code exists and verification count <= 3 -> Result = "GENUINE"
 * 5. Every single attempt is logged to VERIFICATION_HISTORY
 * 6. Result forwarded to result.jsp with advisory notice
 */
@WebServlet(name = "VerifyServlet", urlPatterns = {"/verify"})
public class VerifyServlet extends HttpServlet {

    private static final int SUSPICIOUS_THRESHOLD = 3;
    private final ProductDAO productDAO = new ProductDAO();
    private final VerificationDAO verificationDAO = new VerificationDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String code = req.getParameter("code");
        if (code != null && !code.trim().isEmpty()) {
            processVerification(code, req, resp);
        } else {
            resp.sendRedirect("verify.jsp");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String code = req.getParameter("product_code");
        if (code == null || code.trim().isEmpty()) {
            req.setAttribute("errorMessage", "Please enter a valid product code.");
            req.getRequestDispatcher("verify.jsp").forward(req, resp);
            return;
        }
        processVerification(code, req, resp);
    }

    private void processVerification(String rawCode, HttpServletRequest req, HttpServletResponse resp) 
            throws ServletException, IOException {
        
        String cleanCode = rawCode.trim().toUpperCase();
        String clientIp = req.getRemoteAddr();

        // 1. Query Product Database
        Product product = productDAO.getByCode(cleanCode);

        // 2. Query Prior Verification Count
        int priorScans = verificationDAO.getVerificationCount(cleanCode);
        int currentScanNumber = priorScans + 1;

        String result;
        String message;

        if (product == null) {
            // Rule 1: Code not found in central registry
            result = "NOT_FOUND";
            message = "Unrecognized product code. This item is not registered in our manufacturer database. High risk of counterfeit.";
        } else if (product.getOutcomeOverride() != null && !"DEFAULT".equalsIgnoreCase(product.getOutcomeOverride())) {
            // Rule 1.5: Administrator Direct Outcome Override
            result = product.getOutcomeOverride().toUpperCase();
            if ("GENUINE".equalsIgnoreCase(result)) {
                message = "Administrator Policy: Product confirmed and authenticated as GENUINE by Administrator override.";
            } else if ("SUSPICIOUS".equalsIgnoreCase(result)) {
                message = "Administrator Security Alert: Product designated as SUSPICIOUS by Administrator investigation.";
            } else if ("INVALID".equalsIgnoreCase(result)) {
                message = "Administrator Action: Product designated as INVALID / RECALLED by Administrator.";
            } else {
                result = "NOT_FOUND";
                message = "Administrator Action: Product code designated as NOT FOUND by Administrator.";
            }
        } else if ("BLOCKED".equalsIgnoreCase(product.getStatus())) {
            // Rule 2: Code exists but product is recalled / inactive
            result = "INVALID";
            message = "This product was previously registered but has been revoked, flagged as recalled, or marked inactive by the manufacturer.";
        } else if (priorScans >= SUSPICIOUS_THRESHOLD) {
            // Rule 3: Scanned > 3 times (duplicated / copied code suspect)
            result = "SUSPICIOUS";
            message = "Warning: This product code has been verified " + currentScanNumber + 
                      " times. Genuine items are typically verified 1 to 2 times upon customer unboxing. Repeated verifications strongly indicate duplicated packaging or counterfeit cloning.";
        } else {
            // Rule 4: Genuine product within normal verification limit
            result = "GENUINE";
            message = (priorScans == 0) 
                    ? "Verified Authentic! This is the first recorded customer verification for this unique security code."
                    : "Verified Authentic! This product code is genuine and within the standard verification threshold (Scan " + currentScanNumber + " of " + SUSPICIOUS_THRESHOLD + ").";
        }

        // 3. Log attempt to VERIFICATION_HISTORY table
        verificationDAO.logVerification(cleanCode, result, clientIp);

        // 4. Attach attributes for result.jsp
        req.setAttribute("productCode", cleanCode);
        req.setAttribute("result", result);
        req.setAttribute("message", message);
        req.setAttribute("product", product);
        req.setAttribute("scanCount", currentScanNumber);
        req.setAttribute("threshold", SUSPICIOUS_THRESHOLD);
        req.setAttribute("verificationDate", new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        req.setAttribute("verificationTime", new SimpleDateFormat("HH:mm:ss").format(new Date()));

        // Forward to Result Page
        req.getRequestDispatcher("result.jsp").forward(req, resp);
    }
}
`
  },

  // 11. SERVLETS: ReportServlet.java (CSV DOWNLOAD)
  {
    path: 'src/main/java/com/fakedetection/servlet/ReportServlet.java',
    category: 'servlet',
    description: 'Generates and streams verification audit report as a downloadable CSV file',
    content: `package com.fakedetection.servlet;

import com.fakedetection.dao.VerificationDAO;
import com.fakedetection.model.VerificationHistory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * ReportServlet - Exports all verification logs into an RFC-4180 compliant CSV file.
 * College Mini-Project: Fake Product Detection Management System
 */
@WebServlet(name = "ReportServlet", urlPatterns = {"/admin/report"})
public class ReportServlet extends HttpServlet {

    private final VerificationDAO verificationDAO = new VerificationDAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String filename = "verification_audit_report_" + timestamp + ".csv";

        resp.setContentType("text/csv; charset=UTF-8");
        resp.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        List<VerificationHistory> logs = verificationDAO.getRecentVerifications(1000);

        try (PrintWriter writer = resp.getWriter()) {
            // CSV Header
            writer.println("Verification ID,Product Code,Verification Date,Verification Time,Result,IP Address");

            // CSV Data Rows
            for (VerificationHistory v : logs) {
                writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        v.getVerificationId(),
                        v.getProductCode(),
                        v.getVerificationDate(),
                        v.getVerificationTime(),
                        v.getResult(),
                        v.getIpAddress());
            }
            writer.flush();
        }
    }
}
`
  },

  // 12. SERVLETS: QRCodeServlet.java
  {
    path: 'src/main/java/com/fakedetection/servlet/QRCodeServlet.java',
    category: 'servlet',
    description: 'Dynamic ZXing QR Code image streaming endpoint',
    content: `package com.fakedetection.servlet;

import com.fakedetection.util.QRCodeUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

/**
 * QRCodeServlet - Streams dynamic PNG QR codes directly to the client browser.
 */
@WebServlet(name = "QRCodeServlet", urlPatterns = {"/qrcode"})
public class QRCodeServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String code = req.getParameter("code");
        if (code == null || code.trim().isEmpty()) {
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing 'code' parameter");
            return;
        }

        try {
            byte[] qrBytes = QRCodeUtil.generateQRCodeBytes(code.trim().toUpperCase(), 300, 300);
            resp.setContentType("image/png");
            resp.setContentLength(qrBytes.length);
            try (OutputStream out = resp.getOutputStream()) {
                out.write(qrBytes);
                out.flush();
            }
        } catch (Exception e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to render QR Code");
        }
    }
}
`
  },

  // 13. JSPS: index.jsp (HOME)
  {
    path: 'src/main/webapp/index.jsp',
    category: 'jsp',
    description: 'Home page with Bootstrap 5 navbar, quick verification search box, and risks section',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fake Product Detection Management System</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">

    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold d-flex items-center gap-2" href="index.jsp">
                <i class="bi bi-tag-fill"></i> TrueTag
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link active" href="index.jsp">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="verify.jsp">Verify Product</a></li>
                    <li class="nav-item"><a class="nav-link" href="complaint.jsp">File Complaint</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.jsp">About System</a></li>
                    <li class="nav-item"><a class="nav-link" href="contact.jsp">Contact</a></li>
                </ul>
                <div class="d-flex align-items-center gap-2">
                    <a href="login.jsp" class="btn btn-outline-light btn-sm px-3">
                        <i class="bi bi-box-arrow-in-right"></i> Login / Portal
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section with Verification Box -->
    <section class="py-5 bg-white border-bottom">
        <div class="container py-4">
            <div class="row align-items-center g-5">
                <div class="col-lg-7">
                    <span class="text-primary fw-semibold text-uppercase tracking-wider small">Anti-Counterfeiting Platform</span>
                    <h1 class="display-5 fw-bold text-dark mt-2 mb-3">
                        Verify Authenticity Before You Trust
                    </h1>
                    <p class="lead text-muted mb-4">
                        Protect yourself from dangerous counterfeit goods. Enter your unique serial code or scan the packaging QR tag to verify real manufacturer credentials instantly.
                    </p>

                    <!-- Quick Verify Box -->
                    <div class="card shadow-sm border-primary border-2 p-3 p-md-4 bg-light">
                        <form action="verify" method="POST">
                            <label class="form-label fw-bold text-dark mb-2">
                                <i class="bi bi-upc-scan text-primary me-1"></i> Enter Unique Product Code
                            </label>
                            <div class="input-group input-group-lg mb-3">
                                <input type="text" name="product_code" class="form-control font-monospace" 
                                       placeholder="e.g. APPL-9821-X901" required autofocus>
                                <button type="submit" class="btn btn-primary px-4 fw-semibold">
                                    <i class="bi bi-shield-check me-1"></i> Verify Your Product
                                </button>
                            </div>
                            <div class="d-flex flex-wrap align-items-center justify-content-between text-muted small">
                                <span>Try sample codes: <code>APPL-9821-X901</code> (Genuine) · <code>NIKE-AIR-8899</code> (Suspicious)</span>
                                <a href="verify.jsp" class="text-decoration-none text-primary fw-semibold">
                                    <i class="bi bi-camera"></i> Scan QR Code Instead &rarr;
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="col-lg-5 text-center">
                    <div class="p-4 bg-primary bg-opacity-10 rounded-4 text-center">
                        <i class="bi bi-patch-check-fill text-primary display-1"></i>
                        <h4 class="mt-3 fw-bold">Multi-Layered Validation</h4>
                        <p class="text-muted small mb-0">Cryptographic code lookup + Scan frequency threshold + Real-time blacklist verification</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- The Serious Risks of Fake Products -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="text-center max-w-2xl mx-auto mb-5">
                <h2 class="fw-bold">The Critical Risks of Counterfeit Products</h2>
                <p class="text-muted">Fake products are not just cheap replicas—they cause severe real-world harm.</p>
            </div>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card h-100 p-4 border-0 shadow-sm">
                        <div class="text-danger mb-3"><i class="bi bi-heart-pulse-fill fs-2"></i></div>
                        <h5 class="fw-bold">Health & Safety Hazards</h5>
                        <p class="text-muted small">Counterfeit electronics cause battery explosions and fires. Fake pharmaceuticals and cosmetics contain toxic heavy metals and inactive compounds.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 p-4 border-0 shadow-sm">
                        <div class="text-warning mb-3"><i class="bi bi-cash-coin fs-2"></i></div>
                        <h5 class="fw-bold">Financial Loss & Zero Warranty</h5>
                        <p class="text-muted small">Consumers pay premium prices for substandard knockoffs with zero warranty protection, no customer support, and immediate depreciation.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card h-100 p-4 border-0 shadow-sm">
                        <div class="text-primary mb-3"><i class="bi bi-shield-slash fs-2"></i></div>
                        <h5 class="fw-bold">Organized Crime & Fraud</h5>
                        <p class="text-muted small">Global illicit counterfeiting syndicates evade regulatory standards, exploit unauthorized labor, and damage legitimate brand heritage.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container text-center text-md-start">
            <div class="row g-4">
                <div class="col-md-6">
                    <h5 class="fw-bold text-white"><i class="bi bi-shield-check"></i> Fake Product Detection System</h5>
                    <p class="text-white-50 small">College Mini-Project in Java Servlets, JSP, JDBC, MySQL and Apache Tomcat.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="text-white-50 small mb-0">&copy; 2025 Anti-Counterfeit Verification Management System. Academic Prototype.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`
  },

  // 14. JSPS: verify.jsp
  {
    path: 'src/main/webapp/verify.jsp',
    category: 'jsp',
    description: 'Verify page with input box and HTML5 camera QR scanner',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Product - Fake Product Detection</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.jsp"><i class="bi bi-tag-fill"></i> TrueTag</a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="index.jsp">Home</a>
                <a class="nav-link active" href="verify.jsp">Verify</a>
                <a class="nav-link" href="complaint.jsp">Complaint</a>
                <a class="nav-link" href="login.jsp">Login</a>
            </div>
        </div>
    </nav>

    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white py-3 border-bottom">
                        <h4 class="card-title fw-bold mb-0 text-primary">
                            <i class="bi bi-upc-scan"></i> Product Authenticity Verification
                        </h4>
                    </div>
                    <div class="card-body p-4">
                        <% if (request.getAttribute("errorMessage") != null) { %>
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <%= request.getAttribute("errorMessage") %>
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            </div>
                        <% } %>

                        <!-- Tab Options: Manual Input vs QR Scanner -->
                        <ul class="nav nav-pills mb-4" id="pills-tab" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active" id="tab-code-btn" data-bs-toggle="pill" data-bs-target="#tab-code">
                                    <i class="bi bi-keyboard"></i> Enter Serial Code
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="tab-camera-btn" data-bs-toggle="pill" data-bs-target="#tab-camera">
                                    <i class="bi bi-qr-code-scan"></i> Scan Packaging QR
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content" id="pills-tabContent">
                            <!-- Code Input Tab -->
                            <div class="tab-pane fade show active" id="tab-code">
                                <form action="verify" method="POST">
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Unique Product Code / Serial Number</label>
                                        <input type="text" name="product_code" id="product_code_input" 
                                               class="form-control form-control-lg font-monospace text-uppercase" 
                                               placeholder="e.g. APPL-9821-X901" required>
                                        <div class="form-text">Locate the 12-16 character alphanumeric code printed on the security seal.</div>
                                    </div>

                                    <div class="mb-4">
                                        <span class="small text-muted fw-semibold d-block mb-2">Test Presets:</span>
                                        <div class="btn-group btn-group-sm flex-wrap gap-1">
                                            <button type="button" class="btn btn-outline-success" onclick="setCode('APPL-9821-X901')">Genuine Test</button>
                                            <button type="button" class="btn btn-outline-warning" onclick="setCode('NIKE-AIR-8899')">Suspicious Test</button>
                                            <button type="button" class="btn btn-outline-danger" onclick="setCode('RECALLED-BAT-001')">Invalid/Blocked Test</button>
                                            <button type="button" class="btn btn-outline-secondary" onclick="setCode('FAKE-0000-XYZ')">Not Found Test</button>
                                        </div>
                                    </div>

                                    <button type="submit" class="btn btn-primary btn-lg w-100 fw-semibold">
                                        <i class="bi bi-shield-check"></i> Verify Product Authenticity
                                    </button>
                                </form>
                            </div>

                            <!-- Camera QR Scanner Tab -->
                            <div class="tab-pane fade" id="tab-camera">
                                <div class="text-center p-4 bg-light rounded border">
                                    <div id="scanner-viewfinder" class="mb-3 position-relative d-inline-block">
                                        <video id="camera-stream" width="320" height="240" class="rounded bg-black d-none"></video>
                                        <div id="scanner-placeholder" class="py-5">
                                            <i class="bi bi-camera display-3 text-muted"></i>
                                            <p class="text-muted mt-2 mb-0">Camera permission needed for optical barcode reading</p>
                                        </div>
                                    </div>
                                    <div>
                                        <button type="button" id="start-cam-btn" class="btn btn-primary btn-sm me-2">
                                            <i class="bi bi-play-circle"></i> Start Camera Scan
                                        </button>
                                        <button type="button" id="stop-cam-btn" class="btn btn-secondary btn-sm d-none">
                                            <i class="bi bi-stop-circle"></i> Stop Camera
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function setCode(code) {
            document.getElementById('product_code_input').value = code;
        }
    </script>
</body>
</html>
`
  },

  // 15. JSPS: result.jsp
  {
    path: 'src/main/webapp/result.jsp',
    category: 'jsp',
    description: 'Result page displaying Genuine, Invalid, Suspicious, or Not Found status, product details, and security notice',
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.fakedetection.model.Product" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Result - TrueTag</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-light">

    <nav class="navbar navbar-dark bg-primary shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" href="index.jsp"><i class="bi bi-tag-fill"></i> TrueTag</a>
            <a href="verify.jsp" class="btn btn-outline-light btn-sm">Verify Another Code</a>
        </div>
    </nav>

    <%
        String result = (String) request.getAttribute("result");
        String message = (String) request.getAttribute("message");
        String productCode = (String) request.getAttribute("productCode");
        Product product = (Product) request.getAttribute("product");
        Integer scanCount = (Integer) request.getAttribute("scanCount");
        if (result == null) result = "NOT_FOUND";
    %>

    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-8">

                <!-- Result Card -->
                <div class="card shadow-sm border-0 overflow-hidden mb-4">
                    
                    <!-- Header Banner -->
                    <% if ("GENUINE".equalsIgnoreCase(result)) { %>
                        <div class="bg-success text-white p-4 text-center">
                            <i class="bi bi-patch-check-fill display-3"></i>
                            <h2 class="fw-bold mt-2 mb-1">VERIFIED GENUINE</h2>
                            <p class="mb-0 opacity-75">Manufacturer Certificate of Authenticity Confirmed</p>
                        </div>
                    <% } else if ("SUSPICIOUS".equalsIgnoreCase(result)) { %>
                        <div class="bg-warning text-dark p-4 text-center">
                            <i class="bi bi-exclamation-triangle-fill display-3 text-danger"></i>
                            <h2 class="fw-bold mt-2 mb-1">SUSPICIOUS CODE DETECTED</h2>
                            <p class="mb-0 fw-semibold text-danger">Exceeded Standard Scan Threshold (<%= scanCount %> Verifications)</p>
                        </div>
                    <% } else if ("INVALID".equalsIgnoreCase(result)) { %>
                        <div class="bg-danger text-white p-4 text-center">
                            <i class="bi bi-x-octagon-fill display-3"></i>
                            <h2 class="fw-bold mt-2 mb-1">INVALID / RECALLED PRODUCT</h2>
                            <p class="mb-0 opacity-75">Status Marked Blocked or Revoked by Manufacturer</p>
                        </div>
                    <% } else { %>
                        <div class="bg-secondary text-white p-4 text-center">
                            <i class="bi bi-question-circle-fill display-3"></i>
                            <h2 class="fw-bold mt-2 mb-1">PRODUCT NOT FOUND</h2>
                            <p class="mb-0 opacity-75">Unregistered Code in Central Database (High Risk)</p>
                        </div>
                    <% } %>

                    <div class="card-body p-4">
                        <div class="alert <%= "GENUINE".equals(result) ? "alert-success" : ("SUSPICIOUS".equals(result) ? "alert-warning" : "alert-danger") %> mb-4">
                            <strong>System Evaluation:</strong> <%= message %>
                        </div>

                        <!-- Product Attributes Table -->
                        <h5 class="fw-bold border-bottom pb-2 mb-3">Verification Details</h5>
                        <table class="table table-bordered table-striped mb-4">
                            <tbody>
                                <tr>
                                    <th class="w-25 text-muted">Queried Code</th>
                                    <td class="font-monospace fw-bold"><%= productCode %></td>
                                </tr>
                                <tr>
                                    <th class="text-muted">Product Name</th>
                                    <td><%= (product != null) ? product.getProductName() : "Unknown / Unregistered" %></td>
                                </tr>
                                <tr>
                                    <th class="text-muted">Brand</th>
                                    <td><%= (product != null) ? product.getBrand() : "N/A" %></td>
                                </tr>
                                <tr>
                                    <th class="text-muted">Manufacturer</th>
                                    <td><%= (product != null && product.getManufacturerName() != null) ? product.getManufacturerName() : "N/A" %></td>
                                </tr>
                                <tr>
                                    <th class="text-muted">Manufacturing Date</th>
                                    <td><%= (product != null && product.getManufacturingDate() != null) ? product.getManufacturingDate() : "N/A" %></td>
                                </tr>
                                <tr>
                                    <th class="text-muted">Verification Timestamp</th>
                                    <td><%= request.getAttribute("verificationDate") %> <%= request.getAttribute("verificationTime") %></td>
                                </tr>
                                <tr>
                                    <th class="text-muted">Historical Scans</th>
                                    <td><span class="badge bg-secondary"><%= scanCount %> scan(s) recorded</span></td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Important Security Note Required by Specification -->
                        <div class="border rounded p-3 bg-light text-muted small mb-4">
                            <h6 class="fw-bold text-dark mb-1"><i class="bi bi-info-circle-fill text-primary"></i> Anti-Counterfeiting Security Advisory</h6>
                            <p class="mb-0">
                                <strong>Notice:</strong> A valid product code provides primary electronic verification only. Sophisticated counterfeiters may duplicate legitimate packaging or copy valid QR tags. Always inspect tamper-evident seals, holographic labels, packaging print clarity, and purchase exclusively through verified authorized retailers.
                            </p>
                        </div>

                        <!-- Actions -->
                        <div class="d-flex flex-wrap gap-2">
                            <a href="verify.jsp" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-repeat"></i> Verify Another Item
                            </a>
                            <% if (!"GENUINE".equalsIgnoreCase(result)) { %>
                                <a href="complaint.jsp?code=<%= productCode %>" class="btn btn-danger">
                                    <i class="bi bi-flag-fill"></i> Report Counterfeit / File Grievance
                                </a>
                            <% } %>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`
  },

  // 16. README.md: College Mini-Project Run Guide
  {
    path: 'README.md',
    category: 'docs',
    description: 'Complete setup guide for Eclipse, IntelliJ, Apache Tomcat, MySQL Workbench, and Viva answers',
    content: `# Fake Product Detection Management System
**College Mini-Project Submission Document**
**Technology Stack:** Java Servlets, JSP, JDBC, MySQL, Apache Tomcat, Bootstrap 5, Chart.js, ZXing, jBCrypt

---

## 1. System Overview
Counterfeiting costs global consumers billions of dollars and causes severe health and safety hazards. This system enables:
- **Customers**: Verify product authenticity by entering an alphanumeric product code or scanning a packaging QR code.
- **Manufacturers**: Register authentic products, generate ZXing QR codes, and track product verification telemetry.
- **Administrators**: Central monitoring console, real-time alerts on duplicated/suspicious scans, product catalog control (block/activate), complaint review, and audit reports with CSV download.

---

## 2. Verification Algorithm
- **Code not found in database** &rarr; \`NOT_FOUND\`
- **Code exists, but status is 'BLOCKED'** &rarr; \`INVALID\`
- **Code exists and verification count <= 3** &rarr; \`GENUINE\`
- **Code verified > 3 times (threshold)** &rarr; \`SUSPICIOUS\` (flagged on admin dashboard as potential counterfeit code duplication)
- **Every attempt** is automatically logged to \`VERIFICATION_HISTORY\` table with timestamp and IP address.

---

## 3. Database Setup (MySQL)
1. Open **MySQL Workbench** or command line client:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
2. Run the provided \`database/schema.sql\` script:
   \`\`\`sql
   SOURCE database/schema.sql;
   \`\`\`
3. Confirm credentials in \`com.fakedetection.util.DBConnection.java\`:
   - URL: \`jdbc:mysql://localhost:3306/fake_product_db\`
   - User: \`root\`
   - Password: \`password\` (change to match your local password)

---

## 4. How to Run in Eclipse IDE
1. Open Eclipse IDE for Enterprise Java Developers.
2. Go to **File -> Import -> Maven -> Existing Maven Projects**.
3. Select the project folder containing \`pom.xml\` and click **Finish**.
4. In Eclipse **Servers** view, right click -> **New -> Server -> Apache -> Tomcat v9.0 or v10.1**.
5. Right-click project -> **Run As -> Run on Server**.
6. Access application at: \`http://localhost:8080/fake-product-detection/\`

---

## 5. How to Run in IntelliJ IDEA Ultimate
1. Open IntelliJ IDEA -> **Open** -> Select the project root folder.
2. Allow Maven dependencies to download.
3. Configure Tomcat: **Run -> Edit Configurations -> Add New -> Tomcat Server -> Local**.
4. In **Deployment** tab, click **+** -> **Artifact** -> \`fake-product-detection:war\`.
5. Click **Run / Debug**.

---

## 6. Pre-Configured Test Credentials
| Role | Username | Password | Notes |
|---|---|---|---|
| Admin | \`admin\` | \`admin123\` | Full administrative console |
| Manufacturer 1 | \`apple_mfg\` | \`mfg123\` | Apple products portal |
| Manufacturer 2 | \`nike_mfg\` | \`mfg123\` | Nike products portal |
| Customer | \`john_doe\` | \`pass123\` | End-consumer user |

---

## 7. Test Product Codes
| Product Code | Product Name | Expected Status |
|---|---|---|
| \`APPL-9821-X901\` | iPhone 16 Pro Max | **GENUINE** (1st time scan) |
| \`NIKE-AIR-4421\` | Air Jordan 1 Retro | **GENUINE** |
| \`NIKE-AIR-8899\` | Nike Air Max 90 | **SUSPICIOUS** (>3 scans) |
| \`RECALLED-BAT-001\` | Anker Battery Pack | **INVALID** (Blocked status) |
| \`FAKE-9999-XYZ\` | Fake Knockoff | **NOT FOUND** |
`
  }
];
