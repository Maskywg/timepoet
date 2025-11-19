import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay,
  isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarProps {
  currentDate: Date;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate }) => {
  const [viewDate, setViewDate] = useState(currentDate);

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  const generateDays = () => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const days = generateDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-purple-400" />
          <h3 className="text-xl font-bold font-space tracking-wide">
            {format(viewDate, 'MMMM yyyy')}
          </h3>
        </div>
        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        <motion.div 
          key={format(viewDate, 'MM-yyyy')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, viewDate);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={day.toString()}
                className={`
                  aspect-square flex items-center justify-center rounded-full text-sm relative
                  transition-all duration-300
                  ${!isCurrentMonth ? 'text-slate-600' : 'text-slate-200'}
                  ${isCurrentDay ? 'font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'hover:bg-white/5'}
                `}
              >
                {isCurrentDay && (
                  <motion.div 
                    layoutId="today-bg"
                    className="absolute inset-1 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full -z-10"
                  />
                )}
                {format(day, 'd')}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Calendar;