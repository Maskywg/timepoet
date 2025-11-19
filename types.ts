export interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
  ampm: string;
  date: Date;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface InsightResponse {
  insight: string;
  mood: string;
}
