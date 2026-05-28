import React from 'react';
import { BookOpen, Database, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const colorTextClasses: Record<string, string> = {
  'blue': 'text-blue-600 dark:text-blue-400',
  'purple': 'text-purple-600 dark:text-purple-400',
  'indigo': 'text-indigo-600 dark:text-indigo-400',
  'teal': 'text-teal-600 dark:text-teal-400',
  'cyan': 'text-cyan-600 dark:text-cyan-400',
  'pink': 'text-pink-600 dark:text-pink-400'
};

const Profile: React.FC = () => {
  const { primaryColor } = useTheme();
  const textColorClass = colorTextClasses[primaryColor] || colorTextClasses.blue;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className={`text-4xl md:text-5xl font-bold mb-12 text-center dark:text-white ${textColorClass}`}>
          Academic Profile
        </h1>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Education */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className={`h-6 w-6 ${textColorClass}`} />
              <h2 className="text-2xl font-semibold dark:text-white">Education</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <p className="font-semibold text-lg dark:text-white mb-2">Ph.D (Pursuing)</p>
                <p className="text-gray-600 dark:text-gray-400">Tech University</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <p className="font-semibold text-lg dark:text-white mb-2">M.Tech</p>
                <p className="text-gray-600 dark:text-gray-400">Engineering Institute</p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-shadow">
                <p className="font-semibold text-lg dark:text-white mb-2">Bachelor's Degree</p>
                <p className="text-gray-600 dark:text-gray-400">University College</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Research Interests */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Database className={`h-6 w-6 ${textColorClass}`} />
                <h2 className="text-2xl font-semibold dark:text-white">Research Interests</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  'Data Mining & Machine Learning',
                  'Software Engineering',
                  'Cloud Computing',
                  'Artificial Intelligence'
                ].map((interest, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`w-2 h-2 ${textColorClass.split(' ')[0]} rounded-full flex-shrink-0`}></div>
                    <span className="text-gray-700 dark:text-gray-300">{interest}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Memberships */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Award className={`h-6 w-6 ${textColorClass}`} />
                <h2 className="text-2xl font-semibold dark:text-white">Professional Memberships</h2>
              </div>
              
              <div className="space-y-3">
                {['IAENG', 'SDIWC', 'IEEE', 'ACM'].map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className={`w-2 h-2 ${textColorClass.split(' ')[0]} rounded-full flex-shrink-0`}></div>
                    <span className="text-gray-700 dark:text-gray-300">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
