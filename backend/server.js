require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Enquiry = require("./models/Enquiry");
const products = require("./data/products");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authenticateAdmin = require("./middleware/auth");

const app = express();

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;

  console.log("Connected to MongoDB.");
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection unavailable.",
    });
  }
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://tribe-green-w8cf.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Tribe Green API is running.",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Get all products
app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// Get one product by slug
app.get("/api/products/:slug", (req, res) => {
  const product = products.find(
    (item) => item.slug === req.params.slug
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  return res.json({ success: true, data: product });
});

// Save a new enquiry
app.post("/api/enquiries", async (req, res) => {
  try {
    const {
      name,
      company,
      phone,
      email,
      occasion,
      units,
      budget,
      deliveryDate,
      selectedProducts,
      customisation,
      message,
      source,
    } = req.body;

    const requiredFields = {
      name,
      company,
      phone,
      email,
      occasion,
      units,
      budget,
      deliveryDate,
    };

    const missingField = Object.entries(requiredFields).some(
      ([, value]) => value === undefined || value === null || String(value).trim() === ""
    );

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    if (!/^[0-9]{10}$/.test(String(phone))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit phone number.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const quantity = Number(units);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a whole number of at least 1.",
      });
    }

    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select at least one product.",
      });
    }

    if (
      selectedProducts.some(
        (slug) => !products.some((product) => product.slug === slug)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more selected products are invalid.",
      });
    }

    if (!Array.isArray(customisation || [])) {
      return res.status(400).json({
        success: false,
        message: "Invalid customisation preferences.",
      });
    }

    const delivery = new Date(deliveryDate);

    if (Number.isNaN(delivery.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid delivery date.",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      company,
      phone,
      email,
      occasion,
      units: quantity,
      budget,
      deliveryDate: delivery,
      selectedProducts,
      customisation: customisation || [],
      message: message || "",
      source: source === "android" ? "android" : "website",
    });

    return res.status(201).json({
      success: true,
      message: "Your enquiry was saved successfully.",
      data: {
        id: enquiry._id,
        status: enquiry.status,
      },
    });
  } catch (error) {
    console.error("Enquiry creation failed:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Some enquiry details are invalid. Please check the form.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Could not save the enquiry. Please try again.",
    });
  }
});

// Get all enquiries (temporary development route)
app.get("/api/enquiries", authenticateAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (error) {
    console.error("Fetching enquiries failed:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch enquiries.",
    });
  }
});

app.patch(
  "/api/enquiries/:id/status",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "New",
        "Contacted",
        "Converted",
        "Lost",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid enquiry status.",
        });
      }

      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid enquiry ID.",
        });
      }

      const enquiry = await Enquiry.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: "Enquiry not found.",
        });
      }

      return res.json({
        success: true,
        message: "Enquiry status updated.",
        data: enquiry,
      });
    } catch (error) {
      console.error("Updating enquiry status failed:", error);

      return res.status(500).json({
        success: false,
        message: "Could not update enquiry status.",
      });
    }
  }
);

app.get(
  "/api/enquiries/export.csv",
  authenticateAdmin,
  async (req, res) => {
    try {
      const enquiries = await Enquiry.find()
        .sort({ createdAt: -1 })
        .lean();

      const columns = [
        "ID",
        "Name",
        "Company",
        "Phone",
        "Email",
        "Occasion",
        "Units",
        "Budget",
        "Delivery Date",
        "Products",
        "Customisation",
        "Message",
        "Source",
        "Status",
        "Created At",
      ];

      // Escape CSV values and prevent spreadsheet formula injection.
      function escapeCSV(value) {
        let text = String(value ?? "");

        if (/^[\s]*[=+\-@]/.test(text)) {
          text = "'" + text;
        }

        return `"${text.replace(/"/g, '""')}"`;
      }

      const rows = enquiries.map((item) => [
        item._id,
        item.name,
        item.company,
        item.phone,
        item.email,
        item.occasion,
        item.units,
        item.budget,
        item.deliveryDate
          ? new Date(item.deliveryDate).toISOString().slice(0, 10)
          : "",
        (item.selectedProducts || []).join("; "),
        (item.customisation || []).join("; "),
        item.message,
        item.source,
        item.status,
        item.createdAt
          ? new Date(item.createdAt).toISOString()
          : "",
      ]);

      const csv = [
        columns,
        ...rows,
      ]
        .map((row) => row.map(escapeCSV).join(","))
        .join("\r\n");

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="tribe-green-enquiries.csv"'
      );

      return res.send("\uFEFF" + csv);
    } catch (error) {
      console.error("CSV export failed:", error);

      return res.status(500).json({
        success: false,
        message: "Could not export enquiries.",
      });
    }
  }
);

app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
    path: "/",
  });

  return res.json({
    success: true,
    message: "Admin login successful.",
  });
});

app.post("/api/admin/logout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Tribe Green API running at http://localhost:${PORT}`);
  });
}