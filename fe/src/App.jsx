import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";  // Import Router, Routes, and Route
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { VacancyCard } from "./components/VacancyCard";
import { AddVacancyForm } from "./components/AddVacancy";
import { ProfilePage } from "./components/Profile";
import API from "./api";
import { SearchBar } from "./components/SearchBar";
import { Filter, X } from "lucide-react";
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
    <div className="min-h-screen bg-gray-100">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={() => navigate('/login')}
        onSignupClick={() => navigate('/signup')}
        onProfileClick={() => navigate('/profile')}
        onAddVacanciesClick={() => navigate('/add-vacancy')}
        onVacanciesClick={() => navigate('/')}
        onLogoutClick={handleLogout}
      />

      <Routes>
        <Route path="/login" element={<AuthModal type="login" setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<AuthModal type="signup" setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/" element={
          <div className="max-w-9xl max-h-screen mx-auto px-4 py-8 pt-28">
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
    </div>
  );
}


export default App;
