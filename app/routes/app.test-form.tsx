import {
  BlockStack,
  Button,
  Card,
  FooterHelp,
  Layout,
  Page,
} from "@shopify/polaris";
import { useForm } from "@tanstack/react-form";
import { type ZodValidator, zodValidator } from "@tanstack/zod-form-adapter";
import { FormActiveDates } from "app/common/active-dates/FormActiveDates";
import dayjs from "dayjs";
import { z } from "zod";
import { activeDates } from "app/common/active-dates/active-dates.validator";
import { FormDiscountCombinations } from "app/common/discount-combinations/FormDiscountCombinations";
import { discountCombinations } from "app/common/discount-combinations/discount-combinations.validator";
import { FormPurchaseType } from "app/common/purchase-type/FormPurchaseType";
import {
  PurchaseType,
  purchaseType,
} from "app/common/purchase-type/purchase-type.validator";

export const multiValueValidator = z.object({
  purchaseType,
  discountCombinations,
  activeDates,
});

export const multiValueSubmitValidator = z.object({
  purchaseType,
  discountCombinations,
  activeDates,
});

export type MultiValueValidator = z.infer<typeof multiValueValidator>;

const INITIAL_START_DATE = dayjs().toISOString();
const INITIAL_END_DATE = dayjs().add(10, "days").toISOString();

const DEFAULT_VALUES: MultiValueValidator = {
  purchaseType: PurchaseType.ONE_TIME,
  discountCombinations: {
    product: false,
    order: false,
    shipping: false,
  },
  activeDates: {
    startDate: INITIAL_START_DATE,
    endDateEnabled: false,
    endDate: INITIAL_END_DATE,
  },
};

export default function TestForm() {
  const form = useForm<MultiValueValidator, ZodValidator>({
    validatorAdapter: zodValidator(),
    defaultValues: DEFAULT_VALUES,
    validators: {
      onChange: multiValueValidator,
      onSubmit: multiValueSubmitValidator,
    },
    onSubmitInvalid: () => {
      alert("Please correct the errors in the form.");
    },
    onSubmit: ({ value }) => {
      console.log("form submitted with value: ", value);
    },
  });

  return (
    <Page
      title="Test form"
      primaryAction={
        <Button variant="primary" onClick={form.handleSubmit}>
          Submit
        </Button>
      }
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap={"400"}>
            <FormPurchaseType form={form as any} />
            <FormDiscountCombinations form={form as any} />
            <FormActiveDates form={form as any} />
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <div style={{ overflow: "scroll", maxHeight: "575px" }}>
              <pre>{JSON.stringify(form, null, 2)}</pre>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
      <FooterHelp />
    </Page>
  );
}
