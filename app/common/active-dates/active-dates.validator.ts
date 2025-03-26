import { z } from "zod";

export const activeDates = z
  .object({
    startDate: z.string().datetime({ message: "Invalid start date format" }),
    endDateEnabled: z.boolean(),
    endDate: z.string().datetime({ message: "Invalid end date format" }),
  })
  .refine(
    (data) => {
      if (data.endDateEnabled) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return endDate > startDate;
      }
      return true;
    },
    {
      message: "End date must be after the start date when enabled",
      path: ["endDate"],
    },
  );
