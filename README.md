## 🚀 Getting Started

# 🎬 Netflix Application (Backend API)

- ⚙️ **Backend**: Node.js, Express, TypeScript
- 🎨 **Frontend**: React, Vite, Javascript

## ⚡ Quick Start on Installing the Application

1.Clone Repository
  ```bash
git clone https://github.com/yourusername/netflix-clone.git
cd netflix-clone
  
2.Run Backend
  cd netflix-clone-backend
  npm install
  npm run dev
  
3.Run Frontend
  cd netflix-clone-frontend
  npm install
  npm run dev

4.🖥️ Access the App with Google Chrome


🚀 How to Use the Application

Run the Application

-Run Commands in the terminal for the back-end.
-Open a second terminal to run the front-end. 
-Make sure both files run simultaneously.
-The port to run the application will be stated when the both applications run sucessfully.
-Copy and paste the link in Google Chrome.

Front-end Usage 

-Create a netflix account to Log-in.
-Select a plan.

Back-end usage

-Check API Migrations and endpoints to check the fetching of data real-time and usage of API integration in the application code file.

🗄️ Database Setup

Start the container
-docker ps   # check if uni-postgres is running

Export the database (backup):
-docker exec -t uni-postgres pg_dump -U postgres -d netflix-clone > netflix-clone-dump.sql

Restore from backup:
-cat netflix-clone-dump.sql | docker exec -i uni-postgres psql -U postgres -d netflix-clone


📌 Notes
Both apps need to be running for the clone to function properly.
Database schema + data can be restored from the provided netflix-clone-dump.sql.


For further assistance, refer to Ameli Fernando & Polina Zueva.
