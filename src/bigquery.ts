import { BigQuery } from "@google-cloud/bigquery";

export const checkBigQueryTableExists = async () => {
  const bigQueryClient = new BigQuery({
    projectId: "id here",
    credentials: {
      client_email: "email",
      private_key: "key",
    },
  });
  const dataset = bigQueryClient.dataset("data set id");
  const table = dataset.table("table Id");
  try {
    await table.get();
    return true;
  } catch (e) {
    if (e.code === 404) {
      return false;
    } else {
      throw new Error(e);
    }
  }
};
