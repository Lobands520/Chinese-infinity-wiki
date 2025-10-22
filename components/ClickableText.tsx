
import React from 'react';

interface ClickableTextProps {
  text: string;
  onWordClick: (word: string) => void;
  isFadingOut: boolean;
}

// Regex to check for Chinese characters
const chineseRegex = /[\u4e00-\u9fa5]/;

const ClickableText: React.FC<ClickableTextProps> = ({ text, onWordClick, isFadingOut }) => {
  // Split the text by spaces and common punctuation, keeping the delimiters.
  const parts = text.split(/([\s.,!?;:"'()\[\]{}]+)/g).filter(Boolean);

  const renderPart = (part: string, key: number | string) => {
    // Check if the part is just whitespace or punctuation
    if (/^[\s.,!?;:"'()\[\]{}]+$/.test(part) || part.trim() === '') {
      return <span key={key}>{part}</span>;
    }

    // Check if the part contains Chinese characters
    if (chineseRegex.test(part)) {
      return (
        <span key={key}>
          {part.split('').map((char, charIndex) => {
            if (chineseRegex.test(char)) {
              return (
                <span
                  key={`${key}-${charIndex}`}
                  className="cursor-pointer transition-colors duration-200 hover:bg-gray-800 rounded px-1"
                  onClick={() => onWordClick(char)}
                >
                  {char}
                </span>
              );
            }
            // Render non-Chinese characters within the part as is
            return <span key={`${key}-${charIndex}`}>{char}</span>;
          })}
        </span>
      );
    }
    
    // It's an English-like word
    return (
      <span
        key={key}
        className="cursor-pointer transition-colors duration-200 hover:bg-gray-800 rounded px-1"
        onClick={() => onWordClick(part)}
      >
        {part}
      </span>
    );
  };

  return (
    <p className={`text-2xl md:text-3xl leading-relaxed text-gray-300 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      {parts.map((part, index) => renderPart(part, index))}
    </p>
  );
};

export default ClickableText;
