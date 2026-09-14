### Custom Resources
**Custom resources** enable users to write custom provisioning logic in templates that AWS CloudFormation runs anytime a user creates, updates (if the custom resource has been changed), or deletes stacks. For instance, a user might want to include resources that are not available as AWS CloudFormation resource types. Users can include those resources by using custom resources. That way, users can still manage all related resources in a single stack.

If a **custom resource** is used to invoke a **Lambda function** in AWS CloudFormation, the request will include a **pre-signed URL**. The Lambda function is responsible for returning a response to the pre-signed URL to indicate if the resource creation was successful or not. Otherwise, stack will remain in `CREATE_IN_PROGRESS` state.

##### Use cases
Use Custom Resource to fetch new AMIs. Learn more:

https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-custom-resources-lambda-lookup-amiids.html

https://aws.amazon.com/blogs/devops/faster-auto-scaling-in-aws-cloudformation-stacks-with-lambda-backed-custom-resources/


### UpdatePolicy

[`AWS::AutoScaling::AutoScalingGroup`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-autoscalinggroup.html)

With Auto Scaling groups, you can use one or more update policies to control how CloudFormation handles certain updates. These policies include:

- `AutoScalingReplacingUpdate` and `AutoScalingRollingUpdate` policies – CloudFormation can either replace the Auto Scaling group and its instances with an `AutoScalingReplacingUpdate` policy, or replace only the instances with an `AutoScalingRollingUpdate` policy. These replacement operations occur when you make one or more of the following changes:
    
    - Change the Auto Scaling group's `[AWS::AutoScaling::LaunchConfiguration](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-autoscaling-launchconfiguration.html)`.
        
    - Change the Auto Scaling group's `VPCZoneIdentifier` property.
        
    - Change the Auto Scaling group's `LaunchTemplate` property.
        
    - Update an Auto Scaling group that contains instances that don't match the current `LaunchConfiguration`.
        
    If both the `AutoScalingReplacingUpdate` and `AutoScalingRollingUpdate` policies are specified, setting the `WillReplace` property to `true` gives `AutoScalingReplacingUpdate` precedence.

---

## CloudFormation Overview

- **Infrastructure as Code** service — define AWS resources in JSON or YAML templates.
- Templates are **declarative** — you describe the desired state; CloudFormation figures out the order of operations.
- Resources are managed in **stacks**.
- Drift detection identifies resources that have been manually changed outside CloudFormation.

### Key Template Sections
| Section | Required? | Description |
|---------|-----------|-------------|
| `AWSTemplateFormatVersion` | No | Template format version |
| `Description` | No | Template description |
| `Parameters` | No | Input values at stack creation/update |
| `Mappings` | No | Key-value lookups (e.g., region → AMI) |
| `Conditions` | No | Conditional resource creation |
| `Resources` | **Yes** | AWS resources to create/manage |
| `Outputs` | No | Values to export for cross-stack references |

### Change Sets
- Preview **what will change** before executing a stack update.
- Prevents surprises — shows adds, modifies, removes.
- Best practice: always use a change set before updating a production stack.

### Stack Policies
- JSON document that protects stack resources from unintentional updates.
- Define explicit `Allow` / `Deny` for `Update:*` on specific resources.

### Drift Detection
- Compares the live state of stack resources against the CloudFormation template.
- Identifies resources that have been changed outside CloudFormation (configuration drift).
- Supported resource types only.

---

## CloudFormation StackSets

### Overview
- Deploy and manage **stacks across multiple AWS accounts and multiple regions** with a **single operation**.
- Requires an **administrator account** (central deployer) and **target accounts**.

### Permission Models
| Model | How It Works |
|-------|-------------|
| **Self-managed** | Create IAM roles manually in admin and target accounts (`AWSCloudFormationStackSetAdministrationRole` and `AWSCloudFormationStackSetExecutionRole`) |
| **Service-managed** | Uses AWS Organizations; CloudFormation manages permissions automatically |

### Key Configuration Options
- **Maximum concurrent accounts** — control parallelism (deploy to N accounts at once).
- **Failure tolerance** — how many account/region failures are allowed before stopping.
- **Retain stacks** — when removing a stack instance, optionally retain (do not delete) the underlying stack resources.
- **Automatic deployment** — with Organizations: automatically deploy to new accounts added to an OU.

### Use Cases
- Deploy **AWS Config rules** across all accounts in an Organisation.
- Deploy **baseline IAM roles** or guardrails to every account.
- Deploy **CloudWatch alarms** or **Security Hub** configurations organisation-wide.

### StackSets in a CI/CD Pipeline
```
CodePipeline → CloudFormation Deploy Action (StackSet) → Multiple accounts/regions
```

> **Exam tip:** StackSets = one template, one operation, **many accounts and regions**.

---

## AWS Cloud Development Kit (CDK)

### Overview
- Framework for defining cloud infrastructure using **high-level programming languages**: TypeScript, JavaScript, Python, Java, C#, Go.
- Under the hood, CDK **synthesises to a CloudFormation template** — CloudFormation provisions the resources.
- CDK is effectively a **wrapper / abstraction layer on top of CloudFormation**.

### Why Use CDK Over CloudFormation YAML?
| Scenario | CloudFormation YAML | CDK (e.g., Python) |
|----------|--------------------|--------------------|
| Complex VPC networking | ~500–1000 lines | ~50 lines |
| Reusable patterns | Copy/paste templates | Create a `Construct` class and import it |
| IDE support | Limited | Full autocomplete, type checking |
| Conditional logic | Limited `Conditions` syntax | Native `if/else` |

### CDK Building Blocks
| Block | Description |
|-------|-------------|
| **App** | Root of the CDK application — contains one or more stacks |
| **Stack** | Maps 1:1 to a CloudFormation stack; the unit of deployment |
| **Construct** | A cloud component (e.g., an S3 bucket, a Lambda function, a VPC); can be composed into higher-level patterns |

### Construct Levels
- **L1 (CfnResource)** — direct mapping to a CloudFormation resource; all properties explicit.
- **L2** — curated higher-level abstraction with sensible defaults (e.g., `aws_s3.Bucket`).
- **L3 (Patterns)** — opinionated patterns combining multiple resources (e.g., `aws_ecs_patterns.ApplicationLoadBalancedFargateService`).

### CDK in a Pipeline
- Same pattern as CloudFormation — developer commits CDK code to CodeCommit → CodeBuild synthesises the CDK to a CloudFormation template → CodePipeline deploys the stack.
- **CDK Pipelines** — a CDK construct for self-mutating CI/CD pipelines that deploy CDK applications.

### Exam Tips
- CDK = **high-level languages** → synthesises to **CloudFormation template** → CloudFormation provisions resources.
- CDK is preferred for developers who are more comfortable with Java/Python/TypeScript than YAML.
- The end result is still a CloudFormation stack — all CloudFormation features apply.
- CDK fits into pipelines just like CloudFormation templates do.

---

## Exam Tips (CloudFormation General)
- `Resources` is the **only required** section in a template.
- Use **Change Sets** before updating production stacks.
- **Drift detection** finds manually changed resources.
- **StackSets** = multi-account, multi-region deployment from one operation.
- StackSets + Organizations **service-managed** mode = auto-deploy to new accounts in an OU.
- **CDK** = high-level programming languages → CloudFormation under the hood.
