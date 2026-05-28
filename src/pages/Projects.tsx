import React from 'react';
import { ScrollText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const colorTextClasses: Record<string, string> = {
  'blue': 'text-blue-600 dark:text-blue-400',
  'purple': 'text-purple-600 dark:text-purple-400',
  'indigo': 'text-indigo-600 dark:text-indigo-400',
  'teal': 'text-teal-600 dark:text-teal-400',
  'cyan': 'text-cyan-600 dark:text-cyan-400',
  'pink': 'text-pink-600 dark:text-pink-400'
};

const Projects: React.FC = () => {
  const { primaryColor } = useTheme();
  const textColorClass = colorTextClasses[primaryColor] || colorTextClasses.blue;

  const projects = [
    {
      title: 'Novel algorithms for microarray gene clustering in association with breast cancer',
      fundingAmount: 'Rs. 30,000',
      fundingAgency: 'Tech University',
      academicYear: '2019-20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-12">
          <ScrollText className={`h-8 w-8 ${textColorClass}`} />
          <h1 className={`text-4xl md:text-5xl font-bold dark:text-white ${textColorClass}`}>
            Funded Projects
          </h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-bold dark:text-white mb-6">{project.title}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className={`font-semibold min-w-fit ${textColorClass}`}>Funding Amount:</span>
                  <span className="text-gray-600 dark:text-gray-400">{project.fundingAmount}</span>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className={`font-semibold min-w-fit ${textColorClass}`}>Funding Agency:</span>
                  <span className="text-gray-600 dark:text-gray-400">{project.fundingAgency}</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className={`font-semibold min-w-fit ${textColorClass}`}>Academic Year:</span>
                  <span className="text-gray-600 dark:text-gray-400">{project.academicYear}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
