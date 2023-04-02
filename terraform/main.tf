terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}


module "vpc" {
  source = "./vpc"
  vpc-name = "tf-demo"
  vpc-cidr = "10.2.0.0/16"
  availability_zone =  ["us-east-1a", "us-east-1b"]
  public_web_subnet-cidr = ["10.2.0.0/24", "10.2.4.0/24"]
  private_app_subnet-cidr = ["10.2.1.0/24", "10.2.5.0/24"]
  private_db_subnet-cidr = ["10.2.3.0/24", "10.2.6.0/24"]
  environment = "Prod"
  enable_nat_gateway = false
}

resource "aws_launch_template" "MFALT" {
  name = "MFA-App-LT"
  default_version = "1"

  image_id = "ami-00c39f71452c08778"
  instance_type = "t2.micro"

  key_name = "demo-instance-1-keypair"


  vpc_security_group_ids = ["sg-062740f50a6d44228"]

  user_data = filebase64("userdata.txt")

}

resource "aws_lb_target_group" "MFA_TG" {
  name     = "MFAtargetGroup"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = "vpc-0f8ba45d0c2a3e762"
}

# resource "aws_eip" "e-ip" {
#   vpc   = true
#   tags = {
#     "Name"      = "alb-e-ip"
#   }
# }


resource "aws_lb" "MFA-alb" {
  name               = "MFA-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = ["sg-080b59da4fa0cada9"]
  subnets            = ["subnet-09dd6138e5bf63aef","subnet-0cf459987c2bee1af"]

}


resource "aws_lb_listener" "alb_lister" {
  load_balancer_arn = aws_lb.MFA-alb.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.MFA_TG.arn
  }
}



resource "aws_autoscaling_group" "mfa-asg" {
  name = "MFAasg"
  desired_capacity   = 2
  max_size           = 3
  min_size           = 2
  capacity_rebalance  = true
  vpc_zone_identifier = ["subnet-09dd6138e5bf63aef", "subnet-0cf459987c2bee1af"]
  health_check_grace_period = 300
  health_check_type         = "ELB"
  target_group_arns = [aws_lb_target_group.MFA_TG.arn]

  launch_template {
    id      = aws_launch_template.MFALT.id
    version = "$Latest"
  }
}


resource "aws_autoscaling_policy" "asg_policy" {

  autoscaling_group_name = aws_autoscaling_group.mfa-asg.name
  name                   = "mfa-asg-policy"
  policy_type            = "TargetTrackingScaling"

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }

    target_value = 40.0
  }
}