/**
 * Main application logic for StudyHub
 * Handles navigation between semesters, courses, and exams
 */

import { getSemesters, getCoursesBySemester, getExams } from './data/api.js';

class StudyHubApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.currentView = 'home';
    this.navigationStack = [];
    
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
    this.navigationStack.push({ view: this.currentView, data });
    this.currentView = view;
    this.renderView(view, data);
  }

  /**
   * Go back to previous view
   */
  goBack() {
    if (this.navigationStack.length > 0) {
      const previous = this.navigationStack.pop();
      this.currentView = previous.view;
      this.renderView(previous.view, previous.data);
    }
  }

  /**
   * Render the home view with semester buttons
   */
  async renderHome() {
    this.clearApp();
    
    const title = this.createTitle('StudyHub 🎓', 'text-4xl font-bold text-white mb-8');
    
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
    
    const semesters = await getSemesters();
    const semester = semesters.semesters.find(s => s.id === semesterId);
    
    const title = this.createTitle(`${semester.label} 📚`, 'text-3xl font-bold text-white mb-8');
    
    const coursesGrid = document.createElement('div');
    coursesGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto';
    
    const courses = await getCoursesBySemester(semesterId);
    
    courses.forEach(course => {
      const card = this.createCourseCard(course);
      coursesGrid.appendChild(card);
    });
    
    this.appContainer.appendChild(title);
    this.appContainer.appendChild(coursesGrid);
    this.appContainer.appendChild(this.createBackButton());
  }

  /**
   * Render placeholder exam page for a course
   */
  async renderCourseExams(courseId) {
    this.clearApp();
    
    const courses = await getCourses();
    const course = courses.courses.find(c => c.id === courseId);
    
    const title = this.createTitle(`${course.name} 📝`, 'text-3xl font-bold text-white mb-8');
    
    const placeholder = document.createElement('div');
    placeholder.className = 'bg-gray-800 rounded-lg p-8 text-center max-w-2xl mx-auto';
    
    const placeholderIcon = document.createElement('div');
    placeholderIcon.className = 'text-6xl mb-4';
    placeholderIcon.textContent = '📚';
    
    const placeholderText = document.createElement('p');
    placeholderText.className = 'text-gray-300 text-lg mb-4';
    placeholderText.textContent = 'המבחנים יועלו בקרוב!';
    
    const placeholderSubtext = document.createElement('p');
    placeholderSubtext.className = 'text-gray-500';
    placeholderSubtext.textContent = 'בינתיים, תוכלו לחזור לקורסים או לבחור קורס אחר';
    
    placeholder.appendChild(placeholderIcon);
    placeholder.appendChild(placeholderText);
    placeholder.appendChild(placeholderSubtext);
    
    this.appContainer.appendChild(title);
    this.appContainer.appendChild(placeholder);
    this.appContainer.appendChild(this.createBackButton());
  }

  /**
   * Create a semester button
   */
  createSemesterButton(semester) {
    const button = document.createElement('button');
    button.className = 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-2xl font-bold py-16 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-400 hover:border-blue-300';
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
    card.className = 'bg-gray-800 hover:bg-gray-700 text-white text-xl font-semibold py-12 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-600 hover:border-gray-500 text-center';
    card.textContent = course.name;
    
    card.addEventListener('click', () => {
      this.navigateTo('exams', course.id);
    });
    
    return card;
  }

  /**
   * Create a back button
   */
  createBackButton() {
    const button = document.createElement('button');
    button.className = 'bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mt-8';
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
    errorTitle.className = 'text-xl font-bold mb-2';
    errorTitle.textContent = message;
    
    errorDiv.appendChild(errorTitle);
    
    if (error) {
      const errorDetails = document.createElement('p');
      errorDetails.className = 'text-red-300 text-sm';
      errorDetails.textContent = error.message || String(error);
      errorDiv.appendChild(errorDetails);
    }
    
    this.appContainer.appendChild(errorDiv);
    
    const backButton = this.createBackButton();
    this.appContainer.appendChild(backButton);
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new StudyHubApp();
});
