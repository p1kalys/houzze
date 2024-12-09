const mongoose = require('mongoose');

const VacancySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rent: { type: Number, required: true },
  deposit: { type: Number, required: true },
  address: { type: String, required: true },
  postcode: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  contact: { type: String, required: true },
  benefits: { type: String },
  bills: { type: Boolean, default: false },
  nationality: { type: String },
  roomType: { type: String, enum: ['1BHK','2BHK', '3BHK', '4BHK', '5BHK'], required: true },
  preferredType: { type: String, enum: ['Student', 'Boy', 'Girl', 'Professional', 'Couple'] },
  parking: { type: Boolean, default: false },
  available: { type: Date, required: true, default: Date.now() },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});


VacancySchema.index({ createdAt: 1 }, { expireAfterSeconds: 29 * 24 * 60 * 60 });

const Vacancy = mongoose.model('Vacancy', VacancySchema);

module.exports = Vacancy;
