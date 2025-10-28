# locals {
#   base_tags = merge(
#     {
#       Environment = var.environment
#       Module      = "ml"
#     },
#     var.tags
#   )
# }

# # Execution role future SageMaker endpoints can assume
# resource "aws_iam_role" "sagemaker_execution" {
#   name               = "${var.name}-${var.environment}-sagemaker-exec"
#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Action = "sts:AssumeRole"
#       Effect = "Allow"
#       Principal = {
#         Service = "sagemaker.amazonaws.com"
#       }
#     }]
#   })

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-sagemaker-exec"
#   })
# }

# # Baseline permissions enabling model containers to write logs and metrics
# resource "aws_iam_role_policy" "sagemaker_logging" {
#   name = "${var.name}-${var.environment}-sagemaker-logging"
#   role = aws_iam_role.sagemaker_execution.id

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid    = "CloudWatchLogs"
#         Effect = "Allow"
#         Action = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:PutLogEvents"
#         ]
#         Resource = "arn:aws:logs:*:*:log-group:/aws/sagemaker/*"
#       },
#       {
#         Sid    = "Metrics"
#         Effect = "Allow"
#         Action = [
#           "cloudwatch:PutMetricData"
#         ]
#         Resource = "*"
#       }
#     ]
#   })
# }

# # Policy granting callers the ability to invoke the future SageMaker endpoint
# resource "aws_iam_policy" "invoke_endpoint" {
#   name = "${var.name}-${var.environment}-invoke-ml-endpoint"

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Sid    = "InvokeEndpoint"
#       Effect = "Allow"
#       Action = [
#         "sagemaker:InvokeEndpoint"
#       ]
#       Resource = "arn:aws:sagemaker:*:*:endpoint/${var.sagemaker_endpoint_name}"
#     }]
#   })

#   tags = merge(local.base_tags, {
#     Name = "${var.name}-${var.environment}-invoke-ml-endpoint"
#   })
# }
