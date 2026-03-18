import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// API Routes
app.get("/api/payments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("payment_date", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

app.post("/api/payments", async (req, res) => {
  try {
    const { apartment, tenant_name, payment_date, payment_type, amount, notes } = req.body;
    
    if (!apartment || !tenant_name || !payment_date || !payment_type || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("payments")
      .insert([{ apartment, tenant_name, payment_date, payment_type, amount, notes: notes || "" }])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ error: "Failed to add payment" });
  }
});

app.delete("/api/payments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: "Failed to delete payment" });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from("payments")
      .select("amount, payment_type");

    if (error) throw error;

    const total_revenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const total_payments = payments.length;
    
    const by_method_map: Record<string, { count: number, total: number }> = {};
    payments.forEach(p => {
      if (!by_method_map[p.payment_type]) {
        by_method_map[p.payment_type] = { count: 0, total: 0 };
      }
      by_method_map[p.payment_type].count++;
      by_method_map[p.payment_type].total += Number(p.amount);
    });

    const by_method = Object.entries(by_method_map).map(([type, stats]) => ({
      payment_type: type,
      ...stats
    }));

    res.json({
      total_revenue,
      total_payments,
      by_method
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not running as a serverless function (Vercel)
  if (!process.env.VERCEL) {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
