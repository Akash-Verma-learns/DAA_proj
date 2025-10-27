interface ArrayDisplayProps {
  array: number[];
  states: ('default' | 'comparing' | 'sorted' | 'active')[];
  label?: string;
}

export const ArrayDisplay = ({ array, states, label }: ArrayDisplayProps) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'comparing':
        return 'bg-comparing text-background';
      case 'sorted':
        return 'bg-sorted text-background';
      case 'active':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-secondary text-foreground';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
      )}
      <div className="flex flex-wrap gap-2 p-4 bg-card/50 rounded-lg border border-border min-h-[60px] items-center">
        {array.length === 0 ? (
          <span className="text-muted-foreground text-sm">Empty array</span>
        ) : (
          array.map((value, index) => (
            <div
              key={`${index}-${value}`}
              className={`px-4 py-2 rounded-md font-mono font-semibold text-lg transition-all duration-300 ${getStateColor(
                states[index]
              )}`}
            >
              {value}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
