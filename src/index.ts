import {
  DeleteRuleCommandInput,
  PutRuleCommandInput,
  PutTargetsCommandInput,
  RemoveTargetsCommandInput,
} from "@aws-sdk/client-cloudwatch-events";
import { CloudWatchEvents } from "aws-sdk";
import { Glue, Lambda } from "aws-sdk";
import { checkBigQueryTableExists } from "./bigquery";
const client = new CloudWatchEvents();

const removeParams: RemoveTargetsCommandInput = {
  Ids: ["Id for rule"],
  Rule: "Rule Name",
};
const deleteParams: DeleteRuleCommandInput = {
  Name: "Rule Name",
};
const createRuleParams: PutRuleCommandInput = {
  Name: "Rule Name",
  ScheduleExpression: `rate(5 minutes)`,
  State: "ENABLED",
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = async function handler(event, context) {
  try {
    await client.removeTargets(removeParams).promise();
    await client.deleteRule(deleteParams).promise();
  } catch (err) {
    console.log(err);
  }

  const tableExists = await checkBigQueryTableExists();
  if (tableExists) {
    const glue = new Glue();
    glue.startWorkflowRun({ Name: "Workflow Name" }).promise();
  } else {
    await client.putRule(createRuleParams).promise();
    const lambda = new Lambda();
    const data = await lambda
      .getFunctionConfiguration({ FunctionName: "Lambda Name Here" })
      .promise();
    const targetParams: PutTargetsCommandInput = {
      Rule: "Rule Name",
      Targets: [
        {
          Arn: data.FunctionArn,
          Id: "Id for Rule",
        },
      ],
    };
    await client.putTargets(targetParams).promise();
    return "resetting";
  }
  return "done";
};
