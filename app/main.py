# Application entry point; combines the routers
from fastapi import FastAPI
from app.database import init_db
from app.routes.contracts import router as contracts_router
from app.routes.analysis import router as analysis_router
app = FastAPI(
    title="Vakeel Contract API",
    description="AI-Powered Contract Analysis using Gemini",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    init_db()
    

@app.get("/")
async def root():
    return{
        "app": "Vakeel Contracts API",
        "version": "1.0.0",
        "endpoints": {
            "POST /contracts/upload": "Upload a PDF or TXT contract for analysis",
            "GET /contracts/": "Retrieve a list of all uploaded contracts",
            "GET /contracts/{contract_id}": "Retrieve details of a specific contract by ID",
            "POST /analysis/analyse/{contract_id}": "Analyze a contract using AI and return insights",
            "GET /analysis/{analysis_id}": "Retrieve the results of a specific analysis by ID",
            "GET /analysis/": "Retrieve a list of all analyses",
            "GET /analysis/contract/{contract_id}": "Retrieve all analyses for a contract"
        }
    }

app.include_router(contracts_router)
app.include_router(analysis_router)