import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export const AddVacancyForm = ({ refetch }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: 0,
    deposit: 0,
    address: '',
    postcode: '',
    bedrooms: 0,
    bathrooms: 0,
    contact: '',
    benefits: '',
    bills: 'false',
    nationality: '',
    email: '',
    name: '',
    roomType: '',
    preferredType: [],
    parking: 'false',
    available: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+44');
  const [phoneNo, setPhoneNo] = useState('');

  const countryCodes = [
    { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
    { code: 'US', name: 'United States', phoneCode: '+1' },
    { code: 'CA', name: 'Canada', phoneCode: '+1' },
    { code: 'AU', name: 'Australia', phoneCode: '+61' },
    { code: 'DE', name: 'Germany', phoneCode: '+49' },
    { code: 'FR', name: 'France', phoneCode: '+33' },
    { code: 'JP', name: 'Japan', phoneCode: '+81' },
    { code: 'IN', name: 'India', phoneCode: '+91' },
    { code: 'BR', name: 'Brazil', phoneCode: '+55' },
    { code: 'CN', name: 'China', phoneCode: '+86' },
    { code: 'ES', name: 'Spain', phoneCode: '+34' },
    { code: 'IT', name: 'Italy', phoneCode: '+39' },
    { code: 'NL', name: 'Netherlands', phoneCode: '+31' },
    { code: 'RU', name: 'Russia', phoneCode: '+7' },
    { code: 'SG', name: 'Singapore', phoneCode: '+65' },
  ];


  const handleVacanciesSubmit = async (vacancyData) => {
    try {
      await API.post('/vacancies/create', vacancyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/');
      refetch();
      setFormData({
        title: '',
        description: '',
        rent: 0,
        deposit: 0,
        address: '',
        postcode: '',
        bedrooms: 0,
        bathrooms: 0,
        contact: '',
        email: '',
        name: '',
        benefits: '',
        bills: 'false',
        nationality: '',
        roomType: '',
        preferredType: [],
        parking: 'false',
        available: '',
      });
      setError('');
    } catch (error) {
      setError("Error occurred. Please fill all the fields properly.");
      console.error("Error submitting vacancy:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await handleVacanciesSubmit({
        ...formData,
        contact: `${selectedCountryCode}${phoneNo}`,
        bills: formData.bills === 'true',
        parking: formData.parking === 'true',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prevState) => {
      const updatedField = [...prevState[field]];

      // Toggle value in array
      if (updatedField.includes(value)) {
        return {
          ...prevState,
          [field]: updatedField.filter((item) => item !== value),
        };
      } else {
        return {
          ...prevState,
          [field]: [...updatedField, value],
        };
      }
    });
  };

  useEffect(() => {
    console.log("ff", formData);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Vacancy Form</h2>
          {error && (
            <div className="mb-4 p-4 text-red-800 bg-red-100 border border-red-300 rounded-md">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              rows={4}
              required
            />
          </div>

          {/* Preferred Nationality */}
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Preferred Nationality
            </label>
            <input
              type="text"
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
            />
          </div>

          {/* Benefits */}
          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">
              Benefits
            </label>
            <textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => handleChange('benefits', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              rows={3}
            />
          </div>

          {/* Rent */}
          <div>
            <label htmlFor="rent" className="block text-sm font-medium text-gray-700">
              Rent <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="rent"
              value={formData.rent}
              min="0"
              onChange={(e) => handleChange('rent', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            />
          </div>

          {/* Deposit */}
          <div>
            <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">
              Deposit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="deposit"
              value={formData.deposit}
              min="0"
              onChange={(e) => handleChange('deposit', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            />
          </div>

          {/* Postcode */}
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="postcode"
              value={formData.postcode}
              onChange={(e) => handleChange('postcode', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
              Bedrooms <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="bedrooms"
              min="0"
              value={formData.bedrooms}
              onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            />
          </div>

          {/* Bathrooms */}
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
              Bathrooms <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="bathrooms"
              min="0"
              value={formData.bathrooms}
              onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            />
          </div>

          {/* Bills */}
          <div>
            <label htmlFor="bills" className="block text-sm font-medium text-gray-700">
              Bills Included
            </label>
            <select
              id="bills"
              value={formData.bills}
              onChange={(e) => handleChange('bills', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* Room Type */}
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
              Room Type <span className="text-red-500">*</span>
            </label>
            <select
              id="roomType"
              value={formData.roomType}
              onChange={(e) => handleChange('roomType', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            >
              <option value="">Select Room Type</option>
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="4BHK">4BHK</option>
              <option value="5BHK">5BHK</option>
            </select>
          </div>

          {/* Preferred Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Tenant Type
            </label>
            <div className="mt-2 space-y-2">
              {["Student", "Male", "Female", "Professional", "Couple", "Any"].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`preferredType-${type}`}
                    value={type}
                    checked={formData.preferredType.includes(type)}
                    onChange={() => handleCheckboxChange("preferredType", type)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`preferredType-${type}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Parking */}
          <div>
            <label htmlFor="parking" className="block text-sm font-medium text-gray-700">
              Parking Available <span className="text-red-500">*</span>
            </label>
            <select
              id="parking"
              value={formData.parking}
              onChange={(e) => handleChange('parking', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* Available Date */}
          <div>
            <label htmlFor="available" className="block text-sm font-medium text-gray-700">
              Available From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="available"
              value={formData.available}
              onChange={(e) => handleChange('available', e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              required
            />
          </div>
          <div className="mt-4 pt-4 space-y-6 border-t border-gray-200">
            {/* Name */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
                required
              />
            </div>
            {/* Contact Number */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                {/* Country Code Dropdown */}
                <select
                  name="phone"
                  value={selectedCountryCode}
                  onChange={(e) => setSelectedCountryCode(e.target.value)}
                  className="mt-1 p-1 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                >
                  {countryCodes.map((item) => (
                    <option key={item.code} value={`${item.phoneCode}`}>
                      {item.code} ({item.phoneCode})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  id="contact"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
