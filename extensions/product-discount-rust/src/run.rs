use shopify_function::prelude::*;
use shopify_function::Result;

#[shopify_function_target(query_path = "src/run.graphql", schema_path = "schema.graphql")]
fn run(input: input::ResponseData) -> Result<output::FunctionRunResult> {
    let no_discount = output::FunctionRunResult {
        discounts: vec![],
        discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
    };

    let targets = input
        .cart
        .lines
        .iter()
        .filter(|line| line.quantity >= 2)
        .map(|line| {
            output::Target::CartLine(output::CartLineTarget {
                id: line.id.to_string(),
                quantity: None,
            })
        })
        .collect::<Vec<output::Target>>();
    if targets.is_empty() {
        eprintln!("No cart lines qualify for volume discount.");
        return Ok(no_discount);
    }

    Ok(output::FunctionRunResult {
        discounts: vec![output::Discount {
            message: None,
            targets,
            value: output::Value::Percentage(output::Percentage {
                value: Decimal(10.0),
            }),
        }],
        discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
    })
}
