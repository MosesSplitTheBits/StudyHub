/**
 * Data Access Layer for StudyHub
 * Handles loading of courses, semesters, and exam data
 */

/**
 * Fetch JSON data from a given path
 * @param {string} jsonPath - Path to JSON file
 * @returns {Promise<Object>} Parsed JSON data
 */
async function fetchJson(jsonPath) {
  const absolutePath = jsonPath.startsWith('/') ? jsonPath : `/${jsonPath}`;
  const response = await fetch(absolutePath, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${jsonPath}: ${response.status}`);
  }
  return response.json();
}

/**
 * Get all semesters
 * @returns {Promise<Object>} Semesters data
 */
export async function getSemesters() {
  return await fetchJson('/data/semesters.json');
}

/**
 * Get all courses
 * @returns {Promise<Object>} Courses data
 */
export async function getCourses() {
  return await fetchJson('/data/courses.json');
}

/**
 * Get courses for a specific semester
 * @param {string} semesterId - Semester ID (e.g., "2025-a")
 * @returns {Promise<Array>} Array of courses for the semester
 */
export async function getCoursesBySemester(semesterId) {
  const coursesData = await getCourses();
  return coursesData.courses.filter(course => course.semesterId === semesterId);
}

/**
 * Get exams for a specific course
 * @param {string} courseId - Course ID
 * @returns {Promise<Array>} Array of exams for the course
 */
export async function getExams(courseId) {
  try {
    return await fetchJson(`/data/exams/${courseId}/index.json`);
  } catch (error) {
    // Return empty array if no exams exist yet
    return { courseId, exams: [] };
  }
}

/**
 * Save exam results to localStorage
 * @param {Object} result - Result object with examId and answers
 */
export function saveResult({ examId, answers }) {
  const key = `exam_result_${examId}`;
  localStorage.setItem(key, JSON.stringify({
    examId,
    answers,
    timestamp: Date.now()
  }));
}

/**
 * Load exam results from localStorage
 * @param {string} examId - Exam ID
 * @returns {Object|null} Saved result or null if not found
 */
export function loadResult(examId) {
  const key = `exam_result_${examId}`;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
}
