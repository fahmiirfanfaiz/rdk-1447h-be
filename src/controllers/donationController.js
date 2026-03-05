const Donation = require("../models/donationModel");

// CREATE a new donation record
exports.createDonation = async (req, res) => {
    try {
        const { totalDonation, numberOfDonors } = req.body;
        const newDonation = new Donation({ totalDonation, numberOfDonors });
        const savedDonation = await newDonation.save();
        res.status(201).json(savedDonation);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error creating donation record", error });
    }
};

// GET all donation records
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find();
        if (donations.length === 0) {
            return res.status(404).json({ success: false, message: "No donation records found" });
        }
        res.status(200).json({ success: true, data: donations });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching donation records", error });
    }
};

// GET a single donation record by ID
exports.getDonationById = async (req, res) => {
    try {
        const { id } = req.params;
        const donation = await Donation.findById(id);
        if (!donation) {
            return res.status(404).json({ success: false, message: "Donation record not found" });
        }
        res.status(200).json({ success: true, data: donation });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching donation record", error });
    }
};

// UPDATE a donation record by ID
exports.updateDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalDonation, numberOfDonors } = req.body;
        const updatedDonation = await Donation.findByIdAndUpdate(
            id,
            { totalDonation, numberOfDonors },
            { new: true }
        );
        if (!updatedDonation) {
            return res.status(404).json({ success: false, message: "Donation record not found" });
        }
        res.status(200).json({ success: true, data: updatedDonation });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating donation record", error });
    }
};

// DELETE a donation record by ID
exports.deleteDonation = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDonation = await Donation.findByIdAndDelete(id);
        if (!deletedDonation) {
            return res.status(404).json({ success: false, message: "Donation record not found" });
        }
        res.status(200).json({ success: true, message: "Donation record deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting donation record", error });
    }
};