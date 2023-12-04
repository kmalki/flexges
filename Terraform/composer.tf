resource "google_service_account" "service_account_composer" {
  project = var.project_id
  account_id   = var.service_account_composer.account_id
  display_name = var.service_account_composer.display_name
}

resource "google_project_iam_member" "composer_access" {
    project = var.project_id
    role   = "roles/editor"
    member = "serviceAccount:${google_service_account.service_account_composer.email}"
}

resource "google_composer_environment" "composer" {
  depends_on = [google_project_iam_member.composer_access]
  name   = var.composer.name
  region = var.region
  project = var.project_id
  config {
    node_count = var.composer.node

    node_config {
      zone         = var.zone
      machine_type = var.composer.machine
      service_account = google_service_account.service_account_composer.email
      disk_size_gb = var.composer.disk_size_gb
    }

    software_config {
        image_version = var.composer.composer_image_version
        python_version = var.composer.composer_python_version

        airflow_config_overrides = {
          core-store_serialized_dags = var.composer.core-store_serialized_dags
          core-min_serialized_dag_update_interval = var.composer.core-min_serialized_dag_update_interval
          core-store_dag_code = var.composer.core-store_dag_code
          scheduler-dag_dir_list_interval = var.composer.scheduler-dag_dir_list_interval
          }
    }
  }
}