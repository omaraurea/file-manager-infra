# File Manager Infrastructure - AWS CDK Project

This project uses **AWS CDK** to deploy a complete infrastructure for a **File Manager** application. It sets up the backend in Spring Boot and hosts a frontend application in React. The infrastructure includes the following resources:

- **AWS VPC**: Virtual Private Cloud for networking within the EKS cluster.
- **AWS EKS**: Kubernetes cluster to host the Spring Boot application.
- **AWS S3**: Buckets for file storage and React application hosting.
- **AWS DynamoDB**: NoSQL database to store file metadata.
- **AWS API Gateway**: Gateway to expose REST services for the backend.
- **AWS IAM**: Roles and policies to manage access and security permissions.

## Prerequisites

Before starting, ensure you have the following tools and configurations installed and set up:

1. **AWS CLI**: Installed and configured with the correct credentials.
    - [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
    ```bash
    aws configure
    ```
2. **AWS CDK**: Installed globally.
    - [AWS CDK Installation Guide](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#setup)
    ```bash
    npm install -g aws-cdk
    ```
3. **Python 3.7 or higher**: Installed on your local machine.
4. **Node.js and npm**: Installed to work with the React application.
5. **Docker**: Installed and running for container creation and deployment.
6. **Boto3 and CDK Libraries**: Installed in your Python virtual environment.
    ```bash
    pip install boto3 aws-cdk.core aws-cdk.aws-ec2 aws-cdk.aws-eks aws-cdk.aws-apigateway aws-cdk.aws-dynamodb aws-cdk.aws-s3 aws-cdk.aws-iam
    ```

## Project Structure

The project structure is as follows:

file-manager-infra/ 
├── app.py 
# Entry point for the CDK application 
├── cdk.json 
# CDK configuration file 
├── README.md 
# Project documentation 
├── requirements.txt 
# Python dependencies for the project 
├── file_manager_infra/ 
│ ├── init.py 
# Module initialization 
│ ├── file_manager_infra_stack.py 
# CDK stack definition with AWS resources



### File Descriptions

- **`app.py`**: Entry point for the CDK application. It initializes and deploys the stack.
- **`cdk.json`**: Configuration file for the CDK application.
- **`requirements.txt`**: List of required Python libraries for the project.
- **`file_manager_infra/__init__.py`**: Initialization file for the `file_manager_infra` module.
- **`file_manager_infra/file_manager_infra_stack.py`**: CDK stack definition that includes all AWS resources.

## Configuration and Deployment

Follow these steps to configure and deploy the infrastructure:

### 1. Clone the Repository

Clone the repository to your local machine.


2. Install Dependencies
Install the necessary Python dependencies for the project:
pip install -r requirements.txt

3. Pre-deployment Script (Optional)
If there are existing resources (e.g., S3 buckets or DynamoDB tables), you can run a pre-deployment script to delete them before deploying the stack:

python pre_deployment_validation.py

4. Bootstrap the CDK Environment
Before deploying the stack, bootstrap the CDK environment:

cdk bootstrap

5. Deploy the CDK Stack
Deploy the stack using the following command:

cdk deploy


6. Verify the Deployment
Once the deployment is complete, verify the resources in the AWS Management Console:

EKS Cluster: Check that the EKS cluster is visible under the Amazon EKS service.
S3 Buckets: Ensure that the wd-filemanager and react-app-hosting-bucket buckets exist.
DynamoDB Table: Verify that the filemanager table is available.
API Gateway: The API should be deployed and accessible.
Spring Boot Application Integration
The project includes integration with the Spring Boot application deployed on an EKS cluster using a container image stored in ECR.

Application Deployment Overview
Container Image:

The Spring Boot application is packaged as a Docker image and stored in an Amazon ECR repository.
The image is deployed in the EKS cluster using a Kubernetes Deployment.
Application Exposure:

The application is exposed using a Kubernetes LoadBalancer service.
The Load Balancer’s URL is used to configure the API Gateway.
API Gateway Configuration
The API Gateway is configured to expose the following routes and methods:

GET /files: Retrieves the list of files.
POST /files: Uploads a new file.
DELETE /files: Deletes a specific file.


