import { FC, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './CountryAutocomplete.module.css';
import { ICountriesApiModel } from '../../api/countries.api';
import { selectCountries } from '../../store/selectors.ts';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CountryAutocomplete: FC<Props> = ({
  value,
  onChange,
  placeholder = 'Страна *',
  className = '',
}) => {
  const [suggestions, setSuggestions] = useState<ICountriesApiModel[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const countries = useSelector(selectCountries);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = Math.min(200, suggestions.length * 36); // 36px per item

      let top;
      if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
        top = rect.bottom + window.scrollY;
      } else {
        top = rect.top + window.scrollY - dropdownHeight;
      }

      setDropdownPosition({
        top,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filteredCountries = countries.filter(
        (country) =>
          country.name_ru.toLowerCase().startsWith(inputValue.toLowerCase()) ||
          country.name.toLowerCase().startsWith(inputValue.toLowerCase()),
      );
      setSuggestions(filteredCountries);
      setShowSuggestions(true);
      updateDropdownPosition();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (country: ICountriesApiModel) => {
    onChange(country.name_ru);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (value.length > 0) {
      setShowSuggestions(true);
      updateDropdownPosition();
    }
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={className}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className={styles.suggestions}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}>
          {suggestions.map((country, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(country)}
              className={styles.suggestion}>
              {country.name_ru}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
