export const formatTime = (seconds: number) => {
  const whole = Math.floor(seconds);
  return [Math.floor(whole / 60), whole % 60].map((value) => String(value).padStart(2, '0')).join(':');
};
