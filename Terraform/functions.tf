resource "google_service_account" "service_account_functions" {
  project = var.project_id
  account_id   = var.service_account_functions.account_id
  display_name = var.service_account_functions.display_name
}

resource "google_project_iam_member" "functions_access" {
  project = var.project_id
  role   = "roles/editor"
  member = "serviceAccount:${google_service_account.service_account_functions.email}"
}

data "archive_file" "zip_sources" {
  type = "zip"
  source_dir = var.pubsub_firestore_function.source
  output_path = "${var.pubsub_firestore_function.source}.zip"
}

resource "google_storage_bucket_object" "function_pubsub_firestore_sources" {
  depends_on = [google_storage_bucket.project_bucket]
  name = "${var.pubsub_firestore_function.name}-${data.archive_file.zip_sources.output_md5}.zip"
  source = "${var.pubsub_firestore_function.source}.zip"
  bucket = "${var.project_id}-${var.buckets["functions-sources"].name}"
}

resource "google_cloudfunctions_function" "function_pubsub_firestore" {
  depends_on = [google_storage_bucket_object.function_pubsub_firestore_sources,
                google_service_account.service_account_functions]

  project = var.project_id

  name = var.pubsub_firestore_function.name
  description = var.pubsub_firestore_function.description
  runtime = "nodejs12"
  region = var.region
  available_memory_mb = 256
  source_archive_bucket = "${var.project_id}-${var.buckets["functions-sources"].name}"
  source_archive_object = google_storage_bucket_object.function_pubsub_firestore_sources.name
  service_account_email = google_service_account.service_account_functions.email
  entry_point = "functionpubsubfirestore"

  event_trigger {
    event_type = var.pubsub_firestore_function.event_type
    resource = google_pubsub_topic.project_topic.id
  }

  environment_variables = {
    GCLOUD_PROJECT = var.project_id
  }
}