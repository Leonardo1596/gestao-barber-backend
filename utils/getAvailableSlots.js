function getAvailableSlots(openingTime, closingTime, lunchStart, lunchEnd) {
  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (minutes) => {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const open = toMinutes(openingTime);
  const close = toMinutes(closingTime);
  const lunchS = toMinutes(lunchStart);
  const lunchE = toMinutes(lunchEnd);

  const slots = [];

  for (let t = open; t < close; t += 10) {
    const isDuringLunch = t >= lunchS && t < lunchE;
    if (!isDuringLunch) {
      slots.push(toTime(t));
    }
  }

  return slots;
}

module.exports = {
  getAvailableSlots
};