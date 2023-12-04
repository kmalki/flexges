resource "google_service_account" "service_account_dataflow" {
  project = var.project_id
  account_id   = var.service_account_dataflow.account_id
  display_name = var.service_account_dataflow.display_name
}

resource "google_project_iam_member" "dataflow_access" {
    project = var.project_id
    role   = "roles/editor"
    member = "serviceAccount:${google_service_account.service_account_dataflow.email}"
}