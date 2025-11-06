import { useEffect, useState } from "react";
import { useI18n } from "../lib/i18n";


export default function HalloweenCountdown() {
    const { t } = useI18n();
  const targetDate = new Date("2026-10-31T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 0",
        color: "orange",
        fontFamily: "SpookyFont",
        fontSize: "2rem",
      }}
    >
        <p>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </p>
      <h2 style={{ fontFamily: "SpookyFont", fontSize: "48px", color: "orange" }}>
  Iki Helovyno liko visai nedaug!
</h2>
      
    </div>
  );
}