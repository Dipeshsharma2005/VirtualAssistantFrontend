
---

# 🌐 `frontend/README.md`
## 🌍 Live Frontend URL
Deployed on Render:  
➡️ https://virtualassistantfrontend-zy6a.onrender.com

🔗 Backend Repo: [virtual-assistant-backend](https://github.com/Dipeshsharma2005/VirtualAssistantBackend)  

```markdown


# 🌐 Virtual Assistant Frontend

React frontend for the **Virtual Assistant App**.  
Allows users to sign up, log in, customize their AI assistant, and chat in real-time.

---

## 🚀 Features
- React + Vite + TailwindCSS
- JWT-based authentication with backend
- Assistant customization (name + avatar)
- Chat interface with AI assistant
- Axios for API requests
- Responsive UI

---

## ⚙️ Tech Stack
- React 18
- Vite
- TailwindCSS
- Axios
- React Router DOM

---

## ⚡ Setup Instructions

### 1️⃣ Clone & Navigate
```bash
git clone https://github.com/yourusername/virtual-assistant.git
cd frontend

2️⃣ Install Dependencies
npm install

3️⃣ Configure API URL
In src/context/UserContext.jsx set your backend URL:
const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8080";


4️⃣ Run Frontend
npm run dev

Frontend runs at:
➡️ http://localhost:5173

🔑 Pages

/signup → Register user

/login → Login

/customize → Choose assistant image

/customize2 → Enter assistant name

/ → Chat with AI assistant

<img width="1919" height="965" alt="Login" src="https://github.com/user-attachments/assets/e009e95f-db4b-4252-b9e1-a8b39cc6578d" />
<img width="1920" height="1080" alt="Customize" src="https://github.com/user-attachments/assets/8e7a9d5d-b668-470a-9874-64ad73bf8b29" />
<img width="1919" height="969" alt="Customize2" src="https://github.com/user-attachments/assets/4d0102cd-ec2f-4be0-a6f1-a5100adbd299" />
<img width="1917" height="969" alt="Home" src="https://github.com/user-attachments/assets/cd89f672-c2ec-46aa-9cf0-e0d0ad769168" />
<img width="1917" height="963" alt="History" src="https://github.com/user-attachments/assets/823aed69-9f46-4386-9632-7cd6f3bde629" />
<img width="1920" height="1080" alt="Home" src="https://github.com/user-attachments/assets/60995172-ab08-4f94-841d-e90d78667396" />


