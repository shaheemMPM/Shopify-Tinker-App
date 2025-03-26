import { BlockStack, Card, Checkbox, FormLayout, Text } from "@shopify/polaris";
import type { useForm } from "@tanstack/react-form";
import type { ZodValidator } from "@tanstack/zod-form-adapter";
import type { z } from "zod";
import type { discountCombinations } from "./discount-combinations.validator";

type DiscountCombinations = {
  discountCombinations: z.infer<typeof discountCombinations>;
};

type FormWithDiscountCombinations = ReturnType<
  typeof useForm<DiscountCombinations, ZodValidator>
>;

type FormDiscountCombinationsProps = {
  form: FormWithDiscountCombinations;
};

export function FormDiscountCombinations({
  form,
}: FormDiscountCombinationsProps) {
  return (
    <Card>
      <FormLayout>
        <BlockStack gap="200" id="combinations">
          <Text as="h1" fontWeight="semibold">
            Combinations
          </Text>
          <Text as="p">This order discount can be combined with:</Text>
          <form.Field
            name="discountCombinations.product"
            children={(field) => (
              <Checkbox
                label="Product discounts"
                checked={field.state.value}
                onChange={field.handleChange}
              />
            )}
          />
          <form.Field
            name="discountCombinations.order"
            children={(field) => (
              <Checkbox
                label="Order discounts"
                checked={field.state.value}
                onChange={field.handleChange}
              />
            )}
          />
          <form.Field
            name="discountCombinations.shipping"
            children={(field) => (
              <Checkbox
                label="Shipping discounts"
                checked={field.state.value}
                onChange={field.handleChange}
              />
            )}
          />
        </BlockStack>
      </FormLayout>
    </Card>
  );
}
