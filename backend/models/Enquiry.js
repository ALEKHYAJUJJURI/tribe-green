const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
  match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    occasion: {
      type: String,
      required: true,
    },
    units: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number.",
      },
    },
    budget: {
      type: String,
      required: true,
      enum: [
        "Under ₹500",
        "₹500–₹1,500",
        "₹1,500–₹3,000",
        "Above ₹3,000",
      ],
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    selectedProducts: {
      type: [String],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Select at least one product.",
      },
    },
    customisation: {
      type: [String],
      default: [],
    },
    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    source: {
      type: String,
      enum: ["website", "android"],
      default: "website",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Lost"],
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);