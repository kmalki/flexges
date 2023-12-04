resource "google_storage_bucket" "project_bucket" {
  for_each = var.buckets
  project = var.project_id
  name = "${var.project_id}-${each.value.name}"
  location = var.region
  storage_class = each.value.class
}
