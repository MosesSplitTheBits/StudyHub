// SPA logic for Exams Database MVP
// Renders: courses → years → exams using JSON files under data/exams/

(function () {
  const appContainer = document.getElementById('app');

  /**
   * Navigation stack to enable going back without reloading
   * Each entry: { view: 'courses'|'years'|'exams', payload?: any }
   */
  const viewStack = [];

  function goBack() {
    if (viewStack.length > 1) {
      viewStack.pop();
      const previous = viewStack[viewStack.length - 1];
      renderView(previous.view, previous.payload, false);
    }
  }

  async function fetchJson(jsonPath) {
    const absolutePath = jsonPath.startsWith('/') ? jsonPath : `/${jsonPath}`;
    const response = await fetch(absolutePath, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load ${jsonPath}: ${response.status}`);
    }
    return response.json();
  }

  function clearApp() {
    if (appContainer) {
      appContainer.innerHTML = '';
    }
  }

  function createTitle(text) {
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = text;
    return title;
  }

  function createGrid() {
    const grid = document.createElement('div');
    grid.className = 'grid';
    return grid;
  }

  function createCard(label) {
    const button = document.createElement('button');
    button.className = 'card';
    button.type = 'button';
    button.textContent = label;
    return button;
  }

  function createExamLink(label, href) {
    const link = document.createElement('a');
    link.className = 'exam-link';
    link.textContent = label;
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function renderSemesters(coursesIndex) {
    clearApp();

    const title = createTitle('הקורסים שלי');
    const grid = document.createElement('div');
    grid.className = 'semester-grid';

    const semAButton = createCard('סמסטר א');
    semAButton.classList.add('semester-card');
    semAButton.addEventListener('click', () => {
      renderView('courses', { list: coursesIndex.semesterA, heading: 'הקורסים שלי · סמסטר א' });
    });

    const semBButton = createCard('סמסטר ב');
    semBButton.classList.add('semester-card');
    semBButton.addEventListener('click', () => {
      renderView('courses', { list: coursesIndex.semesterB, heading: 'הקורסים שלי · סמסטר ב' });
    });

    grid.appendChild(semAButton);
    grid.appendChild(semBButton);

    appContainer.appendChild(title);
    appContainer.appendChild(grid);
  }

  function renderCourses(payload) {
    const { list, heading } = payload;
    clearApp();

    const title = createTitle(heading || 'הקורסים שלי');
    const grid = document.createElement('div');
    grid.className = 'course-grid';

    list.forEach((course) => {
      const card = createCard(course.name);
      card.addEventListener('click', async () => {
        try {
          if (course.path) {
            const courseData = await fetchJson(course.path);
            renderView('years', { course: courseData });
            return;
          }
          showError(new Error('Course has no path'));
        } catch (error) {
          showError(error);
        }
      });
      grid.appendChild(card);
    });

    appContainer.appendChild(title);
    appContainer.appendChild(grid);
    appContainer.appendChild(createBackButton());
  }

  function renderYears(payload) {
    const { course } = payload;
    clearApp();

    const title = createTitle(`${course.name} — מבחנים`);
    const grid = document.createElement('div');
    grid.className = 'year-grid';

    course.years.forEach((yearObj) => {
      const card = createCard(String(yearObj.year));
      card.addEventListener('click', () => {
        renderView('exams', { course, year: yearObj });
      });
      grid.appendChild(card);
    });

    appContainer.appendChild(title);
    appContainer.appendChild(grid);
    appContainer.appendChild(createBackButton());
  }

  function renderExams(payload) {
    const { course, year } = payload;
    clearApp();

    const title = createTitle(`${course.name} · ${year.year}`);
    appContainer.appendChild(title);

    const list = document.createElement('div');
    list.className = 'exam-list';

    year.exams.forEach((exam) => {
      const item = document.createElement('div');
      item.className = 'exam-item';
      const link = createExamLink(exam.name, exam.pdf);
      item.appendChild(link);
      list.appendChild(item);
    });

    appContainer.appendChild(list);
    appContainer.appendChild(createBackButton());
  }

  function showError(error) {
    clearApp();
    const msg = document.createElement('div');
    msg.className = 'error-box';
    msg.textContent = `Error: ${error.message || String(error)}`;
    appContainer.appendChild(msg);
  }

  function renderView(view, payload, pushToStack = true) {
    if (pushToStack) {
      viewStack.push({ view, payload });
    }
    switch (view) {
      case 'semesters':
        renderSemesters(payload);
        break;
      case 'courses':
        renderCourses(payload);
        break;
      case 'years':
        renderYears(payload);
        break;
      case 'exams':
        renderExams(payload);
        break;
      default:
        showError(new Error('Unknown view'));
    }
  }

  function createBackButton() {
    const btn = document.createElement('button');
    btn.className = 'back-btn';
    btn.type = 'button';
    btn.textContent = '↩ חזרה';
    btn.addEventListener('click', goBack);
    return btn;
  }

  async function bootstrap() {
    try {
      const coursesIndex = await fetchJson('/data/exams/index.json');
      renderView('semesters', coursesIndex);
    } catch (error) {
      // Likely due to running from file://. Use a local server.
      showError(error);
    }
  }

  // Start app when DOM is ready (defer ensures this script runs after DOM)
  bootstrap();
})();

