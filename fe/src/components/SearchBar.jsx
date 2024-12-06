import { Search } from 'lucide-react';


export const SearchBar = ({ onSearch }) => {
  return (
    <div className="relative w-full max-w-3xl">
      <input
        type="text"
        name='search'
        placeholder="Search by name, city, postcode..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 pl-10 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}