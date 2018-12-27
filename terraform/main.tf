provider "aws" {
  region = "us-west-1"
}

data "local_file" "ssh_local" {
  filename = "${pathexpand("~/.ssh/id_rsa.pub")}"
}

resource "aws_key_pair" "deployer" {
  public_key = "${data.local_file.ssh_local.content}"
}

resource "aws_instance" "bot" {
  ami                  = "ami-011b6930a81cd6aaf"
  instance_type        = "t2.micro"
  key_name             = "${aws_key_pair.deployer.key_name}"
  iam_instance_profile = "${aws_iam_instance_profile.ec2.name}"

  security_groups      = [
    "${aws_security_group.bot_group.name}",
  ]

  tags {
    Name = "${aws_codedeploy_app.bot.name}"
  }

  provisioner "remote-exec" {
    script = "${path.module}/provision.sh"

    connection {
      user = "ec2-user"
    }
  }
}

resource "aws_security_group" "bot_group" {
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
