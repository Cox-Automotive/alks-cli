# You can grab one from the awsalks account's SSM parameter store and pass it into `terraform apply` with the -var flag
variable "pagerduty_api_key" {
  description = "Token with permission to create and manage pagerduty services for Cloud Railway"
  type = string
}

provider "pagerduty" {
  token = var.pagerduty_api_key
}

locals {
  app_name = "alks cli"
  environment = "prod"
  ciid = "CI2355950"
}

module "pagerduty" {
  source               = "git::ssh://git@ghe.coxautoinc.com/ETS-CloudAutomation/cloud-railway-operations//terraform_modules/pagerduty?ref=v1.4.2"
  application_name     = local.app_name
  environment          = local.environment
  escalation_policy    = "Cloud Railway Escalation"
  service_dependencies = ["alks prod"]
  CIID                 = local.ciid
}