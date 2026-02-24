import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("market.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS sellers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email_phone TEXT NOT NULL,
    business_name TEXT NOT NULL,
    business_logo TEXT NOT NULL,
    university TEXT NOT NULL,
    bio TEXT,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    university TEXT NOT NULL,
    photos TEXT, -- JSON array of URLs
    whatsapp_number TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES sellers(id)
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/listings", (req, res) => {
    const { category, university, search } = req.query;
    let query = `
      SELECT l.*, s.business_name, s.business_logo, s.is_verified 
      FROM listings l 
      JOIN sellers s ON l.seller_id = s.id 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += " AND l.category = ?";
      params.push(category);
    }
    if (university) {
      query += " AND l.university = ?";
      params.push(university);
    }
    if (search) {
      query += " AND (l.name LIKE ? OR l.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY l.created_at DESC";
    
    const listings = db.prepare(query).all(...params);
    res.json(listings.map(l => ({
      ...l,
      photos: JSON.parse(l.photos || "[]")
    })));
  });

  app.post("/api/sellers", (req, res) => {
    const { email_phone, business_name, business_logo, university, bio } = req.body;
    try {
      const info = db.prepare(`
        INSERT INTO sellers (email_phone, business_name, business_logo, university, bio)
        VALUES (?, ?, ?, ?, ?)
      `).run(email_phone, business_name, business_logo, university, bio);
      res.json({ id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to create seller profile" });
    }
  });

  app.post("/api/listings", (req, res) => {
    const { seller_id, name, price, description, category, university, photos, whatsapp_number } = req.body;
    try {
      const info = db.prepare(`
        INSERT INTO listings (seller_id, name, price, description, category, university, photos, whatsapp_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(seller_id, name, price, description, category, university, JSON.stringify(photos), whatsapp_number);
      res.json({ id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

  app.post("/api/reports", (req, res) => {
    const { listing_id, reason } = req.body;
    try {
      db.prepare(`INSERT INTO reports (listing_id, reason) VALUES (?, ?)`).run(listing_id, reason);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit report" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
