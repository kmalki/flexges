terraform {
  backend "gcs" {
    bucket = "projetannuel-terraform-tfstate"
    prefix = "terraform.tfstate"
  }
}