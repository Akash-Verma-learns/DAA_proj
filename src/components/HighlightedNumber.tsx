interface HighlightedNumberProps {
  value: number;
  highlightDigit?: number;
  digitPosition?: number;
}

export const HighlightedNumber = ({ 
  value, 
  highlightDigit, 
  digitPosition 
}: HighlightedNumberProps) => {
  const digits = value.toString().split('').reverse();
  
  return (
    <div className="font-mono font-bold flex items-center gap-0.5">
      {digits.map((digit, idx) => {
        const isHighlighted = digitPosition !== undefined && idx === digitPosition;
        return (
          <span
            key={idx}
            className={`transition-all duration-300 ${
              isHighlighted
                ? 'text-2xl text-accent scale-125 bg-accent/20 px-1 rounded'
                : 'text-lg text-foreground'
            }`}
            style={{ order: digits.length - idx }}
          >
            {digit}
          </span>
        );
      }).reverse()}
    </div>
  );
};
