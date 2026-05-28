import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const colorBgGradients: Record<string, string> = {
  'blue': 'from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950',
  'purple': 'from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950',
  'indigo': 'from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950',
  'teal': 'from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950',
  'cyan': 'from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950',
  'pink': 'from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950'
};

const colorTextClasses: Record<string, string> = {
  'blue': 'text-blue-600 dark:text-blue-400',
  'purple': 'text-purple-600 dark:text-purple-400',
  'indigo': 'text-indigo-600 dark:text-indigo-400',
  'teal': 'text-teal-600 dark:text-teal-400',
  'cyan': 'text-cyan-600 dark:text-cyan-400',
  'pink': 'text-pink-600 dark:text-pink-400'
};

const Home: React.FC = () => {
  const { primaryColor } = useTheme();
  const gradientClass = colorBgGradients[primaryColor] || colorBgGradients.blue;
  const textColorClass = colorTextClasses[primaryColor] || colorTextClasses.blue;

  return (
    <div className={`bg-gradient-to-br ${gradientClass} min-h-screen flex items-center`}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-3xl mb-8 animate-fade-in">
            <div className={`w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-lg mx-auto mb-8 flex items-center justify-center ${textColorClass}`}>
              <span className="text-4xl font-bold">JD</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              John Doe
            </h1>
            
            <p className={`text-2xl md:text-3xl font-semibold mb-4 ${textColorClass}`}>
              Software Engineer
            </p>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              Department of Engineering<br />
              Tech University
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex justify-center items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
                <span className="text-lg">john.doe@techuniversity.edu</span>
              </div>
              <div className="flex justify-center items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Phone className="h-6 w-6" />
                <span className="text-lg">+1 (555) 123-4567</span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Welcome to my professional portfolio. Explore my academic profile, research work, publications, 
              and professional development activities. I'm passionate about technology, innovation, and education.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
