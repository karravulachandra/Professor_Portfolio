import React from 'react';
import { Bookmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const colorTextClasses: Record<string, string> = {
  'blue': 'text-blue-600 dark:text-blue-400',
  'purple': 'text-purple-600 dark:text-purple-400',
  'indigo': 'text-indigo-600 dark:text-indigo-400',
  'teal': 'text-teal-600 dark:text-teal-400',
  'cyan': 'text-cyan-600 dark:text-cyan-400',
  'pink': 'text-pink-600 dark:text-pink-400'
};

const Patents: React.FC = () => {
  const { primaryColor } = useTheme();
  const textColorClass = colorTextClasses[primaryColor] || colorTextClasses.blue;

  const patents = [
    {
      title: 'Artificial Intelligence (AI) Driven Personal Assistant with Multi-Platform Integration',
      type: 'Indian Patent',
      filingDate: '29.08.2023',
      publicationDate: '08.09.2023',
      applicationNumber: '202341057851 A'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <Bookmark className={`h-8 w-8 ${textColorClass}`} />
          <h1 className={`text-4xl md:text-5xl font-bold dark:text-white ${textColorClass}`}>
            Patents
          </h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {patents.map((patent, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-bold dark:text-white mb-4">{patent.title}</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <span className={`font-semibold min-w-fit ${textColorClass}`}>Type:</span>
                  <span className="text-gray-600 dark:text-gray-400">{patent.type}</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className={`font-semibold min-w-fit ${textColorClass}`}>Filing Date:</span>
                  <span className="text-gray-600 dark:text-gray-400">{patent.filingDate}</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className={`font-semibold min-w-fit ${textColorClass}`}>Publication Date:</span>
                  <span className="text-gray-600 dark:text-gray-400">{patent.publicationDate}</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className={`font-semibold min-w-fit ${textColorClass}`}>Application #:</span>
                  <span className="text-gray-600 dark:text-gray-400">{patent.applicationNumber}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {patents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No patents found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patents;
