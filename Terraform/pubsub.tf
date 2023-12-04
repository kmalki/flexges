resource "google_pubsub_topic" "project_topic" {
  project = var.project_id
  name = "${var.project_id}-${var.firestore_topic.name}"
}

resource "google_service_account" "service_account_pubsub" {
  project = var.project_id
  account_id   = var.service_account_pubsub.account_id
  display_name = var.service_account_pubsub.display_name
}

resource "google_project_iam_member" "pubsub_access" {
  project = var.project_id
  role   = "roles/pubsub.editor"
  member = "serviceAccount:${google_service_account.service_account_pubsub.email}"
}