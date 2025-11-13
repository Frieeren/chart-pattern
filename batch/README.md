# Binance Coin Price Data Collect

바이낸스 거래소 코인 가격 데이터 수집 프로세스
바이낸스 거래소에 상장된 코인을 대상으로 5m 데이터 수집 및 csv 파일로 저장

## 사전 준비사항

### 1. Python 설치
- Python 3.13 이상 필요

### 2. uv 설치
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## 프로젝트 설치

### 1. 저장소 클론
```bash
git clone <repository-url>
cd chart-pattern/batch
```

### 2. Python 버전 확인 및 의존성 설치
```bash
# uv로 Python 및 의존성 자동 설치
uv sync
```

### 3. 가상환경 활성화
```bash
# macOS/Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

## Jupyter Notebook 실행

### 방법 1: Jupyter Notebook 실행
```bash
uv run jupyter notebook
```

### 방법 2: Jupyter Lab 실행 (권장)
```bash
uv run jupyter lab
```

브라우저가 자동으로 열리며, `notebooks/binance_smoke.ipynb` 파일을 실행할 수 있습니다.

## 사용 예시

`notebooks/binance_smoke.ipynb`를 열어서 순서대로 셀을 실행:

### 1. 초기 설정 및 Import (첫 번째 셀)
```python
import sys, os
from datetime import datetime, timedelta, timezone

# 프로젝트 루트를 sys.path에 추가하여 'batch' 패키지로 임포트 (경로 변경 필요)
sys.path.append("/Users/sonjuhyeong/workspace/frieeren/projects/chart-pattern")

from batch.binance_client import get_all_symbols, get_klines
from batch.collector import collect_symbol_5m_to_csv, collect_all_market_5m_to_csv

# 출력 디렉토리 (경로 변경 필요)
OUTPUT_DIR = "/Users/sonjuhyeong/workspace/frieeren/projects/chart-pattern/batch/data"
os.makedirs(OUTPUT_DIR, exist_ok=True)
```

### 2. 데이터 수집 실행 (두 번째 셀)
```python
# Main Process
# EXCLUDE_BASES 에 수집하지 않을 코인 symbol을 명시
EXCLUDE_BASES = ["BTC", "ETH"]

paths = collect_all_market_5m_to_csv(exclude_bases=EXCLUDE_BASES)
```

## 주의사항
- 데이터 수집 시 바이낸스 API Rate Limit에 유의하세요
- 대량의 데이터 수집은 시간이 오래 걸릴 수 있습니다
