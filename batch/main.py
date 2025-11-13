from .collector import collect_all_market_5m_to_csv

EXCLUDE_BASES = ["BTC", "ETH"]


def main():
    paths = collect_all_market_5m_to_csv(exclude_bases=EXCLUDE_BASES)
    for p in paths:
        print(p)


if __name__ == "__main__":
    main()
