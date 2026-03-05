const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donationSchema = new Schema(
  {
    totalDonation: { type: Number, required: true },
    numberOfDonors: { type: Number, required: true },
  },
  { timestamps: true },
);

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
