const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || !process.env.FRONTEND_URL) {
  throw new Error("Required environment variables are missing");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Home route
app.get("/", (req, res) => {
  res.send("Cold Chain Assurance API is running");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    project: "Cold Chain Assurance"
  });
});

// Get storage units
app.get("/api/storage-units", async (req, res) => {
  const { data, error } = await supabase
    .from("storage_units")
    .select("*")
    .order("id");

  if (error) {
    return res.status(500).json({
      error: "Unable to fetch storage units"
    });
  }

  res.json(data);
});

// Get temperature and humidity readings
app.get("/api/readings", async (req, res) => {
  const { data, error } = await supabase
    .from("readings")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(100);

  if (error) {
  console.error("Supabase storage_units error:", error);
  return res.status(500).json({
    error: "Unable to fetch storage units"
  });
}

  res.json(data);
});

// Get alerts
app.get("/api/alerts", async (req, res) => {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return res.status(500).json({
      error: "Unable to fetch alerts"
    });
  }

  res.json(data);
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Cold Chain API running on port ${PORT}`);
});
