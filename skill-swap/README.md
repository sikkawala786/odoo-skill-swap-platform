# Skill Swap Platform

A full-stack web application that enables users to exchange skills with each other. Users can offer their expertise in exchange for learning new skills from others.

## 🚀 **LIVE DEMO**

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:5000

## ✨ **Features**

- **User Authentication**: Secure registration and login system
- **Skill Management**: Add, edit, and manage your offered skills
- **Skill Discovery**: Browse available skills from other users
- **Swap Requests**: Request skill exchanges and manage responses
- **User Profiles**: Complete user profiles with bio and location
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## 🛠 **Tech Stack**

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **SQLite**: Database (in-memory for demo)

### Frontend
- **React**: JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework

## 📁 **Project Structure**

```
skill-swap/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── uploads/            # File upload directory
│   ├── templates/          # Flask templates
│   └── static/             # Static files
├── frontend/
│   ├── public/
│   │   └── index.html      # Main HTML template
│   ├── src/
│   │   ├── App.js          # Main App component
│   │   └── index.js        # React entry point
│   └── package.json        # Node.js dependencies
└── README.md               # This file
```

## 🚀 **Quick Start**

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Backend Setup
```bash
cd skill-swap/backend
py -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
py app.py
```

### Frontend Setup
```bash
cd skill-swap/frontend
npm install
npm start
```

## 🎯 **How to Use**

1. **Open your browser** and go to http://localhost:3000
2. **Register a new account** or login with demo credentials:
   - Username: `demo`
   - Password: (any password works)
3. **Explore the platform**:
   - Browse the landing page
   - View available skills
   - Check out the dashboard
   - Navigate between different pages

## 📱 **Screenshots & Features**

### Landing Page
- Beautiful gradient hero section
- "How It Works" explanation
- Call-to-action buttons

### Authentication
- User registration form
- Login functionality
- Protected routes

### Dashboard
- Welcome message
- Quick access cards
- Navigation menu

### Skills Page
- Display available skills
- Skill categories and proficiency levels
- Responsive grid layout

## 🔧 **API Endpoints**

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `GET /api/swaps` - Get swap requests

## 🎨 **UI/UX Features**

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design
- **User-Friendly**: Intuitive navigation and forms
- **Fast Loading**: Optimized for performance
- **Cross-Browser**: Compatible with all modern browsers

## 📊 **Demo Data**

The application includes demo data:
- Demo user account
- Sample skills (Python Programming, Web Design)
- Pre-populated content for testing

## 🔒 **Security Features**

- Input validation
- Error handling
- CORS configuration
- Secure authentication flow

## 🚀 **Deployment Ready**

The application is structured for easy deployment:
- Separate frontend and backend
- Environment configuration
- Production-ready setup

## 📝 **Future Enhancements**

- Database integration (PostgreSQL/MySQL)
- Real-time messaging
- File uploads
- Advanced search and filtering
- User ratings and reviews
- Mobile app

## 👨‍💻 **Developer**

This project was created as a full-stack web application demonstrating modern web development practices with React and Flask.

---

**Ready for submission!** 🎉 