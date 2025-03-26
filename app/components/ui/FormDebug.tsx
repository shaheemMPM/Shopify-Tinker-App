import { Box, Card, InlineStack, Text } from "@shopify/polaris";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { isDeepEqual } from "remeda";

const FormDebug = ({ form }: { form: any }) => {
  const formData = form.useStore((state: any) => structuredClone(state));

  const isDirty = form.useStore(
    (state: any) => !isDeepEqual(state.values, form.options.defaultValues),
  );

  const isValid = form.useStore((state: any) => state.isValid);

  return (
    <Card>
      <Box paddingBlockEnd={"200"}>
        <InlineStack gap={"200"}>
          <Text as="p" variant="bodyMd" fontWeight="semibold">
            isDirty:{" "}
          </Text>
          <Text as="span" variant="bodyMd">
            {isDirty ? "true" : "false"}
          </Text>
        </InlineStack>
        <InlineStack gap={"200"}>
          <Text as="p" variant="bodyMd" fontWeight="semibold">
            isValid:{" "}
          </Text>
          <Text as="span" variant="bodyMd">
            {isValid ? "true" : "false"}
          </Text>
        </InlineStack>
      </Box>

      <Box>
        <div style={{ overflow: "scroll", maxHeight: "528px" }}>
          <JsonView
            data={formData}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
        </div>
      </Box>
    </Card>
  );
};

export default FormDebug;
