// src/components/Timer.jsx
const Timer = ({ timer }) => {
  return (
    <div className="timer">
      <div className="timer-display">
        {timer.format(timer.seconds)}
      </div>
      <div className="timer-buttons">
        {!timer.isRunning ? (
          <button onClick={timer.start} className="btn-primary">▶️ Start</button>
        ) : (
          <button onClick={timer.stop} className="btn-danger">⏸️ Pause</button>
        )}
        <button onClick={timer.reset} className="btn-secondary">🔄 Reset</button>
      </div>
    </div>
  );
};

export default Timer;
