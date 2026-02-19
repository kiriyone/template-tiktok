export const Caption: React.FC<{caption: string}> = ({caption}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '18px 40px 26px',
        backgroundColor: 'rgba(0, 0, 0, 0.26)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 52,
          lineHeight: 1.25,
          fontWeight: 600,
          fontFamily: 'sans-serif',
          textShadow: '0 2px 6px rgba(0, 0, 0, 0.7)',
        }}
      >
        {caption}
      </div>
    </div>
  );
};
