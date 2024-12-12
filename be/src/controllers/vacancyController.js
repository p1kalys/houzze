const Vacancy = require("../models/Vacancy");
const { createVacancyValidator } = require("../validators/vacancyValidator");

// Create a new vacancy
const createVacancy = async (req, res) => {
  try {
    const data = createVacancyValidator.parse(req.body);
    const vacancy = new Vacancy({ ...data, createdBy: req.user._id });

    await vacancy.save();
    res.status(201).json({ message: "Vacancy created successfully", vacancy });
  } catch (error) {
    res.status(400).json({ message: error.message || "Validation error" });
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
    if (filters.minRent || filters.maxRent) {
      query.rent = {};
      if (filters.minRent) query.rent.$gte = Number(filters.minRent);
      if (filters.maxRent) query.rent.$lte = Number(filters.maxRent);
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
    if (filters.search) {
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
      _id: id
    });
    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found."});
    }
    res.status(200).json({ message: "Vacancy updated successfully", vacancy });
  } catch (error) {
    res.status(400).json({ message: error.message || "Error occurred." });
  }
}

const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params;

    const data = createVacancyValidator.parse(req.body);

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
    res.status(400).json({ message: error.message || "Validation error" });
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
      return res.status(404).json({ message: "Vacancy not found or unauthorized." });
    }

    res.status(200).json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message || "An error occurred while deleting the vacancy." });
  }
};


module.exports = { createVacancy, getVacancies, getVacancy, updateVacancy, deleteVacancy };
