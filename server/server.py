from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from contextlib import asynccontextmanager

from utilities.auth import router as auth_router
from routes.user_routes import router as user_router
from processing.upload import router as upload_router

#from database.database_setup import create_db_and_tables

#@asynccontextmanager
#async def lifespan(app: FastAPI):
#        create_db_and_tables()
#        yield
        # No need to yield app here

# creates the FastAPI instance

#app = FastAPI(lifespan=lifespan)

app = FastAPI()

# origins that are allowed to make requests to the server
origins = [
    "http://localhost:5173"
]

# adds the CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# connects to the authentication routes
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(upload_router)


# root route
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")


