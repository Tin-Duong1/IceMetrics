# IceMetrics

IceMetrics, a hockey analyzer app that utilizes OpenCV that allows for automated game analysis. This app leverages the use of AI in applications, the front end will be built using React and the Backend will be built using FastAPI

# Start up vite dev server

cd client
npm install
npm run dev

# Python virtual environment

cd server
python3 -m venv venv
source venv/bin/activate

# Install requirements

pip install -r requirements.txt

# Startup the FastAPI dev server

uvicorn server:app --reload

# Setup backend to run

Create .env package and then put connection string for the app and then it should conenct successfully