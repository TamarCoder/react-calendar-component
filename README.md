# Calendar Component - Complete Documentation

## 📅 Overview
`Calendar` is a fully customizable calendar component for React/Next.js that provides an intuitive date selection interface through a dropdown popup.

---

## 🚀 Installation

```bash
npm install react react-icons
```

**Required Dependencies:**
- React 18+
- react-icons (FaRegCalendarAlt, TiArrowLeftThick, TiArrowRightThick)

---

## 💡 Usage

### Basic Example:
```tsx
import Calendar from './components/Calendar/Calendar';

function MyForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <Calendar
      label="Birth Date"
      initialDate={new Date()}
      onChange={(date) => setSelectedDate(date)}
    />
  );
}
```

### Integration with React Hook Form:
```tsx
import { Controller } from 'react-hook-form';

<Controller
  name="birthDate"
  control={control}
  render={({ field }) => (
    <Calendar
      label="Select Date"
      initialDate={field.value}
      onChange={field.onChange}
    />
  )}
/>
```

---

## 🎯 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | No | Calendar label text |
| `initialDate` | `Date` | No | Initial selected date |
| `minDate` | `Date` | No | Minimum allowed date (future feature) |
| `maxDate` | `Date` | No | Maximum allowed date (future feature) |
| `onChange` | `(date: Date) => void` | No | Callback function when date is selected |

---

## 🎨 Features

✅ **Month Navigation** - Navigate to previous/next month with ← → buttons  
✅ **Today Highlight** - Blue border on current day  
✅ **Selected Day Highlight** - Blue background on selected date  
✅ **Click Outside** - Closes popup when clicking outside calendar  
✅ **Responsive Design** - Adaptive 7x6 grid layout  
✅ **Weekday Labels** - Sun, Mon, Tue, Wed, Thu, Fri, Sat  
✅ **Customizable Months** - Easy to change in `getMonthName` function

---

## 🧠 Component Architecture

### **State Management (3 States)**

```tsx
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
const [isOpen, setIsOpen] = useState(false);
```

1. **`selectedDate`** - Which date is selected by user
2. **`currentMonth`** - Which month is currently being viewed (can differ from selected)
3. **`isOpen`** - Whether calendar popup is open or closed

---

### **Click Outside Detection**

```tsx
const calendarRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

**How it works:**
1. `useRef` - Creates reference to calendar container
2. `useEffect` - Adds click listener to document (on mount)
3. `handleClickOutside` - Checks if click was inside or outside calendar
4. If outside → `setIsOpen(false)`
5. Cleanup function - Removes listener (on unmount, prevents memory leak)

---

### **Date Formatting**

```tsx
const formatDate = (date: Date | null) => {
  if (!date) return "choose date";
  const day = date.getDate();
  const month = date.getMonth() + 1;  // +1 because getMonth() returns 0-11
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
```

**JavaScript Date Methods:**
- `getDate()` → Day (1-31)
- `getMonth()` → Month (0-11) ⚠️ January = 0!
- `getFullYear()` → Year (2025)
- `getDay()` → Day of week (0-6, Sunday = 0)

---

### **Get Month Name**

```tsx
const getMonthName = (date: Date): string => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[date.getMonth()];
};
```

**For other languages:**
```tsx
const months = [
  "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
  "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
];
```

---

### **Month Navigation**

```tsx
const goToPreviousMonth = () => {
  setCurrentMonth(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
  );
};

const goToNextMonth = () => {
  setCurrentMonth(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
  );
};
```

**JavaScript Magic:**
- `new Date(2025, -1, 1)` → December 2024 (automatic correction!)
- `new Date(2025, 12, 1)` → January 2026
- Month -1 or +1 → JavaScript auto-corrects year if needed

---

### **Calculate Days in Month**

```tsx
const getDayInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};
```

**How it works:**
- `new Date(2025, 12, 0)` = January 0 = **Last day of December** (31)
- `new Date(2025, 2, 0)` = March 0 = **Last day of February** (28 or 29)
- **Day 0 of next month = Last day of current month!**

**Results:**
- January, March, May, July, August, October, December → 31
- April, June, September, November → 30
- February → 28 (or 29 in leap year)

---

### **Get First Day of Month**

```tsx
const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};
```

**Returns:**
- 0 = Sunday
- 1 = Monday
- 2 = Tuesday
- ...etc.

**Why needed:**
- To calculate how many empty cells needed at start of month in grid
- E.g.: If month starts on Thursday (4) → 3 empty cells (Mon, Tue, Wed)

---

### **Generate Calendar Days Array**

```tsx
const generateCaledarDays = () => {
  const days: (number | null)[] = [];
  const dayInMonth = getDayInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const emptyState = firstDay === 0 ? 6 : firstDay - 1;

  // Empty cells
  for (let i = 0; i < emptyState; i++) {
    days.push(null);
  }
  
  // Days
  for (let day = 1; day <= dayInMonth; day++) {
    days.push(day);
  }

  return days;
};
```

**How it works:**

1. **Calculate empty cells:**
   - If month starts Sunday (0) → 6 empty (grid starts Monday!)
   - If month starts Monday (1) → 0 empty
   - Other: `firstDay - 1`

2. **Fill array:**
   - First nulls (empty cells)
   - Then numbers 1 to 28/30/31

**Example - December 2025:**
- Starts Monday (1) → 0 empty
- Has 31 days
- Array: `[1, 2, 3, 4, 5, 6, 7, 8, ..., 30, 31]`

**Example - January 2026:**
- Starts Thursday (4) → 3 empty
- Has 31 days
- Array: `[null, null, null, 1, 2, 3, 4, ..., 31]`

---

### **Render Days**

```tsx
const renderDay = () => {
  const days = generateCaledarDays();

  return days.map((day, index) => {
    // Empty cell
    if (day === null) {
      return <div key={index} className={styles.emptyDay}></div>;
    }
    
    // Is today?
    const today = new Date();
    const isToday =
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear();

    // Is selected?
    const isSelected =
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear();

    return (
      <div
        key={index}
        className={`${styles.day} ${isToday ? styles.today : ""} ${
          isSelected ? styles.selectedDay : ""
        }`}
        onClick={() => handleDateSelect(day)}
      >
        {day}
      </div>
    );
  });
};
```

**Logic:**
1. **Map array** - `.map()` for each element
2. **Empty cells** - If `null` → empty div
3. **Today check** - All 3 (day, month, year) must match
4. **Selected check** - Compare with selectedDate
5. **CSS classes** - Dynamically adds `.today` and `.selectedDay`
6. **onClick** - Calls handleDateSelect

---

### **Handle Date Selection**

```tsx
const handleDateSelect = (day: number) => {
  const selected = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    day
  );
  
  setSelectedDate(selected);
  setIsOpen(false);
  
  if (onChange) {
    onChange(selected);
  }
};
```

**How it works:**
1. **Create full date** - Year and month from currentMonth, day from parameter
2. **Update state** - setSelectedDate(selected)
3. **Close popup** - setIsOpen(false)
4. **Notify parent** - Call onChange callback (if exists)

**Example:**
- User clicks "22"
- currentMonth = December 2025
- Creates: `new Date(2025, 11, 22)`
- selectedDate updates
- Input shows "22/12/2025"

---

## 🎨 Styling

### **Main Classes:**

```scss
.calendar          // Main container
.label             // Label text
.calendarWrapper   // Wrapper with position: relative
.dateInput         // Input field (for clicking)
.selectedText      // Selected date text
.icon              // 📅 icon
.calendarPopup     // Dropdown popup
.header            // Month name + navigation
.monthYear         // Month and year
.navButton         // ← → buttons
.weekdays          // Weekday grid
.weekDay           // Individual weekday
.daysGrid          // 7x6 grid for days
.day               // Individual day
.today             // Today (blue border)
.selectedDay       // Selected (blue background)
.emptyDay          // Empty cell
```

### **Grid Layout:**

```scss
.weekdays, .daysGrid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);  // 7 columns
  gap: 4px;
}

.day {
  aspect-ratio: 1;  // Square cells
}
```

---

## 🔧 Customization

### **1. Change month names:**
```tsx
const getMonthName = (date: Date): string => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months[date.getMonth()];
};
```

### **2. Change weekday names:**
```tsx
const renderWeekDay = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => (
    <div key={day} className={styles.weekDay}>{day}</div>
  ));
};
```

### **3. Change date format:**
```tsx
// DD/MM/YYYY format
return `${day}/${month}/${year}`;

// DD.MM.YYYY format
return `${day}.${month}.${year}`;

// YYYY-MM-DD format (ISO)
return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
```

### **4. Customize styles:**
SCSS variables in `Calendar.module.scss`:
- Colors
- border-radius
- font-size
- padding/margin
- animations

---

## ⚠️ Important Details

### **Button Type:**
```tsx
<button type="button" onClick={goToPreviousMonth}>
```
- **Must** have `type="button"`!
- If not → default `type="submit"` → form submission → page refresh

### **Key Props:**
```tsx
// Empty cells
<div key={`empty-${index}`}>

// Days
<div key={index}>
```
- React requires unique `key` for each element

### **TypeScript Types:**
```tsx
interface CalendarProps {
  label?: string;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date) => void;
}
```

---

## 📚 Examples

### **Use in Form:**
```tsx
<Calendar
  label="Birth Date"
  initialDate={new Date(1990, 0, 1)}
  onChange={(date) => console.log('Selected:', date)}
/>
```

### **With Min/Max Dates (future):**
```tsx
<Calendar
  label="Meeting Date"
  minDate={new Date()}  // From today
  maxDate={new Date(2025, 11, 31)}  // Until end of 2025
/>
```

---

## 🚀 Future Improvements

- ✅ Min/Max date validation
- ✅ Disabled days
- ✅ Range selection (from-to)
- ✅ Multiple month display
- ✅ Locale support (i18n)
- ✅ Keyboard navigation
- ✅ Accessibility (ARIA labels)

---

## 📝 License

MIT License - Free to use in personal and commercial projects.

---

## 👨‍💻 Author

Created for educational purposes - demonstrating React State Management and Custom Component development.
