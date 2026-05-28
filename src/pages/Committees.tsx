import React from 'react';
import { Building2 } from 'lucide-react';
import { committees } from '../data/portfolioData';
import { useTheme } from '../context/ThemeContext';

const colorTextClasses: Record<string, string> = {
  'blue': 'text-blue-600 dark:text-blue-400',
  'purple': 'text-purple-600 dark:text-purple-400',
  'indigo': 'text-indigo-600 dark:text-indigo-400',
  'teal': 'text-teal-600 dark:text-teal-400',
  'cyan': 'text-cyan-600 dark:text-cyan-400',
  'pink': 'text-pink-600 dark:text-pink-400'
};

const Committees: React.FC = () => {
  const { primaryColor } = useTheme();
  const textColorClass = colorTextClasses[primaryColor] || colorTextClasses.blue;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Building2 className={`h-8 w-8 ${textColorClass}`} />
          <h1 className={`text-4xl md:text-5xl font-bold dark:text-white ${textColorClass}`}>
            Committee Memberships
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {committees.map((committee, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-transparent hover:border-current"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{committee}</p>
              </div>
            ))}
          </div>
        </div>

        {committees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No committee memberships found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Committees;
