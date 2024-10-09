import boto3
from botocore.exceptions import ClientError

# Initialize AWS clients
s3_client = boto3.client('s3')
dynamodb_client = boto3.client('dynamodb')
ecr_client = boto3.client('ecr')

# S3 Bucket Name
FILE_STORAGE_BUCKET = "wd-filemanager"
REACT_APP_BUCKET = "react-app-hosting-bucket"

# DynamoDB Table Name
DYNAMODB_TABLE_NAME = "filemanager"

# ECR Repository Name
ECR_REPOSITORY_NAME = "filemanager"


def delete_s3_bucket(bucket_name):
    """Delete an S3 bucket if it exists."""
    try:
        # Check if bucket exists
        s3_client.head_bucket(Bucket=bucket_name)
        print(f"Bucket {bucket_name} exists. Deleting...")

        # Delete all objects in the bucket
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        if 'Contents' in response:
            for obj in response['Contents']:
                s3_client.delete_object(Bucket=bucket_name, Key=obj['Key'])

        # Delete the bucket
        s3_client.delete_bucket(Bucket=bucket_name)
        print(f"Bucket {bucket_name} deleted successfully.")
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            print(f"Bucket {bucket_name} does not exist.")
        else:
            print(f"Unexpected error occurred: {e}")


def delete_dynamodb_table(table_name):
    """Delete a DynamoDB table if it exists."""
    try:
        # Check if table exists
        dynamodb_client.describe_table(TableName=table_name)
        print(f"DynamoDB table {table_name} exists. Deleting...")

        # Delete the table
        dynamodb_client.delete_table(TableName=table_name)
        print(f"DynamoDB table {table_name} deleted successfully.")
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            print(f"DynamoDB table {table_name} does not exist.")
        else:
            print(f"Unexpected error occurred: {e}")


def delete_ecr_repository(repository_name):
    """Delete an ECR repository if it exists."""
    try:
        # Check if repository exists
        ecr_client.describe_repositories(repositoryNames=[repository_name])
        print(f"ECR repository {repository_name} exists. Deleting...")

        # Delete the repository
        ecr_client.delete_repository(repositoryName=repository_name, force=True)
        print(f"ECR repository {repository_name} deleted successfully.")
    except ClientError as e:
        if e.response['Error']['Code'] == 'RepositoryNotFoundException':
            print(f"ECR repository {repository_name} does not exist.")
        else:
            print(f"Unexpected error occurred: {e}")


if __name__ == "__main__":
    # Delete existing S3 buckets
    delete_s3_bucket(FILE_STORAGE_BUCKET)
    delete_s3_bucket(REACT_APP_BUCKET)

    # Delete existing DynamoDB table
    delete_dynamodb_table(DYNAMODB_TABLE_NAME)

    # Delete existing ECR repository
    delete_ecr_repository(ECR_REPOSITORY_NAME)
