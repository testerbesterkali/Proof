provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

# S3 Bucket for Video Proofs
resource "aws_s3_bucket" "proofs" {
  bucket = "proof-application-assets"
}

# ECS Cluster for API and Workers
resource "aws_ecs_cluster" "main" {
  name = "proof-cluster"
}

# RDS Postgres Database
resource "aws_db_instance" "proof_db" {
  allocated_storage   = 20
  engine              = "postgres"
  engine_version      = "16"
  instance_class      = "db.t3.micro"
  username            = "proof_admin"
  password            = var.db_password
  skip_final_snapshot = true
}

variable "db_password" {
  sensitive = true
}
