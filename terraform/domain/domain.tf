data "aws_route53_zone" "public" {
  name         = var.zone_name
  private_zone = false
}

resource "aws_route53_record" "cert_validation" {
  allow_overwrite = true
  for_each = {
    for dvo in var.acm_certificate_domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }
  ttl             = 60
  name            = each.value.name
  records         = [ each.value.record ]
  type            = each.value.type
  zone_id         = data.aws_route53_zone.public.zone_id
}

resource "aws_route53_record" "domain_record_www" {
  zone_id = data.aws_route53_zone.public.zone_id
  ttl     = 60
  name    = "www.${var.zone_name}"
  type    = "CNAME"
  records = [ var.cloudfront_domain ]
}
