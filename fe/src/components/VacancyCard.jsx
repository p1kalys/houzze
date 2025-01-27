import { ChevronDown, ChevronUp, MapPin, Calendar, BadgeEuro, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

export const VacancyCard = ({ vacancy, isExpanded, onToggle }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImagePopup, setShowImagePopup] = useState(false);

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

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === vacancy.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? vacancy.images.length - 1 : prev - 1
    );
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setShowImagePopup(true);
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isExpanded ? 'ring-2 ring-indigo-500' : 'hover:shadow-lg'
      }`}>
        <div className="flex flex-row">
          {/* Image Section - Left Side (Only show when not expanded) */}
          {!isExpanded && vacancy.images && vacancy.images.length > 0 && (
            <div className="relative w-1/3 h-24 md:h-32 cursor-pointer" onClick={() => setShowImagePopup(true)}>
              <img
                src={vacancy.images[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {vacancy.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage(e);
                    }}
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 p-1 md:p-2 rounded-full text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage(e);
                    }}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 p-1 md:p-2 rounded-full text-white hover:bg-black/70"
                  >
                    <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
                  </button>
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {vacancy.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              {/* Price Badge */}
              <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-md shadow-sm">
                <span className="text-sm md:text-base font-semibold">£{vacancy.rent}</span>
                <span className="text-xs md:text-sm">/month</span>
              </div>
            </div>
          )}

          {/* Content Section - Right Side */}
          <div className="p-2 md:p-4 flex-1">
            {/* Header with Title and Expand Button */}
            <div className="flex justify-between items-start cursor-pointer" onClick={onToggle}>
              <div className="flex-1">
                {/* Price for mobile when no image */}
                {(!vacancy.images || vacancy.images.length === 0) && (
                  <div className="mb-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded-md text-sm md:text-base font-semibold">
                      £{vacancy.rent}/month
                    </span>
                  </div>
                )}
                <h2 className="text-base md:text-xl font-semibold text-gray-800">
                  {truncateText(vacancy.description, 100)}
                </h2>
                {/* Key Features Row */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 bg-indigo-50 text-xs md:text-sm text-indigo-700 rounded">
                    {vacancy.bedrooms} {vacancy.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                  </span>
                  {vacancy.bills && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-xs md:text-sm text-blue-700 rounded">
                      Bills Included
                    </span>
                  )}
                  {vacancy.parking && (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-50 text-xs md:text-sm text-yellow-700 rounded">
                      Parking Available
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-2"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Location and Date Info */}
            <div className="mt-2 md:mt-3 text-gray-600">
              <div className="flex flex-col justify-between md:flex-row md:space-x-4">
                <p className="text-xs md:text-sm flex text-indigo-700 hover:text-indigo-400 items-center cursor-pointer" onClick={handleOpenMaps}>
                  <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 text-gray-500" />
                  {vacancy.address}, {vacancy.postcode}
                </p>
                <div className="flex items-center mt-1 md:mt-0 space-x-4">
                  <p className="text-xs md:text-sm flex items-center">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 text-gray-500" />
                    Available from {new Date(vacancy.available).toLocaleDateString()}
                  </p>
                  <p className="text-xs md:text-sm flex items-center">
                    Posted {new Date(vacancy.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Info - Not Expanded */}
            {!isExpanded && (
              <div className="mt-2 text-sm text-gray-600">
                <p className="line-clamp-2">
                  {vacancy.roomType} • {vacancy.bathrooms} {vacancy.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'} 
                  {vacancy.preferredType.length > 0 && ` • Suitable for ${vacancy.preferredType.join(', ')}`}
                  {vacancy.nationality && ` • ${vacancy.nationality} preferred`}
                </p>
              </div>
            )}

            {/* Expanded View */}
            {isExpanded && (
              <div className="mt-4 animate-fadeIn">
                {/* Image Grid View in Expanded Mode */}
                {vacancy.images && vacancy.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {vacancy.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Property view ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(index)}
                      />
                    ))}
                  </div>
                )}

                {/* Rest of the expanded content */}
                <p className="text-gray-700 whitespace-pre-line">
                  {vacancy.title} - {vacancy.description}
                </p>
                <p className="text-sm flex items-center mt-1">
                  <BadgeEuro className="h-4 w-4 mr-1 text-gray-500" />
                  Rent: £{vacancy.rent} / Deposit: £{vacancy.deposit}
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
                    <p>Preferred Tenant:  {vacancy.preferredType.length > 0
                      ? vacancy.preferredType.join(", ")
                      : "Any"}</p>
                  </div>
                  {/* Nationality & Bills */}
                  <div className="text-sm text-gray-600">
                    <p>Preferred Nationality: {vacancy.nationality || 'Any'}</p>
                    <p>Bills Included: {vacancy.bills ? 'Yes' : 'No'}</p>
                  </div>
                  {/* Smoker & Pets */}
                  <div className="text-sm text-gray-600">
                    <p>Smoker Allowed: {vacancy.smoker ? 'Yes' : 'No'}</p>
                    <p>Pets Allowed: {vacancy.pets ? 'Yes' : 'No'}</p>
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
                  <h3 className="text-sm font-semibold pb-2 text-gray-800">Contact Details:</h3>
                  <div className="flex flex-col space-y-1">
                    {/* Name */}
                    {vacancy.name && <div className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Name:</span> {vacancy.name || 'N/A'}
                    </div>}
                    {/* Email */}
                    {vacancy.email && <div className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Email:</span>{' '}
                      <a
                        href={`mailto:${vacancy.email}`}
                        className="text-indigo-700 hover:text-indigo-500"
                      >
                        {vacancy.email || 'N/A'}
                      </a>
                    </div>}
                    {/* Contact */}
                    <div className="text-sm text-gray-700">
                      <span className="font-medium text-gray-800">Phone:</span>{' '}
                      <a
                        href={`tel:${vacancy.contact}`}
                        className="text-indigo-700 hover:text-indigo-500"
                      >
                        {vacancy.contact || 'N/A'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Popup */}
      {showImagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImagePopup(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="relative">
              <img
                src={vacancy.images[currentImageIndex]}
                alt={`Property ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {vacancy.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {vacancy.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
