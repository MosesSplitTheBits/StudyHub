# StudyHub 🎓

A modern web platform for practicing university exams with a beautiful dark mode interface.

## ✨ Features

- **Semester-based Navigation**: Choose between סמסטר א and סמסטר ב
- **Course Grid**: View courses organized by semester with Hebrew names and emojis
- **Dark Mode**: Beautiful dark theme with gradient buttons and smooth animations
- **RTL Support**: Full right-to-left layout for Hebrew text
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

1. **Open `index.html`** in your web browser
2. **Choose a semester** (סמסטר א or סמסטר ב)
3. **Select a course** from the grid
4. **View placeholder** (exams coming soon!)

## 📁 Project Structure

```
StudyHub/
├── index.html              # Main application (with Tailwind CDN)
├── src/
│   ├── main.js            # Main application logic
│   └── data/
│       └── api.js         # Data access layer
├── data/
│   ├── semesters.json     # Semester definitions
│   ├── courses.json       # Course definitions with emojis
│   └── exams/             # Exam metadata (existing structure)
├── public/
│   ├── exams/             # PDF files (for future use)
│   └── images/
│       └── exams/         # Cropped question/solution images
└── PROJECT_GUIDE.md       # Development guidelines
```

## 🎨 Design Features

- **Dark Mode**: Gray-900 background with blue-purple gradient buttons
- **Hebrew Support**: Full RTL layout with Hebrew text and emojis
- **Responsive Grid**: 2-column layout for courses, side-by-side semester buttons
- **Smooth Animations**: Hover effects and transitions for better UX

## 🔧 Technical Details

- **Frontend**: Vanilla JavaScript with ES6 modules
- **Styling**: Tailwind CSS via CDN
- **Data**: JSON files with Hebrew course names and emojis
- **Navigation**: Single Page Application with history stack


## 🚧 Future Features

- Exam upload and management
- Question cropping tool
- Performance tracking
- Topic-based practice

## 🌐 Browser Support

- Modern browsers with ES6 module support
- RTL layout support
- CSS Grid and Flexbox support

---

**Note**: This is a refactored version of the original StudyHub project, now using modern web technologies and a clean, modular architecture.
