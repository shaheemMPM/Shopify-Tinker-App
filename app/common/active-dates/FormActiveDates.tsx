import {
  BlockStack,
  Card,
  Checkbox,
  FormLayout,
  InlineError,
  Text,
} from "@shopify/polaris";
import type { useForm } from "@tanstack/react-form";
import type { ZodValidator } from "@tanstack/zod-form-adapter";
import dayjs, { type Dayjs } from "dayjs";
import type { z } from "zod";

import CustomDatePicker from "app/components/ui/datetime-picker/DatePicker";
import CustomTimePicker from "app/components/ui/datetime-picker/TimePicker";
import type { activeDates } from "./active-dates.validator";

type ActiveDates = {
  activeDates: z.infer<typeof activeDates>;
};

type FormWithActiveDates = ReturnType<
  typeof useForm<ActiveDates, ZodValidator>
>;

type FormActiveDatesProps = {
  form: FormWithActiveDates;
};

const DISABLE_DATES_BEFORE = dayjs().subtract(1, "day");
const DISABLE_DATES_AFTER = dayjs().add(1, "year");

export function FormActiveDates({ form }: FormActiveDatesProps) {
  const endDateEnabled = form.useStore(
    (state) => state.values.activeDates?.endDateEnabled,
  );

  return (
    <Card>
      <FormLayout>
        <Text as="h1" fontWeight="semibold">
          Active dates
        </Text>
        <BlockStack gap="200" id="active-dates">
          <form.Field
            name="activeDates.startDate"
            children={(field) => (
              <FormLayout.Group>
                <CustomDatePicker
                  label="Start date"
                  selectedDate={dayjs(field.state.value)}
                  setSelectedDate={(newDate: Dayjs) => {
                    field.handleChange(newDate.toISOString());
                  }}
                  disableDatesAfter={DISABLE_DATES_AFTER}
                  disableDatesBefore={DISABLE_DATES_BEFORE}
                />
                <CustomTimePicker
                  label="Start Time"
                  setSelectedDate={(newDate: Dayjs) => {
                    field.handleChange(newDate.toISOString());
                  }}
                  selectedDate={dayjs(field.state.value)}
                />
              </FormLayout.Group>
            )}
          />

          <form.Field
            name="activeDates.endDateEnabled"
            children={(field) => (
              <Checkbox
                label="Set end date"
                checked={field.state.value}
                onChange={field.handleChange}
              />
            )}
          />

          <form.Field
            name="activeDates.endDate"
            children={(field) => (
              <FormLayout.Group>
                <CustomDatePicker
                  disabled={!endDateEnabled}
                  label="End date"
                  selectedDate={dayjs(field.state.value)}
                  setSelectedDate={(newDate: Dayjs) => {
                    field.handleChange(newDate.toISOString());
                  }}
                  disableDatesAfter={DISABLE_DATES_AFTER}
                  disableDatesBefore={DISABLE_DATES_BEFORE}
                />
                <CustomTimePicker
                  label="End Time"
                  setSelectedDate={(newDate: Dayjs) => {
                    field.handleChange(newDate.toISOString());
                  }}
                  selectedDate={dayjs(field.state.value)}
                  disabled={!endDateEnabled}
                />
                <InlineError
                  fieldID="activeDates.endDate"
                  message={field.state.meta.errors.join(",")}
                />
              </FormLayout.Group>
            )}
          />
        </BlockStack>
      </FormLayout>
    </Card>
  );
}
