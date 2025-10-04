const Doctor = require("../models/Doctor");
const {onlineDoctors}=require("../Sockets/onlineUsers")

const SpecialistHandler = async (req, res) => {
  try {
    
    // 1. Fetch only relevant doctors
    const doctors = await Doctor.find({ specialization: req.params.specialist });
      
    const enriched = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      specialist: doc.specialist,
      isOnline: onlineDoctors.has(doc._id.toString()),
    }));

    // sort the array such that online doctors comes first
    enriched.sort((a, b) => b.isOnline - a.isOnline);

    res.json(enriched);

  } catch (err) {    
    res.status(500).json({ error: err.message });
  }
};

module.exports = { SpecialistHandler };
