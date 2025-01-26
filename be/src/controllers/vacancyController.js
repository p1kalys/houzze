const Vacancy = require("../models/Vacancy");

// Helper function for validation errors
const validateVacancyData = (data) => {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.length < 3) {
    errors.push("Title must be at least 3 characters long.");
  }
  if (!data.description || typeof data.description !== 'string' || data.description.length < 5) {
    errors.push("Description must be at least 5 characters long.");
  }
  if (typeof data.rent !== 'number' || data.rent < 0) {
    errors.push("Rent must be a positive number.");
  }
  if (typeof data.deposit !== 'number' || data.deposit < 0) {
    errors.push("Deposit must be a positive number.");
  }
  if (!data.address || typeof data.address !== 'string' || data.address.length < 5) {
    errors.push("Address must be at least 5 characters long.");
  }
  if (!data.postcode || typeof data.postcode !== 'string' || data.postcode.length < 4) {
    errors.push("Postcode must be at least 4 characters long.");
  }
  if (typeof data.bedrooms !== 'number' || data.bedrooms < 0) {
    errors.push("Bedrooms must be a positive integer.");
  }
  if (typeof data.bathrooms !== 'number' || data.bathrooms < 0) {
    errors.push("Bathrooms must be a positive integer.");
  }
  if (!/^(\+?[0-9]\d{1,14})$/.test(data.contact)) {
    errors.push("Contact must be a valid international phone number (E.164 format).");
  }
  if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    errors.push("Invalid email format.");
  }
  if (!data.roomType || !["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"].includes(data.roomType)) {
    errors.push("Invalid room type.");
  }
  if (data.preferredType && !Array.isArray(data.preferredType)) {
    errors.push("Preferred type must be an array.");
  } else if (data.preferredType && !data.preferredType.every(type => ["Student", "Male", "Female", "Professional", "Couple", "Any"].includes(type))) {
    errors.push("Invalid preferred type.");
  }
  if (typeof data.bills !== 'boolean') {
    errors.push("Bills must be a boolean.");
  }
  if (typeof data.parking !== 'undefined' && typeof data.parking !== 'boolean') {
    errors.push("Parking must be a boolean.");
  }
  if (data.available && isNaN(new Date(data.available).getTime())) {
    errors.push("Available date must be a valid date.");
  }
  if (data.images) {
    if (!Array.isArray(data.images)) {
      errors.push("Images must be an array.");
    } else {
      // Validate each image URL in the array
      const invalidImages = data.images.filter(url => {
        if (typeof url !== 'string') return true;
        try {
          new URL(url);
          return false; // URL is valid
        } catch {
          return true; // URL is invalid
        }
      });
      
      if (invalidImages.length > 0) {
        errors.push("All images must be valid URLs.");
      }
    }
  }

  return errors;
};

const createVacancy = async (req, res) => {
  try {
    // Check payload size
    const payloadSize = JSON.stringify(req.body).length;
    const maxPayloadSize = 10 * 1024 * 1024; // 10MB limit
    
    if (payloadSize > maxPayloadSize) {
      return res.status(413).json({
        status: 'error',
        message: "Payload too large. Please reduce the size of your images or submit fewer images."
      });
    }

    const errors = validateVacancyData(req.body);
    if (errors.length > 0) {
      return res.status(422).json({ 
        status: 'error',
        message: errors.join(", "),
        errors: errors 
      });
    }

    const vacancy = new Vacancy({ ...req.body, createdBy: req.user._id });
    await vacancy.save();
    res.status(201).json({ 
      status: 'success',
      message: "Vacancy created successfully", 
      data: vacancy 
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(422).json({
        status: 'error',
        message: "Validation failed",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      status: 'error',
      message: "Internal server error",
      error: error.message 
    });
  }
};

const updateVacancy = async (req, res) => {
  try {
    // Check payload size
    const payloadSize = JSON.stringify(req.body).length;
    const maxPayloadSize = 10 * 1024 * 1024; // 10MB limit
    
    if (payloadSize > maxPayloadSize) {
      return res.status(413).json({
        status: 'error',
        message: "Payload too large. Please reduce the size of your images or submit fewer images."
      });
    }

    const { id } = req.params;
    const data = req.body;

    const validationErrors = validateVacancyData(data);

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(", ") || "Validation error" });
    }

    const vacancy = await Vacancy.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found or unauthorized." });
    }

    res.status(200).json({ message: "Vacancy updated successfully", vacancy });
  } catch (error) {
    res.status(400).json({ message: error.message || "An error occurred while updating the vacancy." });
  }
};

const getVacancies = async (req, res) => {
  try {
    const filters = req.query;
    const query = {};
    // Search filters
    if (filters.address) query.address = new RegExp(filters.address, "i");
    if (filters.roomType) query.roomType = filters.roomType;
    if (filters.preferredType) {
      const preferredTypes = Array.isArray(filters.preferredType)
        ? filters.preferredType
        : [filters.preferredType];
      query.preferredType = { $in: preferredTypes };
    }
    if (filters.postcode) query.postcode = filters.postcode;
    if (filters.category) query.category = filters.category;
    if (filters.nationality) query.nationality = filters.nationality;

    // Rent filters (min/max)
    if (filters.rentMin || filters.rentMax) {
      query.rent = {};
      if (filters.rentMin) {
        query.rent.$gte = Number(filters.rentMin); // Apply rentMin filter if provided
      }
      if (filters.rentMax) {
        query.rent.$lte = Number(filters.rentMax); // Apply rentMax filter if provided
      }
    }

    // Bedrooms and bathrooms filters
    if (filters.bedrooms) query.bedrooms = { $gte: Number(filters.bedrooms) }; // Min bedrooms
    if (filters.bathrooms)
      query.bathrooms = { $gte: Number(filters.bathrooms) }; // Min bathrooms

    // Boolean filters
    if (filters.parking) query.parking = filters.parking === "true"; // Convert to boolean
    if (filters.bills) query.bills = filters.bills === "true"; // Convert to boolean

    // Availability date filter
    if (filters.available) {
      query.available = { $gte: new Date(filters.available) };
    }

    // Full-text search in multiple fields
    if (filters.search !== "") {
      const searchRegex = new RegExp(filters.search, "i"); // Case-insensitive partial match
      query.$or = [
        { address: searchRegex },
        { postcode: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { benefits: searchRegex },
        { nationality: searchRegex },
        { category: searchRegex },
      ];
    }

    // Sorting
    const sortBy = filters.sortBy || "createdAt"; // Default to "createdAt" for recent vacancies
    const allowedSortFields = ["rent", "createdAt", "bedrooms", "bathrooms"]; // Allowed fields for sorting
    if (!allowedSortFields.includes(sortBy)) {
      throw new Error(
        `Invalid sort field: ${sortBy}. Allowed fields: ${allowedSortFields.join(
          ", "
        )}`
      );
    }
    const sortOrder =
      filters.sortOrder === "desc" || !filters.sortOrder ? -1 : 1; // Default: descending order for createdAt

    // Fetch vacancies with sorting and filters
    const vacancies = await Vacancy.find(query)
      .populate("createdBy", "name email")
      .sort({ [sortBy]: sortOrder });

    // Respond with all vacancies
    res.status(200).json({
      vacancies,
      totalVacancies: vacancies.length,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "An error occurred while fetching vacancies.",
    });
  }
};

const getVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const vacancy = await Vacancy.findOne({
      _id: id,
    });
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found." });
    }
    res.status(200).json({ message: "Vacancy updated successfully", vacancy });
  } catch (error) {
    res.status(400).json({ message: error.message || "Error occurred." });
  }
};

// Delete a vacancy
const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params;

    const vacancy = await Vacancy.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!vacancy) {
      return res
        .status(404)
        .json({ message: "Vacancy not found or unauthorized." });
    }

    res.status(200).json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({
        message:
          error.message || "An error occurred while deleting the vacancy.",
      });
  }
};

module.exports = {
  createVacancy,
  getVacancies,
  getVacancy,
  updateVacancy,
  deleteVacancy,
};
