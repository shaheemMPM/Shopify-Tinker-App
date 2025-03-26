import { Autocomplete } from '@shopify/polaris'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import styles from './TimePicker.module.css'

interface Props {
  selectedDate: Dayjs
  setSelectedDate: (newDate: Dayjs) => void
  label?: string
  disabled?: boolean
}

export default function CustomTimePicker({
  selectedDate,
  setSelectedDate,
  label,
  disabled,
}: Props) {
  const time = selectedDate.format('h:mm A')

  const timeSlots = useMemo(() => {
    const times = []
    const start = 0 // starting from 12:00 AM
    const end = 24 * 60 // ending at 11:30 PM in minutes (24 hours * 60 minutes)

    const currentTime = dayjs()
    const isToday = selectedDate.isSame(currentTime, 'day')

    for (let minutes = start; minutes < end; minutes += 30) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      const time = `${hours === 0 || hours === 12 ? 12 : hours % 12}:${mins === 0 ? '00' : mins} ${hours < 12 ? 'AM' : 'PM'}`

      // Skip times in the past if selected date is today
      if (isToday) {
        const slotTime = selectedDate.hour(hours).minute(mins)
        if (slotTime.isBefore(currentTime)) {
          continue
        }
      }

      times.push(time)
    }

    return times.map((slot) => ({ label: slot, value: slot }))
  }, [selectedDate])

  const handleTextFieldChange = (newValue: string) => {
    const [hour, minute] = newValue.split(':').map(Number)
    const newDate = selectedDate.set('hour', hour).set('minute', minute)

    const now = dayjs()

    if (selectedDate.isSame(now, 'day')) {
      // converts both times to timestamps
      const newTimestamp = newDate.unix()
      const currentTimestamp = now.unix()

      // if the new time is more than 1 minute in the past
      if (newTimestamp < currentTimestamp - 60) {
        return
      }
    }

    if (newDate.isValid()) {
      setSelectedDate(newDate)
    }
  }

  return (
    <Autocomplete
      options={timeSlots}
      selected={[time]}
      onSelect={([selected]) => {
        const [time, modifier] = selected.split(' ')
        const [hours, minutes] = time.split(':').map(Number)

        let newHours = modifier === 'PM' && hours !== 12 ? hours + 12 : hours
        newHours = modifier === 'AM' && hours === 12 ? 0 : newHours
        const newTime = selectedDate.hour(newHours).minute(minutes).second(0)
        if (newTime.isValid()) setSelectedDate(newTime)
      }}
      preferredPosition="below"
      textField={
        <div className={styles.timePicker}>
          <Autocomplete.TextField
            type="time"
            label={label}
            disabled={disabled}
            autoComplete="off"
            onChange={handleTextFieldChange}
            value={selectedDate.format('HH:mm')}
          />
        </div>
      }
    />
  )
}
