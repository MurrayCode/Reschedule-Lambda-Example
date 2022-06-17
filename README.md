# Example of Reschedule Lambda

The Problem:
You want a lambda to trigger an ingestion via an AWS Glue workflow of data from a source outside of AWS.
The data can be available any time between hours X and Y but you need to ingest as soon as possible.
