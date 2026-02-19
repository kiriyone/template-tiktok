export const TimeLabel: React.FC<{time: string}> = ({time}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        left: 36,
        color: 'white',
        fontSize: 54,
        fontWeight: 700,
        fontFamily: 'sans-serif',
        textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)',
      }}
    >
      {time}
    </div>
  );
};
