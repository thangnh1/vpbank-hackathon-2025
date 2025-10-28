output "guardduty_detector_id" {
  description = "Identifier of the GuardDuty detector"
  value       = aws_guardduty_detector.this.id
}

output "config_recorder_name" {
  description = "Name of the AWS Config recorder"
  value       = aws_config_configuration_recorder.this.name
}

output "cloudfront_distribution_id" {
  description = "Identifier of the optional CloudFront distribution"
  value       = local.waf_enabled ? aws_cloudfront_distribution.this[0].id : null
}
