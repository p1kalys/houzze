import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Trash, Pencil } from 'lucide-react';
import API from '../api';
import { VacancyCard } from './VacancyCard';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from './ConfirmationModal';


export const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [expandVacancyId, setExpandVacancyId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [vacancyToDelete, setVacancyToDelete] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/users/account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfile(response.data.user);
      setVacancies(response.data.vacancies);
    } catch (err) {
      setError('Failed to fetch profile data');
      console.log('Error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVacancy = async () => {
    try {
      const res = await API.delete(`/vacancies/${vacancyToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('delete', res);
      fetchProfile();
    } catch (err) {
      console.error('Failed to delete vacancy:', err);
    } finally {
      setModalOpen(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="loader border-t-indigo-500 border-4 w-12 h-12 rounded-full animate-spin"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 h-32"></div>
          <div className="px-6 py-8">
            <div className="flex flex-col items-center -mt-20">
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-200 border-4 border-white shadow-lg">
                <User className="h-16 w-16 text-gray-500" />
              </div>

              <h1 className="mt-4 text-2xl font-bold text-gray-900">Hey {profile.name}</h1>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Displaying the list of vacancies */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">Your Vacancies</h2>
          {vacancies.length === 0 ? (
            <p className="mt-4 text-gray-500">You have no active vacancies.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy._id}
                  className="flex items-center w-full justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex-1">
                    <VacancyCard
                      vacancy={vacancy}
                      isExpanded={expandVacancyId === vacancy._id}
                      onToggle={() =>
                        setExpandVacancyId(
                          expandVacancyId === vacancy._id ? null : vacancy._id
                        )
                      }
                    />
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200 text-blue-700 shadow-sm" onClick={() => navigate(`/edit-vacancy/${vacancy._id}`)}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200 text-red-700 shadow-sm" onClick={() => {
                        setModalOpen(true);
                        setVacancyToDelete(vacancy._id);
                      }}
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                  {/* Confirmation Modal */}
                  <ConfirmationModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onConfirm={handleDeleteVacancy}
                  />
                </div>

              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
