/**
 * Main application logic for StudyHub
 * Handles navigation between semesters, courses, and exams
 */

import { getSemesters, getCoursesBySemester, getExams, getCourses } from './data/api.js';

class StudyHubApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.currentView = 'home';
    this.navigationStack = [];
    this.currentSemesterId = null;
    this.currentCourseId = null;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      await this.renderHome();
    } catch (error) {
      this.showError('שגיאה בטעינת האפליקציה', error);
    }
  }
  /**
   * Navigate to a new view
   */
  navigateTo(view, data = null) {
    // Special handling for navigation from courses to exams
    if (view === 'exams' && this.currentView === 'courses') {
      // When going from courses to exams, we need to store the semester ID, not the course ID
      // We'll store the current semester ID that was used to render the courses
      this.navigationStack.push({ view: this.currentView, data: this.currentSemesterId });
      this.currentCourseId = data; // Store the course ID for exam display
    } else {
      this.navigationStack.push({ view: this.currentView, data });
    }
    
    this.currentView = view;
    this.renderView(view, data);
  }

  /**
   * Go back to the previous view
   */
  goBack() {
    if (this.navigationStack.length > 0) {
      const previous = this.navigationStack.pop();
      this.currentView = previous.view;
      this.renderView(previous.view, previous.data);
    } else {
      // If no previous view, go to home
      this.currentView = 'home';
      this.renderHome();
    }
  }

  /**
   * Render the home view with semester buttons
   */
  async renderHome() {
    this.clearApp();
    
    const title = this.createTitle('StudyHub 🎓', 'text-4xl font-bold text-white mb-8 font-marmelad');
    
    const semesterGrid = document.createElement('div');
    semesterGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto';
    
    const semesters = await getSemesters();
    
    semesters.semesters.forEach(semester => {
      const button = this.createSemesterButton(semester);
      semesterGrid.appendChild(button);
    });
    
    this.appContainer.appendChild(title);
    this.appContainer.appendChild(semesterGrid);
  }

  /**
   * Render courses for a specific semester
   */
  async renderCourses(semesterId) {
    this.clearApp();
    
    try {
      const semesters = await getSemesters();
      const semester = semesters.semesters.find(s => s.id === semesterId);
      
      if (!semester) {
        this.showError('סמסטר לא נמצא', new Error(`Semester with ID ${semesterId} not found`));
        return;
      }
      
      this.currentSemesterId = semesterId; // Update current semester ID
      const title = this.createTitle(`${semester.label} 📚`, 'text-3xl font-bold text-white mb-8 font-marmelad');
      
      const coursesGrid = document.createElement('div');
      coursesGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto font-marmelad';
      
      const courses = await getCoursesBySemester(semesterId);
      
      courses.forEach(course => {
        const card = this.createCourseCard(course);
        coursesGrid.appendChild(card);
      });
      
      this.appContainer.appendChild(title);
      this.appContainer.appendChild(coursesGrid);
      this.appContainer.appendChild(this.createBackButton());
    } catch (error) {
      this.showError('שגיאה בטעינת הקורסים', error);
    }
  }

  /**
   * Render exam page for a course
   */
  async renderCourseExams(courseId) {
    this.clearApp();
    
    try {
      const courses = await getCourses();
      const course = courses.courses.find(c => c.id === courseId);
      
      if (!course) {
        this.showError('קורס לא נמצא', new Error(`Course with ID ${courseId} not found`));
        return;
      }
      
      this.currentCourseId = courseId; // Update current course ID
      const title = this.createTitle(`${course.name} 📝`, 'text-4xl font-extrabold text-white mb-8 tracking-wide text-center font-marmelad');
      
      // Load exam data
      const examData = await getExams(courseId);
      
      if (!examData || !examData.years || examData.years.length === 0) {
        // No exams available
        const noExamsDiv = this.createNoExamsMessage();
        this.appContainer.appendChild(title);
        this.appContainer.appendChild(noExamsDiv);
        this.appContainer.appendChild(this.createBackButton());
        return;
      }
      
      // Create exams container
      const examsContainer = document.createElement('div');
      examsContainer.className = 'w-full flex flex-col items-center';
      
      // Filter years that have exams
      const yearsWithExams = examData.years.filter(year => year.exams && year.exams.length > 0);
      
      if (yearsWithExams.length === 0) {
        const noExamsDiv = this.createNoExamsMessage();
        this.appContainer.appendChild(title);
        this.appContainer.appendChild(noExamsDiv);
        this.appContainer.appendChild(this.createBackButton());
        return;
      }
      
      // Create year sections
      yearsWithExams.forEach(year => {
        const yearSection = this.createYearSection(year);
        examsContainer.appendChild(yearSection);
      });
      
      this.appContainer.appendChild(title);
      this.appContainer.appendChild(examsContainer);
      this.appContainer.appendChild(this.createBackButton());
      
    } catch (error) {
      this.showError('שגיאה בטעינת המבחנים', error);
    }
  }

  /**
   * Create a semester button
   */
  createSemesterButton(semester) {
    const button = document.createElement('button');
    button.className = 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-2xl font-bold py-16 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-400 hover:border-blue-300 font-marmelad';
    button.style.fontFamily = "'Marmelad', sans-serif !important";
    button.textContent = semester.label;
    
    button.addEventListener('click', () => {
      this.navigateTo('courses', semester.id);
    });
    
    return button;
  }

  /**
   * Create a course card
   */
  createCourseCard(course) {
    const card = document.createElement('button');
    card.className = 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 py-12 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-600 hover:border-blue-500 text-center font-marmelad';
    
    // Create course name with clean, prominent white text
    const courseName = document.createElement('div');
    courseName.className = 'text-2xl font-black text-white tracking-wide leading-relaxed font-marmelad';
    courseName.style.fontFamily = "'Marmelad', sans-serif !important";
    courseName.textContent = course.name;
    
    card.appendChild(courseName);
    
    card.addEventListener('click', () => {
      // Store the current semester ID in the navigation stack, not the course ID
      this.navigateTo('exams', course.id);
    });
    
    return card;
  }

  /**
   * Create a back button
   */
  createBackButton() {
    const button = document.createElement('button');
    button.className = 'bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-8 font-marmelad';
    button.style.fontFamily = "'Marmelad', sans-serif !important";
    button.textContent = '↩ חזרה';
    
    button.addEventListener('click', () => {
      this.goBack();
    });
    
    return button;
  }

  /**
   * Create a title element
   */
  createTitle(text, classes = 'text-2xl font-bold text-white mb-6') {
    const title = document.createElement('h1');
    title.className = classes;
    title.style.fontFamily = "'Marmelad', sans-serif !important";
    title.textContent = text;
    return title;
  }

  /**
   * Clear the app container
   */
  clearApp() {
    if (this.appContainer) {
      this.appContainer.innerHTML = '';
    }
  }

  /**
   * Render a specific view
   */
  renderView(view, data) {
    switch (view) {
      case 'home':
        this.renderHome();
        break;
      case 'courses':
        this.renderCourses(data);
        break;
      case 'exams':
        this.renderCourseExams(data);
        break;
      default:
        this.showError('שגיאה: תצוגה לא ידועה');
    }
  }

  /**
   * Show error message
   */
  showError(message, error = null) {
    this.clearApp();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-900 border border-red-700 text-red-100 px-6 py-4 rounded-lg max-w-2xl mx-auto';
    
    const errorTitle = document.createElement('h2');
    errorTitle.className = 'text-xl font-bold mb-2 font-marmelad';
    errorTitle.style.fontFamily = "'Marmelad', sans-serif !important";
    errorTitle.textContent = message;
    
    errorDiv.appendChild(errorTitle);
    
    if (error) {
      const errorDetails = document.createElement('p');
      errorDetails.className = 'text-red-300 text-sm font-marmelad';
      errorDetails.style.fontFamily = "'Marmelad', sans-serif !important";
      errorDetails.textContent = error.message || String(error);
      errorDiv.appendChild(errorDetails);
    }
    
    this.appContainer.appendChild(errorDiv);
    
    const backButton = this.createBackButton();
    this.appContainer.appendChild(backButton);
  }

  /**
   * Create a year section for exams
   */
  createYearSection(year) {
    const yearSection = document.createElement('div');
    yearSection.className = 'mb-8 flex justify-center';
    
    // Exams grid (centered with max-width for 2 cards)
    const examsGrid = document.createElement('div');
    examsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl';
    
    year.exams.forEach(exam => {
      const examCard = this.createExamCard(exam, year.year);
      examsGrid.appendChild(examCard);
    });
    
    yearSection.appendChild(examsGrid);
    return yearSection;
  }
  
  /**
   * Create an exam card
   */
  createExamCard(exam, year) {
    const card = document.createElement('div');
    card.className = 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:border-blue-500 font-marmelad';
    
    // Year display (replaces the paper emoji)
    const yearDisplay = document.createElement('div');
    yearDisplay.className = 'text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-marmelad';
    yearDisplay.style.fontFamily = "'Marmelad', sans-serif !important";
    yearDisplay.textContent = year;
    card.appendChild(yearDisplay);
    
    // Exam title
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-white mb-3 text-center font-marmelad';
    title.style.fontFamily = "'Marmelad', sans-serif !important";
    title.textContent = exam.name || exam.title; // Use 'name' property from JSON
    card.appendChild(title);
    
    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg font-marmelad';
    downloadBtn.style.fontFamily = "'Marmelad', sans-serif !important";
    downloadBtn.innerHTML = 'פתיחה';
    
    downloadBtn.addEventListener('click', () => {
      // Fix the file path - use the correct property and path
      const fileName = exam.pdf || exam.file; // Use 'pdf' property from JSON
      if (fileName) {
        const pdfUrl = `data/exams/${this.currentCourseId}/${fileName.split('/').pop()}`; // Extract just the filename
        window.open(pdfUrl, '_blank');
      } else {
        console.error('No file path found for exam:', exam);
      }
    });
    
    card.appendChild(downloadBtn);
    
    return card;
  }
  
  /**
   * Create a no-exams message
   */
  createNoExamsMessage() {
    const noExamsDiv = document.createElement('div');
    noExamsDiv.className = 'bg-gray-800 rounded-lg p-8 text-center max-w-2xl mx-auto';
    
    const icon = document.createElement('div');
    icon.className = 'text-6xl mb-4';
    icon.textContent = '📚';
    noExamsDiv.appendChild(icon);
    
    const message = document.createElement('p');
    message.className = 'text-gray-300 text-lg mb-4 font-marmelad';
    message.style.fontFamily = "'Marmelad', sans-serif !important";
    message.textContent = 'אין מבחנים זמינים כרגע';
    noExamsDiv.appendChild(message);
    
    const subMessage = document.createElement('p');
    subMessage.className = 'text-gray-500 font-marmelad';
    subMessage.style.fontFamily = "'Marmelad', sans-serif !important";
    subMessage.textContent = 'המבחנים יועלו בקרוב!';
    noExamsDiv.appendChild(subMessage);
    
    return noExamsDiv;
  }
  
  /**
   * Get the current course ID from the URL or navigation
   */
  getCurrentCourseId() {
    return this.currentCourseId;
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new StudyHubApp();
});
