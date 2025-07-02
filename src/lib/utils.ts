import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeSessionFromSchedule(
  schedule: any[],
  dayIndex: number,
  sessionId: number
) {
  return schedule.map((day, index) =>
    index === dayIndex
      ? {
          ...day,
          sessions: day.sessions.filter((session: any) => session.id !== sessionId),
        }
      : day
  );
}

export default removeSessionFromSchedule;