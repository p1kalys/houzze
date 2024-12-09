import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";  // Import Router, Routes, and Route
import { Navbar } from "./components/Navbar";
import { AuthModal } from "./components/AuthModal";
import { VacancyCard } from "./components/VacancyCard";
import { AddVacancyForm } from "./components/AddVacancy";
import { ProfilePage } from "./components/Profile";
import API from "./api";
import { SearchBar } from "./components/SearchBar";
import { Filter } from "lucide-react";
import { FilterModal } from "./components/FilterModal";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [expandVacancyId, setExpandVacancyId] = useState(null);
  const [allVacancies, setAllVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    rentMin: '',
    rentMax: '',
    bills: '',
    parking: '',
    bedrooms: '',
    roomType: '',
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
      roomType: '',
      bathrooms: '',
    }))
  }

  const cancelFilter = () => {
    setIsFilterModalOpen(false);
    resetFilters();
  }

  const applyFilters = () => {
    fetchVacancies(filters);
    setIsFilterModalOpen(false);
  };

  useEffect(() => {
    fetchVacancies();
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, [])

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


  const handleLogin = async (credentials) => {
    try {
      const res = await API.post('/users/login', credentials);
      setIsLoggedIn(true);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignup = async (credentials) => {
    try {
      await API.post('/users/register', credentials);
      navigate('/login');
    } catch (error) {
      console.error("Signup failed:", error);
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
        <Route path="/login" element={<AuthModal type="login" onSubmit={handleLogin} />} />
        <Route path="/signup" element={<AuthModal type="signup" onSubmit={handleSignup} />} />
        <Route path="/" element={
          <div className="max-w-9xl max-h-screen mx-auto px-4 py-8 pt-28">
            <div className="flex items-center gap-2 mb-8">
              <SearchBar onSearch={handleFilterChange} />
              <button
                onClick={applyFilters}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Search
              </button>
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center text-sm font-medium"
              >
                <Filter className="h-5 w-5 mr-2" />
              </button>
            </div>
            <FilterModal
              isOpen={isFilterModalOpen}
              onClose={cancelFilter}
              filters={filters}
              handleFilterChange={handleFilterChange}
              applyFilter={applyFilters}
            />
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
      </Routes>
    </div>
  );
}


export default App;
