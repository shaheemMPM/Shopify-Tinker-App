import { z } from "zod";

export enum PurchaseType {
  ONE_TIME = "one_time",
  SUBSCRIPTION = "subscription",
  BOTH = "both",
}

export const purchaseType = z.nativeEnum(PurchaseType);
