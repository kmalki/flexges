from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from datetime import datetime

default_args = {
    "owner": "airflow",
    "depend_on_past": False,
    "start_date": datetime(2021, 6, 17, 0, 0)
}


def get_bash_command_stop_dataflow():
    return 'gcloud dataflow jobs --project=projetannuel-309416 cancel --region=europe-west1 {}'.format(
        "{{ ti.xcom_pull(dag_id='launch_dataflow', task_ids='dataflow_job', key='return_value') }}")


with DAG(
        "stop_dataflow",
        schedule_interval="0 20 * * 1-5",
        start_date=default_args["start_date"]
) as dag:
    (
        BashOperator(
            task_id="stop_dataflow_job",
            bash_command=get_bash_command_stop_dataflow
        )
    )
