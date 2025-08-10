# StudyHub – Development Guide

This file serves as a **reference for development inside Cursor**.  
It explains the project goals, chosen tools, architecture, and first tasks so AI tools can assist effectively.

---

## 🎯 Project Purpose

StudyHub will be a **web platform** for practicing university exams.  
**Important:** The website's interface language will be **Hebrew** (`lang="he"`, `dir="rtl"`), including RTL layout and user-friendly emojis.

### Initial Features:
1. **Random Question Practice** – Generate a simulated exam from the question bank.  
   Solutions are hidden until the end of the exam or upon clicking a button.
2. **Full Exam Simulation** – Choose a specific exam (e.g., "2023 Semester A Moed B"), show only the questions first, reveal solutions later.

### Future Features:
- Mark questions as correct/incorrect → get performance feedback.
- Categorize questions by topics → targeted practice.
- Practice by topic only.
- **Online editor tool** (inside the website) to crop questions/solutions from a PDF into images with metadata.

---

## 🛠 Tools & Technologies

### **Frontend (Phase 1)**
- **Vanilla HTML + Tailwind CSS (CDN)** – quick start, clean design.
- **Vanilla JS (ES6 modules)** – DOM interaction, JSON loading.
- **RTL + Hebrew support** – `lang="he"`, `dir="rtl"`, all UI in Hebrew, with emojis.

### **Data**
- **Static Images (PNG/JPEG)** + JSON metadata stored in `/public/images` and `/data`.
- JSON structure:
  - List of courses (`courses.json`)
  - Exams per course (`/data/exams/<courseId>/<examId>.json`)

### **PDF Cropping Workflow**
Instead of showing whole pages or ranges, each question and solution will be cropped as a separate image:
- `q01.png` = Question 1
- `s01.png` = Solution 1  

Folder structure:
```
/public/images/exams/<courseId>/<examId>/
```
**Advantages:**
- Prevents unwanted exposure of solutions.
- Faster loading.
- No PDF processing during runtime.

### **PDF Viewing**
- Phase 1: Only inside the cropping tool.
- Cropping will use **pdf.js** inside a browser-based editor.

### **State & Storage**
- Phase 1: `localStorage` – store results and markings locally.
- Phase 2: Cloud DB (Supabase/Firebase) – per-user data storage.

### **Frontend (Phase 2)**
- **React + Vite** – migrate to component-based UI.
- Tailwind installed locally.
- State management using **Zustand**.

### **Deployment**
- Phase 1: **GitHub Pages** (static hosting).
- Phase 2: **Vercel** (React/SSR if needed).

---

## 📂 Project Structure

```
/public
  /exams/<courseId>/<examId>.pdf               # Original PDFs (for the editor only)
  /images/exams/<courseId>/<examId>/q01.png    # Cropped question images
  /images/exams/<courseId>/<examId>/s01.png    # Cropped solution images
/data
  courses.json                                 # List of courses
  /exams/<courseId>/<examId>.json              # Exam metadata
/src
  /data/api.js                                 # Data Access Layer
  main.js                                      # Main code (Phase 1)
/features (Phase 2 - React)
/styles                                        # Tailwind config, custom styles (Phase 2)
```

---

## 🧩 JSON Examples

### **Course List**
```json
// courses.json
{
  "courses": [
    { "id": "linear-algebra", "name": "אלגברה לינארית 🧮" },
    { "id": "probability", "name": "הסתברות 🎲" },
    { "id": "advanced-c", "name": "תכנות מתקדם ב־C 💻" }
  ]
}
```

### **Exam Metadata (Cropped Images)**
```json
// /data/exams/calculus2/2023-a-b.json
{
  "courseId": "calculus2",
  "examId": "2023-a-b",
  "label": "2023 | סמסטר א | מועד ב",
  "items": [
    {
      "number": 1,
      "qImg": "/images/exams/calculus2/2023-a-b/q01.png",
      "sImg": "/images/exams/calculus2/2023-a-b/s01.png",
      "topics": ["Integrals"]
    },
    {
      "number": 2,
      "qImg": "/images/exams/calculus2/2023-a-b/q02.png",
      "sImg": "/images/exams/calculus2/2023-a-b/s02.png"
    }
  ]
}
```

---

## 📊 Architecture Diagram

![Architecture](studyhub-architecture.png)

---

## 📸 PDF Cropping Workflow

### Steps to add a new exam:
1. Place the PDF in `/public/exams/<courseId>/<examId>.pdf`
2. Open the **Cropping Editor** (pdf.js + canvas).
3. For each question:
   - Select page
   - Draw a rectangle over the question area → save as `qNN.png`
4. For each solution:
   - Draw a rectangle → save as `sNN.png`
5. Save all images in `/public/images/exams/<courseId>/<examId>/`
6. Update the JSON file for the exam in `/data/exams/<courseId>/<examId>.json`.

---

## ✅ Initial Checklist

- [ ] Create `/data/courses.json` and `/data/exams/<courseId>/<examId>.json`
- [ ] Organize files under `/public/exams` and `/public/images/exams`
- [ ] Merge `courses.html` into `index.html`
- [ ] Merge `course-style.css` into Tailwind
- [ ] Add Tailwind CDN to `index.html`
- [ ] Implement navigation (Home → Course → Exam)
- [ ] Load course list from JSON and display
- [ ] Load exams list for each course
- [ ] Display question images (`qImg`) in simulation mode
- [ ] "Show Solution" button to reveal `sImg`
- [ ] Store results in `localStorage`
- [ ] Display score summary
- [ ] Build PDF cropping tool (pdf.js + canvas)

---

## 🧠 Notes for Cursor

- Code must be **clean, modular**, and in **English code blocks**.
- UI must support RTL and Hebrew from the start.
- Use Tailwind (CDN in Phase 1).
- Keep the `api.js` data layer to allow migration to Supabase later.
- When moving to React:
  - Keep the JSON format unchanged.
  - Use Zustand for state management.
