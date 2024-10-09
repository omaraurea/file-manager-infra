#!/usr/bin/env python3

from aws_cdk import core
from file_manager_infra.file_manager_infra_stack import FileManagerInfraStack

app = core.App()

# Initialize the FileManagerInfraStack and pass it to the application context
FileManagerInfraStack(app, "FileManagerInfraStack")

# Synthesize and deploy the stack
app.synth()