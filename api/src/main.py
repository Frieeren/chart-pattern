from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
  return {
    "message": "ruff, pre-commit test",
    "ruff": "install ruff",
    "pre-commit": "install pre-commit",
  }
