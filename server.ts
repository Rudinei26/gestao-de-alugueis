import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

// Initialize Database
const db = new Database("payments.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    apartment TEXT NOT NULL,
    tenant_name TEXT NOT NULL,
    payment_date TEXT NOT NULL,
    payment_type TEXT NOT NULL,
    amount REAL NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/payments", (req, res) => {
    try {
      const stmt = db.prepare("SELECT * FROM payments ORDER BY payment_date DESC");
      const payments = stmt.all();
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.post("/api/payments", (req, res) => {
    try {
      const { apartment, tenant_name, payment_date, payment_type, amount, notes } = req.body;
      
      if (!apartment || !tenant_name || !payment_date || !payment_type || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const stmt = db.prepare(`
        INSERT INTO payments (apartment, tenant_name, payment_date, payment_type, amount, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const info = stmt.run(apartment, tenant_name, payment_date, payment_type, amount, notes || "");
      
      res.json({ 
        id: info.lastInsertRowid, 
        apartment, 
        tenant_name, 
        payment_date, 
        payment_type, 
        amount, 
        notes 
      });
    } catch (error) {
      console.error("Error adding payment:", error);
      res.status(500).json({ error: "Failed to add payment" });
    }
  });

  app.delete("/api/payments/:id", (req, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare("DELETE FROM payments WHERE id = ?");
      const info = stmt.run(id);
      
      if (info.changes === 0) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting payment:", error);
      res.status(500).json({ error: "Failed to delete payment" });
    }
  });

  app.get("/api/stats", (req, res) => {
    try {
      const totalStmt = db.prepare("SELECT SUM(amount) as total FROM payments");
      const countStmt = db.prepare("SELECT COUNT(*) as count FROM payments");
      const methodStmt = db.prepare("SELECT payment_type, COUNT(*) as count, SUM(amount) as total FROM payments GROUP BY payment_type");
      
      const total = totalStmt.get() as { total: number };
      const count = countStmt.get() as { count: number };
      const methods = methodStmt.all();

      res.json({
        total_revenue: total.total || 0,
        total_payments: count.count || 0,
        by_method: methods
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
