interface CalendarProps {
  label?: string;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date) => void;
}