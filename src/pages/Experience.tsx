import React from 'react';
import { Building2, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const colorTextClasses: Record<string, string> = {
  'blue': 'text-blue-600 dark:text-blue-400',
  'purple': 'text-purple-600 dark:text-purple-400',
  'indigo': 'text-indigo-600 dark:text-indigo-400',
  'teal': 'text-teal-600 dark:text-teal-400',
  'cyan': 'text-cyan-600 dark:text-cyan-400',
  'pink': 'text-pink-600 dark:text-pink-400'
};

const Experience: React.FC = () => {
  const { primaryColor } = useTheme();
  const textColorClass = colorTextClasses[primaryColor] || colorTextClasses.blue;

  const experiences = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech University',
      period: '2014 - Present',
      duration: '10 years',
      description: 'Leading technical initiatives and mentoring junior engineers in software development and research projects.'
    },
    {
      title: 'Software Developer',
      company: 'Engineering Institute',
      period: '2010 - 2014',
      duration: '4 years',
      description: 'Developed and maintained multiple software projects using modern technologies and best practices.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="container mx-auto px-4">
        <h1 className={`text-4xl md:text-5xl font-bold mb-12 text-center dark:text-white ${textColorClass}`}>
          Experience
        </h1>

        <div className="max-w-3xl mx-auto space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-lg transition-shadow p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold dark:text-white">{exp.title}</h2>
                  <div className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400">
                    <Building2 className="h-5 w-5" />
                    <span className="text-lg">{exp.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5" />
                  <span className={`font-semibold ${textColorClass}`}>{exp.duration}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{exp.period}</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
