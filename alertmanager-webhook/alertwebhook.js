// alertwebhook.js - Không có chức năng gửi email
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan("combined")); // Logging HTTP requests

// Create logs directory
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create log file stream
const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

// Store received alerts
let receivedAlerts = [];

// Main webhook endpoint for Prometheus Alertmanager
app.post("/webhook", async (req, res) => {
  try {
    const alertData = req.body;
    console.log(
      "Received alert webhook payload:",
      JSON.stringify(alertData, null, 2)
    );

    // Log to file
    const timestamp = new Date().toISOString();
    const logFile = path.join(logsDir, `alerts-${timestamp.split("T")[0]}.log`);
    const logEntry = `[${timestamp}] ${JSON.stringify(alertData, null, 2)}\n\n`;

    fs.appendFileSync(logFile, logEntry);

    // Store alerts in memory (limited to recent 100)
    if (alertData.alerts) {
      receivedAlerts = [...alertData.alerts, ...receivedAlerts].slice(0, 100);
    }

    // Send success response
    res.status(200).json({
      status: "success",
      message: "Alert received successfully",
      timestamp: timestamp,
    });
  } catch (error) {
    console.error("Error processing alert webhook:", error);
    res.status(500).json({
      status: "error",
      message: "Error processing alert",
      error: error.message,
    });
  }
});

// Get all received alerts
app.get("/alerts", (req, res) => {
  res.json({
    count: receivedAlerts.length,
    alerts: receivedAlerts,
  });
});

// Clear alerts
app.delete("/alerts", (req, res) => {
  receivedAlerts = [];
  res.json({
    status: "success",
    message: "All alerts cleared",
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Alert webhook server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`View received alerts: http://localhost:${PORT}/alerts`);
});
