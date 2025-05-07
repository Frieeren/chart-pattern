from fastapi import FastAPI

app = FastAPI(root_path="/api")


@app.get("/")
async def root():
  return {
    "message": "ruff, pre-commit test",
    "ruff": "install ruff",
    "pre-commit": "install pre-commit",
  }
