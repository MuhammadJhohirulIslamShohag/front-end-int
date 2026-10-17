import { useState, useEffect } from "react";

function getRelativeUnit(diffMs: number): { value: number; unit: Intl.RelativeTimeFormatUnit } {
  const diffSec = diffMs / 1000;
  if (Math.abs(diffSec) < 60) return { value: diffSec, unit: "second" };
  const diffMin = diffSec / 60;
  if (Math.abs(diffMin) < 60) return { value: diffMin, unit: "minute" };
  const diffHour = diffMin / 60;
  if (Math.abs(diffHour) < 24) return { value: diffHour, unit: "hour" };
  const diffDay = diffHour / 24;
  if (Math.abs(diffDay) < 7) return { value: diffDay, unit: "day" };
  const diffWeek = diffDay / 7;
  if (Math.abs(diffWeek) < 4) return { value: diffWeek, unit: "week" };
  const diffMonth = diffDay / 30;
  if (Math.abs(diffMonth) < 12) return { value: diffMonth, unit: "month" };
  return { value: diffDay / 365, unit: "year" };
}

export function PostTimestamp({ createdAt, locale = "en" }: { createdAt: number; locale?: string }) {
  const [now, setNow] = useState(Date.now());
  const ageMs = now - createdAt;
  const isRecent = ageMs < 60 * 60 * 1000;

  useEffect(() => {
    if (!isRecent) return;
    const interval = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(interval);
  }, [isRecent]);

  const { value, unit } = getRelativeUnit(-ageMs);
  const label = isRecent
    ? new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "long" }).format(Math.round(value), unit)
    : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(createdAt);

  return (
    <time dateTime={new Date(createdAt).toISOString()} title={label}>
      {label}
    </time>
  );
}