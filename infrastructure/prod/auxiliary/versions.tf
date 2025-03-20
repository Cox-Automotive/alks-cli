terraform {
  required_version = ">= 1.5.3, < 2"

  required_providers {
    pagerduty = {
      source  = "pagerduty/pagerduty"
      version = ">= 2.15, < 3"
    }
  }
}