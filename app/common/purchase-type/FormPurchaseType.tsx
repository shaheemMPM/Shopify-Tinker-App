import { BlockStack, Card, RadioButton, Text } from "@shopify/polaris";
import type { useForm } from "@tanstack/react-form";
import type { ZodValidator } from "@tanstack/zod-form-adapter";
import type { z } from "zod";
import {
  PurchaseType as PurchaseTypeEnum,
  type purchaseType,
} from "./purchase-type.validator";

type PurchaseType = {
  purchaseType: z.infer<typeof purchaseType>;
};

type FormWithPurchaseType = ReturnType<
  typeof useForm<PurchaseType, ZodValidator>
>;

type PurchaseTypeSectionProps = {
  form: FormWithPurchaseType;
};

export function FormPurchaseType({ form }: PurchaseTypeSectionProps) {
  return (
    <Card>
      <BlockStack gap="300" id="purchase-type">
        <Text as="h1" fontWeight="semibold">
          Purchase type
        </Text>
        <form.Field
          name="purchaseType"
          children={(field) => (
            <BlockStack>
              <RadioButton
                label="One-time purchase"
                checked={field.state.value === PurchaseTypeEnum.ONE_TIME}
                name="purchaseType"
                onChange={() => field.handleChange(PurchaseTypeEnum.ONE_TIME)}
              />
              <RadioButton
                label="Subscription"
                checked={field.state.value === PurchaseTypeEnum.SUBSCRIPTION}
                name="purchaseType"
                onChange={() =>
                  field.handleChange(PurchaseTypeEnum.SUBSCRIPTION)
                }
              />
              <RadioButton
                label="Both"
                checked={field.state.value === PurchaseTypeEnum.BOTH}
                name="purchaseType"
                onChange={() => field.handleChange(PurchaseTypeEnum.BOTH)}
              />
            </BlockStack>
          )}
        />
      </BlockStack>
    </Card>
  );
}
