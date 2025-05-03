from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
  return {
    "message": "Hello World from FastAPI123123123123123123123123123123123123",
    "test": "!@#",
    "test2": "!@#",
  }
