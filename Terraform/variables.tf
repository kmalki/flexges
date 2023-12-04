variable "project_id" {}
variable region {default = "europe-west1"}
variable zone {default = "europe-west1-b"}

variable bq_region {default = "EU"}

variable "buckets" {
  type = map(object ({
    name = string
    class = string
  }))
}

variable "firestore_topic" {
  type = object ({
    name = string
  })
}

variable "dataproc" {
  type = map(object({
    name = string
    vm = string
    disk_type = string
    disk_size = number
    num_instances_worker = number
    num_instances_master = number
  }))
}

variable "datasets" {
  type = map(object({
    name = string
    description = string
  }))
}

variable "composer" {
  type = object({
    name = string
    machine = string
    node = number
    core-store_serialized_dags = string
    core-min_serialized_dag_update_interval = number
    core-store_dag_code = string
    scheduler-dag_dir_list_interval = number
    disk_size_gb = number
    composer_image_version = string
    composer_python_version = string
  })
}

variable "service_account_composer" {
  type = object({
   account_id = string
   display_name = string
  })
}

variable "service_account_dataflow" {
  type = object({
   account_id = string
   display_name = string
  })
}

variable "service_account_functions" {
  type = object({
    account_id = string
    display_name = string
  })
}

variable "service_account_pubsub" {
  type = object({
    account_id = string
    display_name = string
  })
}

variable "date_partition_tables" {
  type = map(object({
    name = string
    dataset = string
    schema = string
    partition_field = string
    require_partition_filter = bool
    clustering = list(string)
  }))
}

variable "pubsub_firestore_function" {
  type = object({
    name = string
    source = string
    description = string
    event_type = string
  })
}