import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";  // Import Router, Routes, and Route
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { VacancyCard } from "./components/VacancyCard";
import { AddVacancyForm } from "./components/AddVacancy";
import { ProfilePage } from "./components/Profile";
import API from "./api";
import { SearchBar } from "./components/SearchBar";
import { Filter, X, Mail } from "lucide-react";
import { FilterModal } from "./components/FilterModal";
import { EditVacancy } from "./components/EditVacancy";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [expandVacancyId, setExpandVacancyId] = useState(null);
  const [allVacancies, setAllVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filterOn, setFilterOn] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    rentMin: '',
    rentMax: '',
    bills: '',
    parking: '',
    bedrooms: '',
    roomType: '',
    preferredType: [],
    bathrooms: '',
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      search: '',
      rentMin: '',
      rentMax: '',
      bills: '',
      parking: '',
      bedrooms: '',
      preferredType: [],
      roomType: '',
      bathrooms: '',
    }))
    setFilterOn(false);
    fetchVacancies();
  }

  const cancelFilter = () => {
    setIsFilterModalOpen(false);
    resetFilters();
    setFilterOn(false);
  }

  const applyFilters = () => {
    fetchVacancies(filters);
    setIsFilterModalOpen(false);
    setFilterOn(true);
  };

  useEffect(() => {
    fetchVacancies();
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  const fetchVacancies = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      const res = await API.get('/vacancies/', { params: appliedFilters });
      setAllVacancies(res.data.vacancies);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post('/users/logout');
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={() => navigate('/login')}
        onSignupClick={() => navigate('/signup')}
        onProfileClick={() => navigate('/profile')}
        onAddVacanciesClick={() => navigate('/add-vacancy')}
        onVacanciesClick={() => navigate('/')}
        onLogoutClick={handleLogout}
      />

      <div className="flex-grow flex flex-col w-full">
        <Routes>
          <Route path="/login" element={<AuthModal type="login" setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<AuthModal type="signup" setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/" element={
            <div className="container mx-auto px-4 py-8 pt-20 sm:pt-24 flex-grow">
              {/* Hero Section - Only show when not logged in */}
              {!isLoggedIn && (
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                  <div className="max-w-4xl mx-auto text-center">
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 px-2 sm:px-4">
                      Browse through listings of rooms, flats, and houses. 
                      Connect directly with landlords and find your ideal accommodation.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base max-w-3xl mx-auto">
                      <div className="flex items-center justify-center bg-gray-50 p-3 rounded-lg">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">Quick Response</span>
                      </div>
                      <div className="flex items-center justify-center bg-gray-50 p-3 rounded-lg">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-gray-700">No Hidden Fees</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Search and Filter Section */}
              <div className="flex items-center gap-2 mb-8">
                <SearchBar filters={filters} onSearch={handleFilterChange} />
                <button
                  onClick={applyFilters}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Search
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center text-sm font-medium p-2 hover:bg-gray-200 rounded-full"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={cancelFilter}
                filters={filters}
                setFilters={setFilters}
                handleFilterChange={handleFilterChange}
                applyFilter={applyFilters}
              />
              {filterOn && <div className="flex items-center mb-4">
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-2 px-2 py-1 text-sm font-medium text-indigo-500 border border-indigo-500 rounded-full hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <X className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs text-gray-700">Remove Filters</span>
                </button>
              </div>}

              <div className="grid gap-6">
                {(loading) ?
                  <div className="flex justify-center items-center h-screen">
                    <div className="loader border-t-indigo-500 border-4 w-12 h-12 rounded-full animate-spin"></div>
                  </div>
                  : (
                    allVacancies.length > 0 ? allVacancies.map((vacancy) => (
                      <VacancyCard
                        key={vacancy._id}
                        vacancy={vacancy}
                        isExpanded={expandVacancyId === vacancy._id}
                        onToggle={() => setExpandVacancyId(
                          expandVacancyId === vacancy._id ? null : vacancy._id
                        )}
                      />
                    )) : <>
                      No Vacancies available
                    </>
                  )}
              </div>
            </div>
          } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-vacancy" element={<AddVacancyForm refetch={fetchVacancies} />} />
          <Route path="/edit-vacancy/:id" element={<EditVacancy refetch={fetchVacancies} />} />
        </Routes>

        {/* Responsive Footer */}
        <footer className="bg-white shadow-md mt-auto w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Feedback Button */}
              <a
                href="mailto:pavanemani14@gmail.com?subject=FeedBack%20for%20Houzze"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Send Feedback</span>
              </a>

              {/* Copyright Text */}
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Houzze. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
