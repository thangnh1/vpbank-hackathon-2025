data "aws_region" "current" {}
data "aws_partition" "current" {}

locals {
  base_tags = merge(
    {
      Environment = var.environment
      Module      = "serverless_app"
    },
    var.tags
  )
}

# Package for the ingestion Lambda (creates a lightweight inline handler)
data "archive_file" "ingestion" {
  type        = "zip"
  output_path = "${path.module}/build/lambda_ingestion.zip"

  source {
    content  = <<-PYTHON
      import json

      def lambda_handler(event, context):
          message = event.get("body") if isinstance(event, dict) else str(event)
          return {
              "statusCode": 200,
              "body": json.dumps({"message": "ingestion stub", "payload": message}),
          }
    PYTHON
    filename = "handler.py"
  }
}

# Package for the processing Lambda that drains the queue
data "archive_file" "processing" {
  type        = "zip"
  output_path = "${path.module}/build/lambda_processing.zip"

  source {
    content  = <<-PYTHON
      import json

      def lambda_handler(event, context):
          records = event.get("Records", []) if isinstance(event, dict) else []
          return {
              "statusCode": 200,
              "body": json.dumps({"processed_records": len(records)}),
          }
    PYTHON
    filename = "handler.py"
  }
}

# Dedicated security group granting egress-only access from the Lambda functions
resource "aws_security_group" "lambda" {
  name        = "${var.name}-${var.environment}-lambda-sg"
  description = "Egress-only security group for serverless Lambdas"
  vpc_id      = var.vpc_id

  egress {
    description      = "Allow outbound access for service integrations"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-lambda-sg"
  })
}

# Queue buffering inbound requests before processing
resource "aws_sqs_queue" "ingestion" {
  name                       = var.queue_name
  visibility_timeout_seconds = 60
  message_retention_seconds  = 345600
  sqs_managed_sse_enabled    = true

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-ingestion-queue"
  })
}

# Kinesis data stream handling real-time ingestion events
resource "aws_kinesis_stream" "ingestion_stream" {
  name              = var.kinesis_stream_name
  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }
  retention_period = 24

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-ingestion-stream"
  })
}

# Trust policy reused by both Lambda roles
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# Role used by the ingestion Lambda
resource "aws_iam_role" "lambda_ingestion" {
  name               = "${var.name}-${var.environment}-ingestion-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-ingestion-role"
  })
}

# Role used by the processing Lambda
resource "aws_iam_role" "lambda_processing" {
  name               = "${var.name}-${var.environment}-processing-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-processing-role"
  })
}

# Managed policy attachment with VPC networking and default logging permissions
resource "aws_iam_role_policy_attachment" "ingestion_vpc" {
  role       = aws_iam_role.lambda_ingestion.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "processing_vpc" {
  role       = aws_iam_role.lambda_processing.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Policy document granting ingestion Lambda least-privilege access
data "aws_iam_policy_document" "lambda_ingestion" {
  statement {
    sid     = "LambdaLogging"
    effect  = "Allow"
    actions = ["logs:CreateLogGroup"]
    resources = ["*"]
  }

  statement {
    sid     = "LambdaLogStreams"
    effect  = "Allow"
    actions = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = [
      "arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.name}:*:log-group:/aws/lambda/*"
    ]
  }

  statement {
    sid     = "QueueSend"
    effect  = "Allow"
    actions = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.ingestion.arn]
  }

  statement {
    sid     = "KinesisPut"
    effect  = "Allow"
    actions = ["kinesis:PutRecord", "kinesis:PutRecords"]
    resources = [aws_kinesis_stream.ingestion_stream.arn]
  }
}

resource "aws_iam_policy" "lambda_ingestion" {
  name   = "${var.name}-${var.environment}-ingestion-policy"
  policy = data.aws_iam_policy_document.lambda_ingestion.json
}

resource "aws_iam_role_policy_attachment" "lambda_ingestion_custom" {
  role       = aws_iam_role.lambda_ingestion.name
  policy_arn = aws_iam_policy.lambda_ingestion.arn
}

# Policy document granting processing Lambda least-privilege access
data "aws_iam_policy_document" "lambda_processing" {
  statement {
    sid     = "LambdaLogging"
    effect  = "Allow"
    actions = ["logs:CreateLogGroup"]
    resources = ["*"]
  }

  statement {
    sid     = "LambdaLogStreams"
    effect  = "Allow"
    actions = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = [
      "arn:${data.aws_partition.current.partition}:logs:${data.aws_region.current.name}:*:log-group:/aws/lambda/*"
    ]
  }

  statement {
    sid     = "QueueConsume"
    effect  = "Allow"
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "sqs:ChangeMessageVisibility"
    ]
    resources = [aws_sqs_queue.ingestion.arn]
  }

  statement {
    sid     = "DynamoWrite"
    effect  = "Allow"
    actions = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:BatchWriteItem"
    ]
    resources = [var.ledger_table_arn]
  }

  statement {
    sid     = "DataLakeAccess"
    effect  = "Allow"
    actions = ["s3:PutObject", "s3:GetObject"]
    resources = [
      "${var.data_lake_bucket_arn}/*"
    ]
  }

  statement {
    sid     = "DataLakeList"
    effect  = "Allow"
    actions = ["s3:ListBucket"]
    resources = [var.data_lake_bucket_arn]
  }

  statement {
    sid     = "KinesisRead"
    effect  = "Allow"
    actions = [
      "kinesis:GetRecords",
      "kinesis:GetShardIterator",
      "kinesis:DescribeStream",
      "kinesis:ListShards"
    ]
    resources = [aws_kinesis_stream.ingestion_stream.arn]
  }
}

resource "aws_iam_policy" "lambda_processing" {
  name   = "${var.name}-${var.environment}-processing-policy"
  policy = data.aws_iam_policy_document.lambda_processing.json
}

resource "aws_iam_role_policy_attachment" "lambda_processing_custom" {
  role       = aws_iam_role.lambda_processing.name
  policy_arn = aws_iam_policy.lambda_processing.arn
}

# Lambda responsible for ingesting API traffic
resource "aws_lambda_function" "ingestion" {
  function_name = "${var.name}-${var.environment}-ingestion-fn"
  role          = aws_iam_role.lambda_ingestion.arn
  runtime       = "python3.11"
  handler       = "handler.lambda_handler"
  filename         = data.archive_file.ingestion.output_path
  source_code_hash = data.archive_file.ingestion.output_base64sha256
  timeout          = 10
  memory_size      = 256

  vpc_config {
    subnet_ids         = var.app_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      QUEUE_URL   = aws_sqs_queue.ingestion.url
      STREAM_NAME = aws_kinesis_stream.ingestion_stream.name
    }
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-ingestion-fn"
  })
}

# Lambda that processes queued requests and persists results
resource "aws_lambda_function" "processing" {
  function_name = "${var.name}-${var.environment}-processing-fn"
  role          = aws_iam_role.lambda_processing.arn
  runtime       = "python3.11"
  handler       = "handler.lambda_handler"
  filename         = data.archive_file.processing.output_path
  source_code_hash = data.archive_file.processing.output_base64sha256
  timeout          = 30
  memory_size      = 512

  vpc_config {
    subnet_ids         = var.app_subnet_ids
    security_group_ids = [aws_security_group.lambda.id]
  }

  environment {
    variables = {
      LEDGER_TABLE_NAME = var.ledger_table_name
      DATA_LAKE_BUCKET  = var.data_lake_bucket_name
      QUEUE_URL         = aws_sqs_queue.ingestion.url
      STREAM_NAME       = aws_kinesis_stream.ingestion_stream.name
    }
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-processing-fn"
  })
}

# Event source mapping connects the queue to the processing Lambda
resource "aws_lambda_event_source_mapping" "sqs" {
  event_source_arn = aws_sqs_queue.ingestion.arn
  function_name    = aws_lambda_function.processing.arn
  batch_size       = 10
  enabled          = true
}

# Event source mapping connecting Kinesis stream to the processing Lambda
resource "aws_lambda_event_source_mapping" "kinesis" {
  event_source_arn  = aws_kinesis_stream.ingestion_stream.arn
  function_name     = aws_lambda_function.processing.arn
  starting_position = "LATEST"
  batch_size        = 100
  enabled           = true
}

# Scheduled rule kicking off periodic processing
resource "aws_cloudwatch_event_rule" "processing" {
  name                = "${var.name}-${var.environment}-processing-schedule"
  schedule_expression = var.processing_schedule_expression

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-processing-schedule"
  })
}

# EventBridge target hooking the scheduled rule to the processing Lambda
resource "aws_cloudwatch_event_target" "processing" {
  rule      = aws_cloudwatch_event_rule.processing.name
  target_id = "processing-lambda"
  arn       = aws_lambda_function.processing.arn
}

# Permission allowing EventBridge to invoke the processing Lambda
resource "aws_lambda_permission" "eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.processing.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.processing.arn
}

# REST API exposing the ingestion endpoint
resource "aws_api_gateway_rest_api" "api" {
  name        = "${var.name}-${var.environment}-api"
  description = "REST API entrypoint for ingestion"

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-api"
  })
}

# /ingest resource path
resource "aws_api_gateway_resource" "ingest" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "ingest"
}

# Method definition allowing public POST access
resource "aws_api_gateway_method" "ingest_post" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.ingest.id
  http_method   = "POST"
  authorization = "NONE"
}

# Lambda proxy integration for ingestion
resource "aws_api_gateway_integration" "ingest" {
  rest_api_id             = aws_api_gateway_rest_api.api.id
  resource_id             = aws_api_gateway_resource.ingest.id
  http_method             = aws_api_gateway_method.ingest_post.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.ingestion.invoke_arn
}

# Permit API Gateway to invoke the ingestion Lambda
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ingestion.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}

# Deployment package for the REST API
resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.api.id

  triggers = {
    redeploy = sha1(jsonencode([
      aws_api_gateway_resource.ingest.id,
      aws_api_gateway_method.ingest_post.id,
      aws_api_gateway_integration.ingest.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [aws_api_gateway_integration.ingest]
}

# Stage exposing the API deployment
resource "aws_api_gateway_stage" "this" {
  rest_api_id   = aws_api_gateway_rest_api.api.id
  deployment_id = aws_api_gateway_deployment.this.id
  stage_name    = var.environment

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-api-stage"
  })
}

# Trust policy for the optional Step Functions state machine
data "aws_iam_policy_document" "step_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["states.${data.aws_region.current.name}.amazonaws.com"]
    }
  }
}

# IAM role granting Step Functions permission to invoke the processing Lambda
resource "aws_iam_role" "state_machine" {
  count              = var.enable_step_function ? 1 : 0
  name               = "${var.name}-${var.environment}-workflow-role"
  assume_role_policy = data.aws_iam_policy_document.step_assume_role.json

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-workflow-role"
  })
}

data "aws_iam_policy_document" "state_machine" {
  statement {
    sid     = "InvokeProcessingLambda"
    effect  = "Allow"
    actions = ["lambda:InvokeFunction"]
    resources = [aws_lambda_function.processing.arn]
  }
}

resource "aws_iam_policy" "state_machine" {
  count  = var.enable_step_function ? 1 : 0
  name   = "${var.name}-${var.environment}-workflow-policy"
  policy = data.aws_iam_policy_document.state_machine.json
}

resource "aws_iam_role_policy_attachment" "state_machine" {
  count      = var.enable_step_function ? 1 : 0
  role       = aws_iam_role.state_machine[0].name
  policy_arn = aws_iam_policy.state_machine[0].arn
}

# State machine orchestrating downstream processing (optional)
resource "aws_sfn_state_machine" "processing" {
  count = var.enable_step_function ? 1 : 0

  name     = "${var.name}-${var.environment}-processing-sm"
  role_arn = aws_iam_role.state_machine[0].arn

  definition = jsonencode({
    Comment = "Orchestrate processing of queued messages"
    StartAt = "InvokeProcessing"
    States = {
      InvokeProcessing = {
        Type     = "Task"
        Resource = "arn:aws:states:::lambda:invoke"
        Parameters = {
          FunctionName = aws_lambda_function.processing.arn
        }
        End = true
      }
    }
  })

  tags = merge(local.base_tags, {
    Name = "${var.name}-${var.environment}-processing-sm"
  })
}
