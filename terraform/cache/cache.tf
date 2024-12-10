resource "terraform_data" "cache_invalidation" {
    triggers_replace = [
        var.tag
    ]
    provisioner "local-exec" {
        command = <<EOF
        INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id ${var.distribution_id} --paths '/*' --query 'Invalidation.Id' --output text)
        echo "Waiting for invalidation $INVALIDATION_ID to complete..."
        aws cloudfront wait invalidation-completed --distribution-id ${var.distribution_id} --id $INVALIDATION_ID
        EOF
    }
}
