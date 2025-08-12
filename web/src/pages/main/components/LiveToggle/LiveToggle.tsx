import { liveDot, toggleButton, toggleButtonActive, toggleContainer } from './style.css';

interface LiveToggleProps {
  value: boolean;
  onChange: () => void;
}

export function LiveToggle({ value, onChange }: LiveToggleProps) {
  return (
    <div className={toggleContainer}>
      <button
        type="button"
        className={`${toggleButton} ${value ? toggleButtonActive : ''}`}
        onClick={() => onChange()}
        aria-label={`live ${value ? 'on' : 'off'}`}
      >
        {value ? (
          <>
            <div className={liveDot} />
            LIVE
          </>
        ) : (
          'DELAYED'
        )}
      </button>
    </div>
  );
}
