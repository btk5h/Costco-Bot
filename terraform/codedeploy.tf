variable "github_oauth_token" {}

resource "aws_codedeploy_app" "bot" {
  name = "costco-bot"
}

resource "aws_codedeploy_deployment_group" "bot" {
  app_name               = "${aws_codedeploy_app.bot.name}"
  deployment_group_name  = "Production"
  service_role_arn       = "${aws_iam_role.codedeploy.arn}"
  deployment_config_name = "CodeDeployDefault.AllAtOnce"

  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = "${aws_codedeploy_app.bot.name}"
    }
  }
}

resource "aws_s3_bucket" "codepipeline_artifacts" {}

resource "aws_codepipeline" "bot" {
  name     = "${aws_codedeploy_app.bot.name}"
  role_arn = "${aws_iam_role.codepipeline.arn}"

  artifact_store {
    location = "${aws_s3_bucket.codepipeline_artifacts.bucket}"
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["SourceArtifact"]

      configuration {
        Owner      = "btk5h"
        Repo       = "Costco-Bot"
        Branch     = "master"
        OAuthToken = "${var.github_oauth_token}"
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name            = "Deploy"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "CodeDeploy"
      input_artifacts = ["SourceArtifact"]
      version         = "1"

      configuration {
        ApplicationName     = "${aws_codedeploy_app.bot.name}"
        DeploymentGroupName = "${aws_codedeploy_deployment_group.bot.deployment_group_name}"
      }
    }
  }
}
