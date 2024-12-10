variable "tag" {}
variable "owner" {}
variable "environment" {}
variable "service_name" {}
variable "aws_account" {}
variable "aws_region" {}

terraform {
    backend "s3" {
        encrypt = true
    }
}

provider "aws" {
    region = var.aws_region
}

module "certificate" {
    source          = "./terraform/certificate"
    zone_name       = "sociate.ai"
}

module "cds" {
    source               = "./terraform/cds"
    region               = var.aws_region
    name                 = "${var.owner}.${var.service_name}-${var.environment}"
    zone_name            = "sociate.ai"
    tag                  = var.tag
    acm_certificate_arn  = module.certificate.acm_certificate_arn
}

module "domain" {
    source                                      = "./terraform/domain"
    name                                        = "${var.owner}-${var.environment}-${var.service_name}"
    tag                                         = var.tag
    zone_name                                   = "sociate.ai"
    cloudfront_domain                           = module.cds.cloudfront_domain
    acm_certificate_arn                         = module.certificate.acm_certificate_arn
    acm_certificate_domain_validation_options   = module.certificate.acm_certificate_domain_validation_options
}


module "cache" {
    depends_on      = [ module.cds, module.domain ]
    source          = "./terraform/cache"
    tag             = var.tag
    distribution_id = module.cds.cloudfront_distribution_id
}
