terraform {
  backend "s3" {
    bucket         = "btk5h-terraform-states"
    key            = "costco-bot"
    region         = "us-west-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
