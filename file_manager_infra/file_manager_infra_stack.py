from aws_cdk import (
    core,
    aws_ec2 as ec2,
    aws_eks as eks,
    aws_apigateway as apigateway,
    aws_dynamodb as dynamodb,
    aws_s3 as s3,
    aws_iam as iam,
)
import json


class FileManagerInfraStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        vpc = self.create_vpc()
        cluster = self.create_eks_cluster(vpc)
        self.create_dynamodb_table()
        file_bucket, react_bucket = self.create_s3_buckets()
        load_balancer_url = self.deploy_springboot_application(cluster)
        self.create_api_gateway(load_balancer_url)

    def create_vpc(self) -> ec2.Vpc:
        """Crear una VPC para el Cluster EKS."""
        vpc = ec2.Vpc(self, "FileManagerVPC",
                      max_azs=2,
                      nat_gateways=1,
                      cidr="10.0.0.0/16")
        return vpc

    def create_eks_cluster(self, vpc: ec2.Vpc) -> eks.Cluster:
        """Crear un Cluster EKS en la VPC dada."""
        # Crear el Cluster EKS
        cluster = eks.Cluster(self, "FileManagerCluster",
                              vpc=vpc,
                              default_capacity=2,
                              version=eks.KubernetesVersion.V1_21,
                              cluster_name="FileManagerCluster")

        ecr_policy_statement = iam.PolicyStatement(
            actions=[
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability"
            ],
            resources=["arn:aws:ecr:us-east-2:392638527962:repository/filemanager"]
        )

        cluster.admin_role.add_to_policy(ecr_policy_statement)

        if cluster.default_nodegroup:
            cluster.default_nodegroup.role.add_to_policy(ecr_policy_statement)

        return cluster

    def create_dynamodb_table(self) -> dynamodb.Table:
        """Crear la tabla DynamoDB con el nombre y esquema de clave especificados."""
        table = dynamodb.Table(self, "FileManagerTable",
                               table_name="filemanager",
                               partition_key=dynamodb.Attribute(
                                   name="id", type=dynamodb.AttributeType.STRING),
                               sort_key=dynamodb.Attribute(
                                   name="user", type=dynamodb.AttributeType.STRING),
                               billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
                               removal_policy=core.RemovalPolicy.DESTROY)

        table.add_global_secondary_index(
            index_name="user-index",
            partition_key=dynamodb.Attribute(name="user", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL
        )

        table.add_global_secondary_index(
            index_name="user-filename-index",
            partition_key=dynamodb.Attribute(name="user", type=dynamodb.AttributeType.STRING),
            sort_key=dynamodb.Attribute(name="filename", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL
        )

        table.add_global_secondary_index(
            index_name="filename-index",
            partition_key=dynamodb.Attribute(name="filename", type=dynamodb.AttributeType.STRING),
            projection_type=dynamodb.ProjectionType.ALL
        )

        return table

    def create_s3_buckets(self) -> (s3.Bucket, s3.Bucket):
        """Crear buckets de S3 para almacenamiento de archivos y alojamiento de la app React."""

        file_bucket = s3.Bucket(self, "FileStorageBucket",
                                bucket_name="wd-filemanager",
                                removal_policy=core.RemovalPolicy.DESTROY)

        react_bucket = s3.Bucket(self, "ReactAppHostingBucket",
                                 bucket_name="react-app-hosting-bucket",
                                 website_index_document="index.html",
                                 website_error_document="error.html",
                                 public_read_access=True,
                                 removal_policy=core.RemovalPolicy.DESTROY)

        return file_bucket, react_bucket

    def create_api_gateway(self, load_balancer_url: str) -> apigateway.RestApi:
        """Crear un API Gateway para exponer los servicios de Spring Boot."""
        # Crear API Gateway
        api = apigateway.RestApi(self, "FileManagerApi",
                                 rest_api_name="FileManagerApi",
                                 description="API Gateway para exponer los servicios de la app Spring Boot.",
                                 deploy_options={
                                     "stage_name": "dev"
                                 })


        springboot_integration = apigateway.HttpIntegration(
            f"http://{load_balancer_url}",
            http_method="ANY",
            options=apigateway.IntegrationOptions(
                connection_type=apigateway.ConnectionType.INTERNET
            )
        )

        files_resource = api.root.add_resource("files")
        files_resource.add_method("GET", springboot_integration)
        files_resource.add_method("POST", springboot_integration)
        files_resource.add_method("DELETE", springboot_integration)

        return api

    def deploy_springboot_application(self, cluster: eks.Cluster) -> str:
        """Desplegar la aplicación Spring Boot en EKS utilizando la imagen de ECR."""
        app_label = {"app": "springboot-app"}

        springboot_deployment = cluster.add_manifest("SpringBootAppDeployment", {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "metadata": {"name": "springboot-app"},
            "spec": {
                "replicas": 2,
                "selector": {"matchLabels": app_label},
                "template": {
                    "metadata": {"labels": app_label},
                    "spec": {
                        "containers": [{
                            "name": "springboot-app",
                            "image": "392638527962.dkr.ecr.us-east-2.amazonaws.com/filemanager/v1",
                            "ports": [{"containerPort": 8080}]
                        }]
                    }
                }
            }
        })

        springboot_service = cluster.add_manifest("SpringBootAppService", {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {"name": "springboot-service"},
            "spec": {
                "type": "LoadBalancer",
                "selector": app_label,
                "ports": [{"port": 80, "targetPort": 8080}]
            }
        })

        load_balancer_url = core.Fn.get_att("SpringBootAppService", "status.loadBalancer.ingress[0].hostname").to_string()
        return load_balancer_url
