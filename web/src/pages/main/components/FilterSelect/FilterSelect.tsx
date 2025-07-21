import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { errorMessage, filterItem, filterLabel, filterSelect } from './style.css';

interface FilterSelectProps {
  label: string;
  options: { value: string | number; label: string }[];
  error?: string | null;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
}

export const FilterSelect = forwardRef<HTMLSelectElement, FilterSelectProps>(
  ({ label, options, name, onChange, onBlur, error }, ref) => {
    const { t } = useTranslation();

    return (
      <div className={filterItem}>
        <label htmlFor={`${label}-select`} className={filterLabel}>
          {label}
        </label>
        <select
          id={`${label}-select`}
          name={name}
          className={filterSelect}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
        >
          <option value="">{t('filter.empty')}</option>
          {options?.map(option => (
            <option key={option.value} value={option.value.toString()}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <div className={errorMessage}>{error}</div>}
      </div>
    );
  }
);
