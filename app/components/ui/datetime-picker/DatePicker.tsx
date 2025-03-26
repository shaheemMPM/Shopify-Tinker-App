import {
  Box,
  DatePicker,
  Icon,
  Popover,
  type Range,
  TextField,
} from "@shopify/polaris";
import { CalendarIcon } from "@shopify/polaris-icons";
import type { Dayjs } from "dayjs";
import { useCallback, useState } from "react";
import style from "./DatePicker.module.css";

const DATE_FORMAT = "YYYY-MM-DD";

interface Props {
  selectedDate: Dayjs;
  setSelectedDate: (newDate: Dayjs) => void;
  label?: string;
  disableDatesBefore?: Dayjs;
  disableDatesAfter?: Dayjs;
  disabled?: boolean;
}

export default function CustomDatePicker({
  selectedDate,
  setSelectedDate,
  label,
  disableDatesBefore,
  disableDatesAfter,
  disabled,
}: Props) {
  const [popoverActive, setPopoverActive] = useState<boolean>(false);

  const currentYear = selectedDate.year();
  const currentMonth = selectedDate.month();

  // used by the date picker internally,
  const [{ month, year }, setDate] = useState({
    month: currentMonth,
    year: currentYear,
  });

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );
  function handleDatePickerOnChange(date: Range) {
    const newStartDay = date.start.getDate();
    const newStartMonth = date.start.getMonth();
    const newStartYear = date.start.getFullYear();

    const newDate = selectedDate
      .set("date", newStartDay)
      .set("month", newStartMonth)
      .set("year", newStartYear);
    if (newDate.isValid()) setSelectedDate(newDate);
  }

  const activator = (
    <div className={style.datePicker}>
      <TextField
        disabled={disabled}
        type="date"
        value={selectedDate.format(DATE_FORMAT)}
        label={label}
        prefix={<Icon source={CalendarIcon} tone="subdued" />}
        autoComplete="off"
        onFocus={() => setPopoverActive(true)}
        onBlur={handleOnBlur}
        onChange={handleTextFieldOnChange}
      />
    </div>
  );

  function handleOnBlur() {
    if (disableDatesBefore) {
      if (
        selectedDate.isBefore(disableDatesBefore) ||
        selectedDate.isSame(disableDatesBefore, "day")
      ) {
        setSelectedDate(
          disableDatesBefore
            .set("hour", selectedDate.get("hour"))
            .set("minute", selectedDate.get("minute")),
        );
      }
    }
    if (disableDatesAfter) {
      if (
        selectedDate.isAfter(disableDatesAfter) ||
        selectedDate.isSame(disableDatesAfter, "day")
      ) {
        setSelectedDate(
          disableDatesAfter
            .set("hour", selectedDate.get("hour"))
            .set("minute", selectedDate.get("minute")),
        );
      }
    }
  }

  function handleTextFieldOnChange(newValue: string) {
    const [year, month, day] = newValue.split("-").map(Number);
    const newDate = selectedDate
      .set("y", year)
      .set("month", month - 1) // january is 0
      .set("date", day);

    if (newDate.isValid()) setSelectedDate(newDate);
  }

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
      preferredAlignment="left"
      preferredPosition="below"
    >
      <Box padding={"400"}>
        <DatePicker
          month={month}
          year={year}
          onChange={handleDatePickerOnChange}
          onMonthChange={(month, year) => setDate({ month, year })}
          selected={selectedDate.toDate()}
          disableDatesBefore={disableDatesBefore?.toDate()}
          disableDatesAfter={disableDatesAfter?.toDate()}
        />
      </Box>
    </Popover>
  );
}
