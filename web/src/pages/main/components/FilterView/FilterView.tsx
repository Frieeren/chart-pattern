import { INTERVAL_OPTIONS } from '@web/shared/constants/filter';
import type { IntervalOption, SymbolOption } from '@web/shared/types/domain';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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
            <option value="">{t('filter.selectSymbol')}</option>
            {symbols.map(symbol => (
              <option key={symbol.id} value={symbol.id.toString()}>
                {symbol.name} ({symbol.code})
              </option>
            ))}
          </select>
          {error && <div className={errorMessage}>{error}</div>}
        </>
      ) : (
        <div className={emptyMessage}>{t('filter.noSymbol')}</div>
      )}
    </div>
  );
}

interface FilterViewProps {
  interval: IntervalOption;
  onChangeInterval: (value: unknown) => void;
  intervalError?: string | null;
  symbolId: string | number | null;
  onChangeSymbol: (value: unknown) => void;
  symbolError?: string | null;
  symbols: SymbolOption[];
}

export const FilterView: React.FC<FilterViewProps> = ({
  interval,
  onChangeInterval,
  intervalError,
  symbolId,
  onChangeSymbol,
  symbolError,
  symbols,
}) => {
  const { t } = useTranslation();
  return (
    <div className={filterSection}>
      <h3 className={filterTitle}>{t('filter.title')}</h3>

      <FilterSelect
        label={t('filter.interval')}
        options={INTERVAL_OPTIONS}
        value={interval}
        onChange={onChangeInterval}
        error={intervalError}
      />

      <SymbolSelect
        label={t('filter.symbol')}
        symbols={symbols}
        selectedSymbolId={symbolId}
        onSelectSymbol={onChangeSymbol}
        error={symbolError}
      />
    </div>
  );
};
