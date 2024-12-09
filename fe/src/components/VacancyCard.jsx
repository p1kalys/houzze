import { ChevronDown, ChevronUp, MapPin, DollarSign, Calendar } from 'lucide-react';

export const VacancyCard = ({ vacancy, isExpanded, onToggle }) => {
  const handleOpenMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${vacancy.address}, ${vacancy.postcode}`
    )}`;
    window.open(mapsUrl, '_blank');
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-indigo-500' : 'hover:shadow-lg'
        }`}
    >
      <div className="p-4">
        {/* Header with Title and Expand Button */}
        <div className="flex justify-between items-start cursor-pointer" onClick={onToggle}>
          <h2 className="text-xl font-semibold text-gray-800">{truncateText(vacancy.description, 100)}</h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Basic Details */}
        <div className="mt-2 text-gray-600">
          <div className="flex flex-col justify-between md:flex-row md:space-x-4">
            <p className="text-sm flex text-indigo-700 hover:text-indigo-400 items-center cursor-pointer" onClick={handleOpenMaps}>
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              {vacancy.address}, {vacancy.postcode}
            </p>
            <p className="text-sm flex items-center mt-1 md:mt-0">
              <span>Published on {new Date(vacancy.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>


        {/* Expanded View */}
        {isExpanded && (
          <div className="mt-4 animate-fadeIn">
            <p className="text-gray-700 whitespace-pre-line">{vacancy.title} - {vacancy.description}</p>
            <p className="text-sm flex items-center mt-1">
              <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
              Rent: ₹{vacancy.rent} / Deposit: ₹{vacancy.deposit}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Bedrooms & Bathrooms */}
              <div className="text-sm text-gray-600">
                <p>
                  Bedrooms: {vacancy.bedrooms}
                </p>
                <p>Bathrooms: {vacancy.bathrooms}</p>
              </div>
              {/* Availability & Parking */}
              <div className="text-sm text-gray-600">
                <p>Available From: {new Date(vacancy.available).toLocaleDateString()}</p>
                <p>Parking: {vacancy.parking ? 'Yes' : 'No'}</p>
              </div>
              {/* Room & Preferred Type */}
              <div className="text-sm text-gray-600">
                <p>Room Type: {vacancy.roomType}</p>
                <p>Preferred Tenant: {vacancy.preferredType || 'Any'}</p>
              </div>
              {/* Nationality & Bills */}
              <div className="text-sm text-gray-600">
                <p>Preferred Nationality: {vacancy.nationality || 'Any'}</p>
                <p>Bills Included: {vacancy.bills ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Benefits */}
            {vacancy.benefits && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-800">Benefits:</h3>
                <p className="text-sm text-gray-700">{vacancy.benefits}</p>
              </div>
            )}

            {/* Contact Details */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800">Contact:</h3>
              <a
                href={`tel:${vacancy.contact}`}
                className="text-sm text-indigo-700 hover:text-indigo-500"
              >
                {vacancy.contact}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
