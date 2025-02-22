import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  ChevronUp,
  Moon,
  Sun,
  GraduationCap,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Award,
  FileText,
  Presentation,
  ScrollText,
  Bookmark,
  Database,
  Code,
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);

      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
          <div className="relative h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="absolute h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="#home" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold dark:text-white">Hymavathi</span>
              </a>
              
              <div className="hidden md:flex items-center space-x-8">
                <NavLinks activeSection={activeSection} />
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 dark:text-white" />
                ) : (
                  <Menu className="h-6 w-6 dark:text-white" />
                )}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
              <div className="px-4 py-2 space-y-2">
                <MobileNavLinks activeSection={activeSection} setIsMenuOpen={setIsMenuOpen} />
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="pt-16">
          {/* Hero Section */}
          <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800" />
            <div className="container mx-auto px-4 py-16 relative">
              <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
                    T. Hymavathi
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                    Assistant Professor
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    Department of Computer Applications<br />
                    RVR & JC College of Engineering
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-center items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Mail className="h-5 w-5" />
                      <span>th@rvrjc.ac.in</span>
                    </div>
                    <div className="flex justify-center items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Phone className="h-5 w-5" />
                      <span>+91 8632288254</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Section */}
          <section id="profile" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Academic Profile</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold dark:text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Education
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-medium dark:text-white">Ph.D (Pursuing)</p>
                      <p className="text-gray-600 dark:text-gray-400">Acharya Nagarjuna University</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-medium dark:text-white">MCA</p>
                      <p className="text-gray-600 dark:text-gray-400">G.V.R & S College</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-medium dark:text-white">Degree</p>
                      <p className="text-gray-600 dark:text-gray-400">Abhyudaya Mahila College</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold dark:text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Research Interests
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Data Mining
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Software Engineering
                    </li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold dark:text-white mt-8 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    Professional Memberships
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• IAENG</li>
                    <li>• SDIWC</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white flex items-center justify-center gap-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                Experience
              </h2>
              <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                <p className="text-lg dark:text-white">
                  <span className="font-semibold">17 years 5 months</span> at <span className="font-semibold">RVR&amp;JC College of Engineering</span>
                </p>
              </div>
            </div>
          </section>

          {/* Publications Section */}
          <section id="publications" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white flex items-center justify-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                Publications
              </h2>
              <div className="space-y-6 max-w-4xl mx-auto">
                {publications.map((pub, index) => (
                  <Publication key={index} {...pub} />
                ))}
              </div>
            </div>
          </section>

          {/* Workshops Section */}
          <section id="workshops" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white flex items-center justify-center gap-2">
                <Presentation className="h-8 w-8 text-blue-600" />
                Workshops & Conferences
              </h2>
              <div className="space-y-6 max-w-4xl mx-auto">
                {workshops.map((workshop, index) => (
                  <Workshop key={index} {...workshop} />
                ))}
              </div>
            </div>
          </section>

          {/* STTP Section */}
          <section id="sttp" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white flex items-center justify-center gap-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                STTPs & FDPs Attended
              </h2>
              <div className="space-y-6 max-w-4xl mx-auto">
                {sttp.map((item, index) => (
                  <STTP key={index} {...item} />
                ))}
              </div>
            </div>
          </section>

          {/* Courses Section */}
          <section id="courses" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white flex items-center justify-center gap-2">
                <Code className="h-8 w-8 text-blue-600" />
                Courses Completed
              </h2>
              <div className="space-y-6 max-w-4xl mx-auto">
                {courses.map((course, index) => (
                  <Course key={index} {...course} />
                ))}
              </div>
            </div>
          </section>

          {/* Patents Section */}
          <section id="patents" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white flex items-center justify-center gap-2">
                <Bookmark className="h-8 w-8 text-blue-600" />
                Patents
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">
                    Artificial Intelligence (AI) Driven Personal Assistant with Multi-Platform Integration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Indian Patent<br />
                    Filing date: 29.08.2023<br />
                    Publication date: 08.09.2023<br />
                    Application number: 202341057851 A
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white flex items-center justify-center gap-2">
                <ScrollText className="h-8 w-8 text-blue-600" />
                Funded Projects
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">
                    Novel algorithms for microarray gene clustering in association with breast cancer
                  </h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p>Funding Amount: Rs. 30,000</p>
                    <p>Funding Agency: RVRJCCE</p>
                    <p>Academic Year: 2019-20</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Committee Memberships Section */}
          <section id="committees" className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white flex items-center justify-center gap-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                Committee Memberships
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  {committees.map((committee, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-400">{committee}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

const publications = [
  {
    title: "Prediction of the Most Influenced Gene in the Development of Breast Cancer Using the DELSTM Model",
    journal: "Ingénierie des Systèmes d'Information",
    year: "2025",
    authors: "Hymavathi Thottathyl, Kanadam Karteeka Pavan",
    details: "Vol. 30, No. 1, pp. 279-286 (SCOPUS)"
  },
  {
    title: "Enhancing Cyber Attack Detection in Network Traffic Using Adaptive Regression Techniques",
    journal: "Journal of Theoretical and Applied Information Technology",
    year: "2024",
    authors: "Talluri.Sunil Kumar, P. Jyothi, Rajesh Kumar Verma, et al.",
    details: "Vol. 102, No. 23, pp. 8655-8664 (SCOPUS)"
  },
  {
    title: "Differential Evolution Model for Identification of Most Influenced Gene in Brest Cancer Data",
    journal: "Ingénierie des Systèmes d'Information",
    year: "2022",
    authors: "Hymavathi Thottathyl, Kanadam Karteeka Pavan",
    details: "Vol. 27, No. 3, pp. 487-493 (SCOPUS)"
  },
  {
    title: "Microarray Breast Cancer Data Clustering Using Map Reduce Based K-Means Algorithm",
    journal: "Revue d'Intelligence Artificielle",
    year: "2020",
    authors: "Hymavathi Thottathyl, Kanadam Karteeka Pavan, Rajeev Priyatam Panchadula",
    details: "Vol. 34, No. 6, pp. 763-769 (SCOPUS)"
  }
];

const workshops = [
  {
    title: "Women Entrepreneurship Development Program",
    organizer: "Department of Science and Technology, Govt.of India",
    duration: "Three weeks",
    date: "21 Aug.- 8 Sep. 2023"
  },
  {
    title: "Cloud Infrastructure (AWS)",
    organizer: "Brainovision solutions India Pvt. Ltd., in collaboration with AICTE",
    duration: "One week",
    date: "21-25 August, 2023"
  },
  {
    title: "Advances in Cloud Computing",
    organizer: "Dept. of CSE, ANU College of Sciences, Acharya Nagarjuna University",
    duration: "Two days",
    date: "3-4 Feb, 2023"
  },
  {
    title: "Recent Trends in Web Application Development for Industry 4.0",
    organizer: "Dept. of IT, GMR Institute of Technology-Rajam & Dept. of CSE, Andhra University College of Engineering – Visakhapatnam",
    duration: "One week",
    date: "October 18-22, 2022"
  },
  {
    title: "Pedagogy for Online and Blended Teaching-Learning Process",
    organizer: "IIT Bombay",
    duration: "One month",
    date: "September 14, 2017 - October 12, 2017"
  },
  {
    title: "Foundation Program in ICT for Education",
    organizer: "IIT Bombay",
    duration: "One month",
    date: "August 3, 2017 - September 7, 2017"
  },
  {
    title: "Introduction to R Programming",
    organizer: "Dept. of CSE, RVRJCCE & ICT Academy",
    duration: "Two days",
    date: "August 16-17, 2017"
  },
  {
    title: "Artificial Neural Network & Fuzzy Logic through ICT",
    organizer: "Dept. of CSE, RVRJCCE & NITTTR Chandigarh",
    duration: "One week",
    date: "April 24-28, 2017"
  },
  {
    title: "Multimedia Tools and Utilities through ICT",
    organizer: "Dept. of CSE, RVRJCCE & NITTTR Chandigarh",
    duration: "One week",
    date: "March 27-31, 2017"
  },
  {
    title: "Applications of Computational Techniques in Engineering",
    organizer: "Dept. of Chemical Engineering, RVR & JC",
    duration: "Two days",
    date: "November 6-7, 2015"
  },
  {
    title: "Knowledge Engineering",
    organizer: "Dept. of Computer Applications, Prasad V. Potluri Siddhartha Institute of Technology, Kanuru, Vijayawada",
    duration: "Two days",
    date: "April 10-11, 2015"
  },
  {
    title: "Big Data Analytics",
    organizer: "Dept. of Computer Science & Engineering, University College of Engineering & Technology, Acharya Nagarjuna University, Guntur",
    duration: "Two days",
    date: "December 9-10, 2014"
  },
  {
    title: "BIG DATA ANALYTICS",
    organizer: "Dept. of Computer Science and Engineering, R.V.R & J.C College of Engineering, Guntur",
    duration: "Two days",
    date: "April 17-18, 2013"
  },
  {
    title: "Wireless Lab",
    organizer: "M/s. Shell Networks, Hyderabad",
    duration: "Three days",
    date: "December 27-29, 2010"
  }
];

const sttp = [
  {
    title: "Introductory Data Science and Deep Learning",
    organizer: "International Institute of Information Technology, Naya Raipur",
    duration: "Five days",
    date: "16-20 July, 2021"
  },
  {
    title: "Data Science",
    organizer: "Indian Institute of Information Technology, Kottayam",
    duration: "Five days",
    date: "28 July - 1 Aug, 2021"
  },
  {
    title: "Emerging Trends and Technologies in Data Science",
    organizer: "Department of CSE, GMR Institute of Technology, Rajam",
    duration: "One week",
    date: "24-29 Aug, 2020"
  },
  {
    title: "Writing and Publishing High Impact Research Publications and Scientific Documents",
    organizer: "Department of Information Technology, Rajya Lakshmi Engineering College",
    duration: "Six days (AICTE Phase-III STTP)",
    date: "19-24 Oct, 2020"
  },
  {
    title: "RDBMS PostgreSQL",
    organizer: "School of Computer Science and Engineering, Vellore Institute of Technology, Chennai",
    duration: "Two days",
    date: "9-10 May, 2020"
  },
  {
    title: "Artificial Intelligence and Deep Learning",
    organizer: "LeadingIndia.ai, Bennett University (held at RVRJCCE)",
    duration: "Two days",
    date: "23-24 Feb, 2019"
  },
  {
    title: "Advanced Logical Learning and Analytical Mining in Cognitive Science",
    organizer: "Institute of Bioinformatics and Computational Biology (IBCB), Andhra University, Visakhapatnam",
    duration: "One day (6th International Conference)",
    date: "28 Dec, 2019"
  },
  {
    title: "Writing and Publishing High Impact Research Publications and Scientific Documents",
    organizer: "Department of Information Technology, Rajalakshmi Engineering College",
    duration: "Six days (AICTE Sponsored Phase-III STTP)",
    date: "19-24 October, 2020"
  },
  {
    title: "Emerging Trends & Technologies in Data Science",
    organizer: "Department of Computer Science and Engineering, GMR Institute of Technology, Rajam",
    duration: "One week (International FDP)",
    date: "24-29 Aug, 2020"
  }
];

const courses = [
  {
    title: "What is Data Science?",
    platform: "Coursera",
    date: "May 04, 2024"
  },
  {
    title: ".Net Full Stack",
    platform: "Digital Skill Readiness Program Wipro Certified Faculty",
    date: "February 09, 2024"
  },
  {
    title: ".NET Full Stack",
    platform: "Wipro Talent Next",
    date: "Nov 27 - Dec 15, 2023"
  }
];

const committees = [
  "Member of Board of Studies, Department of CA, RVR&JCCE",
  "Member, Academic Audit Council, Department of CA, RVR&JCCE",
  "Member, ISO, Department of CA, RVR&JCCE",
  "Member, Newsletter, Department of CA, RVR&JCCE"
];

function NavLinks({ activeSection }) {
  // Updated navigation array with 'experience' and 'sttp' in lowercase
  const sections = [
    'home',
    'profile',
    'experience',
    'publications',
    'workshops',
    'sttp',
    'courses',
    'patents',
    'projects',
    'committees'
  ];
  
  return (
    <>
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          className={`text-sm font-medium hover:text-blue-600 transition-colors ${
            activeSection === section
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </a>
      ))}
    </>
  );
}

function MobileNavLinks({ activeSection, setIsMenuOpen }) {
  // Updated navigation array with 'experience' and 'sttp' in lowercase
  const sections = [
    'home',
    'profile',
    'experience',
    'publications',
    'workshops',
    'sttp',
    'courses',
    'patents',
    'projects',
    'committees'
  ];
  
  return (
    <>
      {sections.map((section) => (
        <a
          key={section}
          href={`#${section}`}
          onClick={() => setIsMenuOpen(false)}
          className={`block py-2 text-sm font-medium hover:text-blue-600 transition-colors ${
            activeSection === section
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </a>
      ))}
    </>
  );
}

function Publication({ title, journal, year, authors, details }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{authors}</p>
      <p className="text-gray-500 dark:text-gray-500">
        {journal}, {year}
      </p>
      <p className="text-gray-500 dark:text-gray-500 mt-1">{details}</p>
    </div>
  );
}

function Workshop({ title, organizer, duration, date }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{organizer}</p>
      <p className="text-gray-500 dark:text-gray-500">
        {duration} • {date}
      </p>
    </div>
  );
}

function STTP({ title, organizer, duration, date }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{organizer}</p>
      <p className="text-gray-500 dark:text-gray-400">
        {duration} • {date}
      </p>
    </div>
  );
}

function Course({ title, platform, date }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{platform}</p>
      <p className="text-gray-500 dark:text-gray-500">{date}</p>
    </div>
  );
}

export default App;
