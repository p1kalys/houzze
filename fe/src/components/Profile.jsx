import { useEffect, useState } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import API from '../api';
import { VacancyCard } from './VacancyCard';

export const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vacancies, setVacancies] = useState([]);
  const [expandVacancyId, setExpandVacancyId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/users/account', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(response.data.user);
        setVacancies(response.data.vacancies);
        console.log(response.data.user);
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
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
                <VacancyCard
                key={vacancy._id}
                vacancy={vacancy}
                isExpanded={expandVacancyId === vacancy._id}
                onToggle={() => setExpandVacancyId(
                  expandVacancyId === vacancy._id ? null : vacancy._id
                )}
              />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
