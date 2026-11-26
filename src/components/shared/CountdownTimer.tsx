import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  initialSeconds?: number;
  size?: 'sm' | 'md';
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds = 29 * 60 + 59,
  size = 'md',
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : initialSeconds));
    }, 1000);
    return () => clearInterval(id);
  }, [initialSeconds]);

  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const boxCls =
    size === 'sm'
      ? 'min-w-[20px] h-[20px] text-[11px] px-1'
      : 'min-w-[24px] h-[24px] text-[13px] px-1';

  return (
    <div className="inline-flex items-center gap-[3px] tabular-nums">
      <span
        className={`${boxCls} rounded-[4px] bg-[#1A1A1A] text-white font-bold inline-flex items-center justify-center`}
      >
        {hrs}
      </span>
      <span className="text-[#1A1A1A] font-bold text-[12px]">:</span>
      <span
        className={`${boxCls} rounded-[4px] bg-[#1A1A1A] text-white font-bold inline-flex items-center justify-center`}
      >
        {mins}
      </span>
      <span className="text-[#1A1A1A] font-bold text-[12px]">:</span>
      <span
        className={`${boxCls} rounded-[4px] bg-[#1A1A1A] text-white font-bold inline-flex items-center justify-center`}
      >
        {secs}
      </span>
    </div>
  );
};
