resource "aws_s3_bucket" "frontend" {
    bucket = "${var.name}"
    force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "frontend_ownership" {
    bucket = aws_s3_bucket.frontend.id
    rule {
        object_ownership = "BucketOwnerPreferred"
    }
}

resource "aws_s3_bucket_public_access_block" "frontend_access_block" {
    bucket = aws_s3_bucket.frontend.id
    block_public_acls       = false
    block_public_policy     = false
    ignore_public_acls      = false
    restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "frontend_acl" {
    depends_on  = [ 
        aws_s3_bucket_ownership_controls.frontend_ownership,
        aws_s3_bucket_public_access_block.frontend_access_block
    ]
    bucket      = aws_s3_bucket.frontend.id
    acl         = "public-read"
}

resource "aws_s3_bucket_policy" "frontend_policy" {
    depends_on = [ aws_s3_bucket_acl.frontend_acl ]
    bucket = aws_s3_bucket.frontend.id

    policy = jsonencode({
        Version = "2012-10-17",
        Statement = [
            {
                Sid       = "PublicGetObject",
                Effect    = "Allow",
                Principal = {
                    Service = "cloudfront.amazonaws.com"
                },
                Action    = "s3:*",
                Resource  = "${aws_s3_bucket.frontend.arn}/*"
                Condition = {
                    StringEquals = {
                        "AWS:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
                    }
                }
            },
        ]
    })
}

resource "aws_s3_bucket_website_configuration" "frontend_website_config" {
    bucket = aws_s3_bucket.frontend.id
    index_document {
        suffix = "index.html"
    }
}

resource "aws_s3_object" "code" {
    depends_on = [ aws_s3_bucket_policy.frontend_policy ]
    for_each = { for f in fileset("${path.module}/../../dist", "**") : f => {
        path = f
        type = lookup(local.mime_types, lower(split(".", f)[length(split(".", f))-1]), "application/octet-stream")
    }}
    bucket   = aws_s3_bucket.frontend.bucket
    content_type = each.value.type
    key      = each.value.path
    source   = "${path.module}/../../dist/${each.value.path}"
    etag     = filemd5("${path.module}/../../dist/${each.value.path}")
    acl      = "public-read"
}

locals {
    s3_origin_id   = "${aws_s3_bucket.frontend.id}-origin"
    s3_domain_name = "${aws_s3_bucket.frontend.id}.s3-website.${var.region}.amazonaws.com"
    mime_types = {
        "html" = "text/html"
        "css"  = "text/css"
        "js"   = "application/javascript"
        "png"  = "image/png"
        "jpg"  = "image/jpeg"
        "gif"  = "image/gif"
        "svg"  = "image/svg+xml"
        "json" = "application/json"
    }
}

resource "aws_cloudfront_distribution" "s3_distribution" {
    origin {
        custom_origin_config {
            http_port                = 80
            https_port               = 443
            origin_protocol_policy   = "http-only"
            origin_ssl_protocols     = ["TLSv1", "TLSv1.1", "TLSv1.2"]
        }
        domain_name                 = local.s3_domain_name
        origin_id                   = local.s3_origin_id
    }

    default_cache_behavior {
        allowed_methods     = ["GET", "HEAD"]
        cached_methods      = ["GET", "HEAD"]
        target_origin_id    = local.s3_origin_id
        forwarded_values {
            query_string = false
            cookies {
                forward = "none"
            }
        }
        viewer_protocol_policy = "redirect-to-https"
    }

    custom_error_response {
        error_caching_min_ttl = 0
        error_code            = 404
        response_code         = 200
        response_page_path    = "/index.html"
    }

    viewer_certificate {
        #cloudfront_default_certificate = true
        acm_certificate_arn = var.acm_certificate_arn
        ssl_support_method  = "sni-only"
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }
    
    default_root_object = "index.html"
    aliases = [ "${var.zone_name}", "www.${var.zone_name}" ]
    enabled = true
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.s3_distribution.id
}
