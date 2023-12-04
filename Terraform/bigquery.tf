resource "google_bigquery_dataset" "bigquery_datasets" {
  for_each = var.datasets
  project = var.project_id
  dataset_id  = each.value.name
  description = each.value.description
  location = var.bq_region
  labels = {
    billable = "true"
    owner    = var.project_id
  }
}

resource "google_bigquery_table" "date_partition_tables" {
  depends_on = [google_bigquery_dataset.bigquery_datasets]
  for_each = var.date_partition_tables
  dataset_id = each.value.dataset
  project = var.project_id
  table_id = each.value.name
  time_partitioning {
    type = "DAY"
    field = each.value.partition_field
    require_partition_filter = each.value.require_partition_filter
  }
  clustering = each.value.clustering
  schema = file(each.value.schema)
  deletion_protection=false
}