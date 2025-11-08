# 백테스팅 가이드

차트 패턴 유사도 알고리즘의 성능을 측정하는 백테스팅 도구입니다.

## 개요

이 도구는 다음과 같은 방식으로 알고리즘을 평가합니다:

1. DB에서 무작위 시점을 N개 선택합니다
2. 타겟 패턴과 후보 패턴들의 유사도를 계산합니다
3. 상위 10개 패턴의 이후 가격 방향을 확인합니다
4. 상승/하락 개수를 기반으로 확률을 계산합니다

## 사용법

### Docker로 실행 (권장)

#### 1. Docker Compose로 백테스팅 컨테이너 시작

```bash
docker-compose up -d backtest
```

#### 2. 백테스팅 실행

```bash
# 기본 실행 (단일 패턴)
docker-compose exec backtest uv run python -m src.backtest.backtest --symbol BTCUSDT --period 300 --tick_count 12 --n 100

```

#### 3. 컨테이너 종료 (선택사항)

```bash
docker-compose stop backtest
```

### 로컬에서 실행

로컬 환경에서 직접 실행하려면 먼저 의존성을 설치해야 합니다:

```bash
cd api
uv sync
uv run python -m src.backtest.backtest --symbol BTCUSDT --period 300 --tick_count 12 --n 100
```

### 파라미터 설명

- `--symbol` (필수): 심볼 이름
  - 예: `BTCUSDT`, `ETHUSDT`
  
- `--period` (필수): 입력 패턴의 틱 개수
  - 예: `300` (300틱 = 약 25시간, 5분봉 기준)
  
- `--tick_count` (선택, 기본값: 12): 이후 판단할 틱 개수
  - 예: `12` (12틱 = 1시간, 5분봉 기준)
  
- `--n` (선택, 기본값: 100): 무작위 시점 개수
  - 예: `100` (100개의 무작위 시점에서 후보 패턴 선택)
  
- `--strategy` (선택, 기본값: simple): 평가 전략
  - `simple`: 기본 다수결 전략
  - `price_analysis`: 가격 변동률 분석 전략 (평균 상승/하락률 계산)

### 실행 예시

#### Docker로 실행

```bash
# BTCUSDT, 300틱 패턴, 12틱 후 방향 예측, 100개 시점 (기본 전략)
docker-compose exec backtest uv run python -m src.backtest.backtest --symbol BTCUSDT --period 300 --tick_count 12 --n 100

# ETHUSDT, 200틱 패턴, 24틱 후 방향 예측, 50개 시점 (가격 변동률 분석)
docker-compose exec backtest uv run python -m src.backtest.backtest --symbol ETHUSDT --period 200 --tick_count 24 --n 50 --strategy price_analysis
```

#### 로컬에서 실행

```bash
# BTCUSDT, 300틱 패턴, 12틱 후 방향 예측, 100개 시점
python -m src.backtest.backtest --symbol BTCUSDT --period 300 --tick_count 12 --n 100

# ETHUSDT, 200틱 패턴, 24틱 후 방향 예측, 50개 시점
python -m src.backtest.backtest --symbol ETHUSDT --period 200 --tick_count 24 --n 50
```

## 출력 예시

```
2024-01-01 10:00:00 - INFO - 심볼: BTCUSDT, 기간: 300, 틱: 12, N: 100
2024-01-01 10:00:01 - INFO - 무작위 시점 101개 선택 완료
2024-01-01 10:00:02 - INFO - 타겟 패턴: 2024-01-01 00:00:00 ~ 2024-01-01 04:59:00
2024-01-01 10:00:05 - INFO - 유사도 계산 완료: 100개

상위 10개 후보:
1. 2024-01-01 01:00:00, 유사도: 0.1234
2. 2024-01-01 02:00:00, 유사도: 0.1456
...

2024-01-01 10:00:06 - INFO - 결과: 상승 7개, 하락 3개
2024-01-01 10:00:06 - INFO - 평가 결과: 상승 70.0% (하락 30.0%)

최종 결과:
상승: 7개, 하락: 3개
예측: 상승 70.0%
```

## 동작 원리

1. **무작위 시점 선택**: DB에서 `period + tick_count` 개의 데이터를 가져올 수 있는 무작위 시점을 N개 선택합니다 (후보 N개)

2. **타겟 패턴 선택**: 선택된 시점 중 하나를 무작위로 타겟 패턴으로 선택합니다

3. **유사도 계산**: 타겟 패턴과 나머지 후보 패턴들의 유사도를 계산합니다
   - 현재는 `CandleOnlyAlgorithm` 사용 (캔들스틱 특징 기반)

4. **상위 10개 선택**: 유사도가 높은 상위 10개 패턴을 선택합니다

5. **방향 판단**: 각 패턴의 끝 시점 이후 `tick_count` 틱 동안 가격이 상승했는지 하락했는지 판단합니다

6. **확률 계산**: 상승/하락 개수를 기반으로 확률을 계산합니다
   - 현재는 `SimpleMajorityStrategy` 사용 (단순 다수결)

## 알고리즘 교체

다른 유사도 알고리즘을 사용하려면 `SimilarityAlgorithm` 인터페이스를 구현한 클래스를 만들어 `run_backtest` 함수의 `algorithm` 파라미터로 전달하면 됩니다.

예시:

```python
from src.backtest.backtest import run_backtest
from src.backtest.algorithm_interface import SimilarityAlgorithm

class MyCustomAlgorithm(SimilarityAlgorithm):
    def calculate_similarity(self, target_pattern, candidate_pattern):
        # 커스텀 유사도 계산 로직
        return similarity_score

result = run_backtest(
    symbol="BTCUSDT",
    period=300,
    algorithm=MyCustomAlgorithm()
)
```

## 평가 전략

평가 전략은 평가와 출력을 모두 담당합니다.

### `SimpleMajorityStrategy` 전략 (기본)
- 상승/하락 중 많은 쪽을 선택
- 해당 비율을 확률로 반환
- 예: 상승 7개, 하락 3개 → 상승 70%
- 개별 패턴 결과와 전체 요약을 출력

### `PriceAnalysisStrategy` 전략
- 상승/하락 중 많은 쪽을 선택하고 비율을 확률로 반환
- **방향에 따른 평균 가격 변동률 분석**
- 예: 상승 60개 → 평균 +2.5% 상승
- 예: 하락 40개 → 평균 -1.8% 하락

## 확장 가능성

### 평가 전략 추가

새로운 평가 전략을 추가하려면 `EvaluationStrategy` 인터페이스를 구현하면 됩니다:

```python
from src.backtest.evaluation_strategy_interface import EvaluationStrategy

class MyCustomEvaluationStrategy(EvaluationStrategy):
    def evaluate(self, up_count, down_count):
        # 커스텀 평가 로직
        return (direction, probability)
    
    def output_results(self, pattern_name, target_pattern, similarities, 
                      up_count, down_count):
        # 커스텀 개별 패턴 출력 로직
        pass
    
    def output_summary(self, results):
        # 커스텀 전체 요약 출력 로직
        pass
```

## 주의사항

- DB에 충분한 데이터가 있어야 합니다 (최소 `period + tick_count` 개)
- 실행 시간은 데이터 양과 N 값에 따라 달라집니다
- 5분봉 데이터를 기준으로 합니다
- Docker로 실행할 때는 `docker-compose.yaml`의 환경 변수가 올바르게 설정되어 있어야 합니다
- DB 연결을 위해 `MYSQL_HOST` 환경 변수가 `db`로 설정되어 있어야 합니다 (Docker Compose 내부 네트워크)
