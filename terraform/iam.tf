data "aws_iam_policy_document" "assume_codepipeline" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["codepipeline.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "codepipeline" {
  assume_role_policy = "${data.aws_iam_policy_document.assume_codepipeline.json}"
}

data "aws_iam_policy_document" "codepipeline" {
  statement {
    actions   = ["s3:*"]
    resources = ["*"],
    effect    = "Allow"
  }
  statement {
    actions   = [
      "codedeploy:CreateDeployment",
      "codedeploy:GetApplicationRevision",
      "codedeploy:GetDeployment",
      "codedeploy:GetDeploymentConfig",
      "codedeploy:RegisterApplicationRevision"
    ]
    resources = ["*"],
    effect    = "Allow"
  }
  statement {
    actions   = [
      "elasticbeanstalk:CreateApplicationVersion",
      "elasticbeanstalk:DescribeApplicationVersions",
      "elasticbeanstalk:DescribeEnvironments",
      "elasticbeanstalk:DescribeEvents",
      "elasticbeanstalk:UpdateEnvironment",
      "autoscaling:DescribeAutoScalingGroups",
      "autoscaling:DescribeLaunchConfigurations",
      "autoscaling:DescribeScalingActivities",
      "autoscaling:ResumeProcesses",
      "autoscaling:SuspendProcesses",
      "cloudformation:GetTemplate",
      "cloudformation:DescribeStackResource",
      "cloudformation:DescribeStackResources",
      "cloudformation:DescribeStackEvents",
      "cloudformation:DescribeStacks",
      "cloudformation:UpdateStack",
      "ec2:DescribeInstances",
      "ec2:DescribeImages",
      "ec2:DescribeAddresses",
      "ec2:DescribeSubnets",
      "ec2:DescribeVpcs",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeKeyPairs",
      "elasticloadbalancing:DescribeLoadBalancers",
      "rds:DescribeDBInstances",
      "rds:DescribeOrderableDBInstanceOptions",
      "sns:ListSubscriptionsByTopic"
    ]
    resources = ["*"],
    effect    = "Allow"
  }
  statement {
    actions   = [
      "lambda:invokefunction",
      "lambda:listfunctions"
    ]
    resources = ["*"]
    effect    = "Allow"
  }
}

resource "aws_iam_policy" "codepipeline" {
  policy = "${data.aws_iam_policy_document.codepipeline.json}"
}

resource "aws_iam_role_policy_attachment" "codepipeline" {
  policy_arn = "${aws_iam_policy.codepipeline.arn}"
  role       = "${aws_iam_role.codepipeline.name}"
}

data "aws_iam_policy_document" "assume_codedeploy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["codedeploy.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "codedeploy" {
  assume_role_policy = "${data.aws_iam_policy_document.assume_codedeploy.json}"
}

resource "aws_iam_role_policy_attachment" "codedeploy" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
  role       = "${aws_iam_role.codedeploy.name}"
}

data "aws_iam_policy_document" "assume_ec2" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2" {
  assume_role_policy = "${data.aws_iam_policy_document.assume_ec2.json}"
}

data "aws_iam_policy_document" "ec2" {
  statement {
    actions   = [
      "s3:Get*",
      "s3:List*"
    ]
    resources = ["*"],
    effect    = "Allow"
  }
}

resource "aws_iam_policy" "ec2" {
  policy = "${data.aws_iam_policy_document.ec2.json}"
}

resource "aws_iam_role_policy_attachment" "ec2" {
  policy_arn = "${aws_iam_policy.ec2.arn}"
  role       = "${aws_iam_role.ec2.name}"
}

resource "aws_iam_instance_profile" "ec2" {
  role = "${aws_iam_role.ec2.name}"
}