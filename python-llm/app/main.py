import sys
import os
from dotenv import load_dotenv
import uvicorn

load_dotenv()
sys.path = sys.path + ["./app"]

from fastapi import FastAPI, HTTPException 
from pydantic import BaseModel
from services.llm_service import LLMService

app = FastAPI()
llm_service = LLMService()


class TextData(BaseModel):
    text: str
    lang: str # Adicionado idioma

# Adicionado Rota inicial
@app.get("/")
async def read_root():
    return {"message": "API is running"}


@app.post("/summarize")
async def summarize(data: TextData):
    text = data.text
    lang = data.lang.lower() # Adicionado idioma

    # Adicionado verificacao dos idiomas suportados
    if lang not in ["pt", "en", "es"]:
        raise HTTPException(status_code=400, detail="Language not supported")
    
    summary = llm_service.summarize_text(text, lang) # Alterado para fazer a chamada e guardar o resumo em summary
    return {"summary": summary} # Alterado para retornar o summary


# Abre na porta que esta em PORT no env ou na 8000 caso nao exista
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))