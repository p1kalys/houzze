import React from 'react';
import { X } from 'lucide-react';

export const FilterModal = ({ isOpen, onClose, filters, setFilters, handleFilterChange, applyFilter }) => {
  if (!isOpen) return null;

  const handleCheckboxChange = (field, value) => {
    setFilters((prevState) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-4/5 max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-60 overflow-y-auto">
          {/* Rent Range */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">Rent Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="rentMin"
                value={filters.rentMin}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <input
                type="number"
                name="rentMax"
                value={filters.rentMax}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Bills */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-5 w-5 text-gray-500"
              checked={filters.bills}
              onChange={handleFilterChange}
              name="bills"
              id="bills"
            />
            <label htmlFor="bills" className="text-sm text-gray-600">Bills Included</label>
          </div>

          {/* Parking */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-5 w-5 text-gray-500"
              checked={filters.parking}
              onChange={handleFilterChange}
              name="parking"
              id="parking"
            />
            <label htmlFor="parking" className="text-sm text-gray-600">Parking Available</label>
          </div>


          {/* Bedrooms */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">Bedrooms</label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Bedroom{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">Room Type</label>
            <select
              name="roomType"
              value={filters.roomType}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Any</option>
              {['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Bathrooms */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-600">Bathrooms</label>
            <select
              name="bathrooms"
              value={filters.bathrooms}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Bathroom{num > 1 ? 's' : ''}
                </option>
              ))}
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
                    checked={filters?.preferredType?.includes(type)}
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
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={applyFilter}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}