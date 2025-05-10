from src.db.session import Base, engine


def init_db():
  """
  모델과 데이터베이스 테이블을 동기화하는 함수
  """
  print("데이터베이스 테이블을 생성합니다...")
  Base.metadata.create_all(bind=engine)
  print("데이터베이스 테이블이 생성되었습니다.")


if __name__ == "__main__":
  init_db()
