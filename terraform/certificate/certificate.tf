provider "aws" {
  alias = "virginia"
  region = "us-east-1"
}

resource "aws_acm_certificate" "ssl" {
    domain_name                 = var.zone_name
    subject_alternative_names   = ["www.${var.zone_name}"]
    validation_method           = "DNS"
    provider                    = aws.virginia
    lifecycle {
        create_before_destroy = true
    }
}

output "acm_certificate_arn" {
    value = aws_acm_certificate.ssl.arn
}

output "acm_certificate_domain_validation_options" {
    value = aws_acm_certificate.ssl.domain_validation_options
}
