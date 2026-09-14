
### Automatic Rollback
You can configure a deployment group or a specific deployment to roll back when a deployment fails or when a monitoring threshold is met (AWS Alarm)

### AppSpec for Lambda

```YAML
version: 0.0
Resources:
  - myLambdaFunction:
      Type: AWS::Lambda::Function
      Properties:
        Name: "myLambdaFunction"
        Alias: "myLambdaFunctionAlias"
        CurrentVersion: "1"
        TargetVersion: "2"
Hooks:
  - BeforeAllowTraffic: "LambdaFunctionToValidateBeforeTrafficShift"
  - AfterAllowTraffic: "LambdaFunctionToValidateAfterTrafficShift"
```

### AppSpec for EC2/On-Prem

```YAML
version: 0.0
os: linux
files:
  - source: Config/config.txt
    destination: /webapps/Config
  - source: source
    destination: /webapps/myApp
hooks:
  BeforeInstall:
    - location: Scripts/UnzipResourceBundle.sh
    - location: Scripts/UnzipDataBundle.sh
  AfterInstall:
    - location: Scripts/RunResourceTests.sh
      timeout: 180
  ApplicationStart:
    - location: Scripts/RunFunctionalTests.sh
      timeout: 3600
  ValidateService:
    - location: Scripts/MonitorService.sh
      timeout: 3600
      runas: codedeployuser

```
### AppSpec for ECS

```YAML
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "arn:aws:ecs:us-east-1:111222333444:task-definition/my-task-definition-family-name:1"
        LoadBalancerInfo:
          ContainerName: "SampleApplicationName"
          ContainerPort: 80
# Optional properties
        PlatformVersion: "LATEST"
        NetworkConfiguration:
          AwsvpcConfiguration:
            Subnets: ["subnet-1234abcd","subnet-5678abcd"]
            SecurityGroups: ["sg-12345678"]
            AssignPublicIp: "ENABLED"
        CapacityProviderStrategy:
          - Base: 1
            CapacityProvider: "FARGATE_SPOT"
            Weight: 2
          - Base: 0
            CapacityProvider: "FARGATE"
            Weight: 1
Hooks:
  - BeforeInstall: "LambdaFunctionToValidateBeforeInstall"
  - AfterInstall: "LambdaFunctionToValidateAfterInstall"
  - AfterAllowTestTraffic: "LambdaFunctionToValidateAfterTestTrafficStarts"
  - BeforeAllowTraffic: "LambdaFunctionToValidateBeforeAllowingProductionTraffic"
  - AfterAllowTraffic: "LambdaFunctionToValidateAfterAllowingProductionTraffic"
```



### List of lifecycle event hooks for an Amazon ECS deployment

An AWS Lambda hook is one Lambda function specified with a string on a new line after the name of the lifecycle event. Each hook is executed once per deployment. Following are descriptions of the lifecycle events where you can run a hook during an Amazon ECS deployment.

- `BeforeInstall` – Use to run tasks before the replacement task set is created. One target group is associated with the original task set. If an optional test listener is specified, it is associated with the original task set. A rollback is not possible at this point.
    
- `AfterInstall` – Use to run tasks after the replacement task set is created and one of the target groups is associated with it. If an optional test listener is specified, it is associated with the original task set. The results of a hook function at this lifecycle event can trigger a rollback.
    
- `AfterAllowTestTraffic` – Use to run tasks after the test listener serves traffic to the replacement task set. The results of a hook function at this point can trigger a rollback.
    
- `BeforeAllowTraffic` – Use to run tasks after the second target group is associated with the replacement task set, but before traffic is shifted to the replacement task set. The results of a hook function at this lifecycle event can trigger a rollback.
    
- `AfterAllowTraffic` – Use to run tasks after the second target group serves traffic to the replacement task set. The results of a hook function at this lifecycle event can trigger a rollback.

### List of lifecycle event hooks for an AWS Lambda deployment

An AWS Lambda hook is one Lambda function specified with a string on a new line after the name of the lifecycle event. Each hook is executed once per deployment. Here are descriptions of the hooks available for use in your AppSpec file.

- **BeforeAllowTraffic** – Use to run tasks before traffic is shifted to the deployed Lambda function version.
    
- **AfterAllowTraffic** – Use to run tasks after all traffic is shifted to the deployed Lambda function version.

### List of lifecycle event hooks for EC2/On-prem

An EC2/On-Premises deployment hook is executed once per deployment to an instance. You can specify one or more scripts to run in a hook. Each hook for a lifecycle event is specified with a string on a separate line. Here are descriptions of the hooks available for use in your AppSpec file.

For information about which lifecycle event hooks are valid for which deployment and rollback types, see [Lifecycle event hook availability](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html#reference-appspec-file-structure-hooks-availability).

- `ApplicationStop` – This deployment lifecycle event occurs even before the application revision is downloaded. You can specify scripts for this event to gracefully stop the application or remove currently installed packages in preparation for a deployment. The AppSpec file and scripts used for this deployment lifecycle event are from the previous successfully deployed application revision.
    
    ###### Note
    
    An AppSpec file does not exist on an instance before you deploy to it. For this reason, the `ApplicationStop` hook does not run the first time you deploy to the instance. You can use the `ApplicationStop` hook the second time you deploy to an instance.
    
    To determine the location of the last successfully deployed application revision, the CodeDeploy agent looks up the location listed in the `` `deployment-group-id`_last_successful_install `` file. This file is located in:
    
    `/opt/codedeploy-agent/deployment-root/deployment-instructions` folder on Amazon Linux, Ubuntu Server, and RHEL Amazon EC2 instances.
    
    `C:\ProgramData\Amazon\CodeDeploy\deployment-instructions` folder on Windows Server Amazon EC2 instances.
    
    To troubleshoot a deployment that fails during the `ApplicationStop` deployment lifecycle event, see [Troubleshooting a failed ApplicationStop, BeforeBlockTraffic, or AfterBlockTraffic deployment lifecycle event](https://docs.aws.amazon.com/codedeploy/latest/userguide/troubleshooting-deployments.html#troubleshooting-deployments-lifecycle-event-failures).
    
- `DownloadBundle` – During this deployment lifecycle event, the CodeDeploy agent copies the application revision files to a temporary location:
    
    ``/opt/codedeploy-agent/deployment-root/`deployment-group-id`/`deployment-id`/deployment-archive`` folder on Amazon Linux, Ubuntu Server, and RHEL Amazon EC2 instances.
    
    ``C:\ProgramData\Amazon\CodeDeploy\`deployment-group-id`\`deployment-id`\deployment-archive`` folder on Windows Server Amazon EC2 instances.
    
    This event is reserved for the CodeDeploy agent and cannot be used to run scripts.
    
    To troubleshoot a deployment that fails during the `DownloadBundle` deployment lifecycle event, see [Troubleshooting a failed DownloadBundle deployment lifecycle event with UnknownError: not opened for reading](https://docs.aws.amazon.com/codedeploy/latest/userguide/troubleshooting-deployments.html#troubleshooting-deployments-downloadbundle).
    
- `BeforeInstall` – You can use this deployment lifecycle event for preinstall tasks, such as decrypting files and creating a backup of the current version.
    
- `Install` – During this deployment lifecycle event, the CodeDeploy agent copies the revision files from the temporary location to the final destination folder. This event is reserved for the CodeDeploy agent and cannot be used to run scripts.
    
- `AfterInstall` – You can use this deployment lifecycle event for tasks such as configuring your application or changing file permissions.
    
- `ApplicationStart` – You typically use this deployment lifecycle event to restart services that were stopped during `ApplicationStop`.
    
- `ValidateService` – This is the last deployment lifecycle event. It is used to verify the deployment was completed successfully.
    
- `BeforeBlockTraffic` – You can use this deployment lifecycle event to run tasks on instances before they are deregistered from a load balancer.
    
    To troubleshoot a deployment that fails during the `BeforeBlockTraffic` deployment lifecycle event, see [Troubleshooting a failed ApplicationStop, BeforeBlockTraffic, or AfterBlockTraffic deployment lifecycle event](https://docs.aws.amazon.com/codedeploy/latest/userguide/troubleshooting-deployments.html#troubleshooting-deployments-lifecycle-event-failures).
    
- `BlockTraffic` – During this deployment lifecycle event, internet traffic is blocked from accessing instances that are currently serving traffic. This event is reserved for the CodeDeploy agent and cannot be used to run scripts.
    
- `AfterBlockTraffic` – You can use this deployment lifecycle event to run tasks on instances after they are deregistered from their respective load balancer.
    
    To troubleshoot a deployment that fails during the `AfterBlockTraffic` deployment lifecycle event, see [Troubleshooting a failed ApplicationStop, BeforeBlockTraffic, or AfterBlockTraffic deployment lifecycle event](https://docs.aws.amazon.com/codedeploy/latest/userguide/troubleshooting-deployments.html#troubleshooting-deployments-lifecycle-event-failures).
    
- `BeforeAllowTraffic` – You can use this deployment lifecycle event to run tasks on instances before they are registered with a load balancer.
    
- `AllowTraffic` – During this deployment lifecycle event, internet traffic is allowed to access instances after a deployment. This event is reserved for the CodeDeploy agent and cannot be used to run scripts.
    
- `AfterAllowTraffic` – You can use this deployment lifecycle event to run tasks on instances after they are registered with a load balancer.

---

## CodeDeploy Overview

- Deployment service that **automates application deployments** to:
  - **Amazon EC2 instances**
  - **On-premises instances**
  - **Serverless Lambda functions**
  - **Amazon ECS services**
- Reduces downtime during deployments; handles rollback automatically on failure.

### Core Concepts
| Concept | Description |
|---------|-------------|
| **Application** | Named container for the deployment components |
| **Deployment Group** | Set of instances / Lambda / ECS service to deploy to (can be an ASG, tag-based, or explicit list) |
| **Deployment Configuration** | Rules governing how fast/how many instances are deployed at once |
| **Revision** | The deployable content (code + appspec file) stored in S3 or CodeCommit |
| **CodeDeploy Agent** | Process running on EC2/on-premises that polls CodeDeploy and executes deployments |

### Deployment Types
| Type | Mechanism |
|------|-----------|
| **In-Place** | Stop app on existing instances, deploy, restart — has brief downtime window |
| **Blue/Green** | Deploy to new instances (green), shift traffic, terminate old (blue) — zero downtime |

### Deployment Configurations (In-Place, EC2)
| Config | Behaviour |
|--------|-----------|
| `CodeDeployDefault.AllAtOnce` | Deploy to all instances simultaneously — fastest, highest risk |
| `CodeDeployDefault.HalfAtATime` | Deploy to 50% at a time |
| `CodeDeployDefault.OneAtATime` | Deploy to one instance at a time — slowest, safest |
| **Custom** | Define `minimumHealthyHosts` as a number or percentage |

### Lambda Traffic Shifting Configurations
| Config | Behaviour |
|--------|-----------|
| `LambdaCanary10Percent5Minutes` | 10% traffic for 5 min, then 90% |
| `LambdaLinear10PercentEvery1Minute` | Shift 10% every minute |
| `LambdaAllAtOnce` | All traffic at once |

### ECS Deployment
- Blue/Green only: deploys a new **task set**, then shifts traffic via **ALB listener rules**.
- ECS deployment hooks allow Lambda functions to run validation at each lifecycle step.

### Revision Storage
- **S3** — `.zip`, `.tar`, `.tar.gz` containing application files + `appspec.yml`.
- **CodeCommit** — repo containing app + appspec.

### CodeDeploy Agent
- Must be installed on **EC2 / on-premises** instances.
- Install via: **User Data script**, **SSM Run Command**, or baked into an AMI.
- Polls CodeDeploy service for pending deployments.
- Not required for Lambda or ECS (handled by CodeDeploy APIs directly).

### EventBridge Integration
- CodeDeploy emits events on deployment state changes.
- Pattern: `EventBridge → SNS` to notify on deployment failure.
- Pattern: `EventBridge → Lambda` for automated rollback triggers or ITSM ticket creation.

## Exam Tips
- CodeDeploy **agent** required on EC2/on-prem — not needed for Lambda/ECS.
- Store revision in **S3** (most common) or CodeCommit.
- `appspec.yml` in the **root** of the revision bundle — it's unique to CodeDeploy.
- Rollback = re-deploy a previous **revision** (not truly in-place reversal).
- Blue/Green for EC2 requires a **load balancer** (ALB/NLB/CLB).
- Lambda deployments use **aliases and versions** to shift traffic gradually.
- `minimumHealthyHosts` in deployment config controls safe-deployment thresholds.
