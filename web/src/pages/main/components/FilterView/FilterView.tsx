import { TIMEFRAME_OPTIONS } from '@web/shared/constants/filter';
import type { SymbolOption, TimeframeOption } from '@web/shared/types/domain';
import {
  emptyMessage,
  errorMessage,
  filterItem,
  filterLabel,
  filterSection,
  filterSelect,
  filterTitle,
} from './style.css';

interface FilterSelectProps {
  label: string;
  options: { value: string | number; label: string }[];
  value: string | number;
  onChange: (value: unknown) => void;
  error?: string | null;
}

function FilterSelect({ label, options, value, onChange, error }: FilterSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={filterItem}>
      <label htmlFor={`${label}-select`} className={filterLabel}>
        {label}
      </label>
      <select id={`${label}-select`} className={filterSelect} value={value.toString()} onChange={handleChange}>
        {options.map(option => (
          <option key={option.value} value={option.value.toString()}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className={errorMessage}>{error}</div>}
    </div>
  );
}

interface SymbolSelectProps {
  label: string;
  symbols: SymbolOption[];
  selectedSymbolId: string | number | null;
  onSelectSymbol: (symbolId: unknown) => void;
  error?: string | null;
}

function SymbolSelect({ label, symbols, selectedSymbolId, onSelectSymbol, error }: SymbolSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSelectSymbol(value || null);
  };

  return (
    <div className={filterItem}>
      <label htmlFor={`${label}-select`} className={filterLabel}>
        {label}
      </label>
      {symbols.length > 0 ? (
        <>
          <select
            id={`${label}-select`}
            className={filterSelect}
            value={selectedSymbolId?.toString() || ''}
            onChange={handleChange}
          >
            <option value="">종목 선택</option>
            {symbols.map(symbol => (
              <option key={symbol.id} value={symbol.id.toString()}>
                {symbol.name} ({symbol.code})
              </option>
            ))}
          </select>
          {error && <div className={errorMessage}>{error}</div>}
        </>
      ) : (
        <div className={emptyMessage}>선택 가능한 종목이 없습니다.</div>
      )}
    </div>
  );
}

interface FilterViewProps {
  timeframe: TimeframeOption;
  onChangeTimeframe: (value: unknown) => void;
  timeframeError?: string | null;
  symbolId: string | number | null;
  onChangeSymbol: (value: unknown) => void;
  symbolError?: string | null;
  symbols: SymbolOption[];
}

export const FilterView: React.FC<FilterViewProps> = ({
  timeframe,
  onChangeTimeframe,
  timeframeError,
  symbolId,
  onChangeSymbol,
  symbolError,
  symbols,
}) => {
  return (
    <div className={filterSection}>
      <h3 className={filterTitle}>Filtering</h3>

      <FilterSelect
        label="기간 설정"
        options={TIMEFRAME_OPTIONS}
        value={timeframe}
        onChange={onChangeTimeframe}
        error={timeframeError}
      />

      <SymbolSelect
        label="종목 설정"
        symbols={symbols}
        selectedSymbolId={symbolId}
        onSelectSymbol={onChangeSymbol}
        error={symbolError}
      />
    </div>
  );
};
