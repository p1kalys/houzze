import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

// Add this helper function for image compression
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 1024; // Max width/height
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress image
        canvas.toBlob((blob) => {
          const compressedReader = new FileReader();
          compressedReader.readAsDataURL(blob);
          compressedReader.onloadend = () => {
            resolve(compressedReader.result);
          };
        }, 'image/jpeg', 0.7);
      };
    };
  });
};

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
    images: [],
    smoker: 'false',
    pets: 'false',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+44');
  const [phoneNo, setPhoneNo] = useState('');
  const [imagePreview, setImagePreview] = useState([]);

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
        images: [],
        smoker: 'false',
        pets: 'false',
      });
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 413) {
        setError("Images are too large. Please reduce the size or number of images.");
        setImagePreview([]);
        setFormData(prev => ({ ...prev, images: [] }));
      } else {
        setError("Error occurred. Please fill all the fields properly. Ensure Image sizes are less than 2 MB");
      }
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
        smoker: formData.smoker === 'true',
        pets: formData.pets === 'true',
        images: formData.images,
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

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 500 * 1024; // 500KB in bytes
    const maxFiles = 5; // Maximum number of files
    
    // Clear previous previews if any
    setImagePreview([]);
    setFormData(prev => ({ ...prev, images: [] }));
    
    // Check number of files
    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }
    
    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Please upload only image files');
          continue;
        }
        
        // Compress and process image
        const compressedImage = await compressImage(file);
        
        // Check compressed size
        const base64Size = (compressedImage.length * 3) / 4 - 
          (compressedImage.endsWith('==') ? 2 : compressedImage.endsWith('=') ? 1 : 0);
        
        if (base64Size > maxFileSize) {
          setError(`Image ${file.name} is too large. Maximum size is 500KB`);
          continue;
        }
        
        setImagePreview(prev => [...prev, compressedImage]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, compressedImage]
        }));
      }
    } catch (error) {
      setError('Error processing images. Please try again.');
      console.error('Error processing images:', error);
    }
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const imageUploadSection = (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Smoking Allowed
      </label>
      <select
        id="smoker"
        value={formData.smoker}
        onChange={(e) => handleChange('smoker', e.target.value)}
        className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
        required
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>

      <label className="block text-sm font-medium text-gray-700">
        Pets Allowed
      </label>
      <select
        id="pets"
        value={formData.pets}
        onChange={(e) => handleChange('pets', e.target.value)}
        className="mt-1 block w-full rounded-md border-2 border-gray-300 focus:border-indigo-600 focus:ring-indigo-600 px-4 py-2 text-sm md:text-base"
        required
      >
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>

      <label className="block text-sm font-medium text-gray-700">
        Upload Images
      </label>
      <div className="mt-1 flex items-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      {/* Image Preview Section */}
      {imagePreview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {imagePreview.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="h-24 w-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -left-1 bg-red-500 text-white rounded-full pb-1 w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
          {/* Add the image upload section before the submit button */}
          {imageUploadSection}
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
