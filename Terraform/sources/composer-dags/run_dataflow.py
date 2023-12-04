from airflow import DAG
from airflow.providers.google.cloud.operators.dataflow import DataflowCreateJavaJobOperator
from datetime import datetime

default_args = {
"owner": "airflow",
"depend_on_past": False,
"start_date": datetime(2021,6,17,0,0)
}

with DAG(
        "launch_dataflow",
        schedule_interval="30 7 * * 1-5",
        start_date=default_args["start_date"]
) as dag:
    (
        DataflowCreateJavaJobOperator(
            task_id="run_dataflow_job",
            jar="gs://projetannuel-309416-dataflow-temp/artifact/streaming-1.0-SNAPSHOT.jar",
            job_name='streaming_dataflow',
            options={
                "tempLocation": "gs://projetannuel-309416-dataflow-temp/tempLocation/",
                "stagingLocation": "gs://projetannuel-309416-dataflow-temp/stagingLocation/",
                "region": "europe-west1",
                "serviceAccount": "dataflow@projetannuel-309416.iam.gserviceaccount.com"
            },
            poll_sleep=10,
            wait_until_finished=False,
            location='europe-west1'
        )
    )