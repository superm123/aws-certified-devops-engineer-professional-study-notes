# EC2 Image Builder

## Overview
- Service to **automate the creation, management, and testing** of **golden AMIs** and Docker container images.
- Eliminates manual, error-prone AMI creation.
- **Golden AMI** — a standardised, security-hardened, fully patched base image that your organisation always uses for new instances.

## What It Can Build
- **EC2 AMIs** (Amazon Machine Images) — Linux or Windows.
- **Docker container images** — for ECR.

## How It Works
```
Base Image → Image Recipe (customise + harden) → Build → Test → Distribute AMI
```

1. **Base Image** — start from an existing AMI (e.g., Amazon Linux 2, Windows Server 2022) or a previous pipeline output.
2. **Image Recipe** — defines the build steps:
   - Install components (software packages, security agents, hardening scripts).
   - Apply patches.
   - Run custom scripts.
3. **Infrastructure Configuration** — specifies the instance type, VPC, IAM role, and security groups for the build instance.
4. **Distribution Settings** — distribute the final AMI to specific AWS regions and accounts.
5. **Test** — run automated tests against the built image before distribution (e.g., test that required services start correctly).

## Image Pipeline
- Ties together the recipe + infrastructure config + distribution + test.
- Can be triggered:
  - **On a schedule** (e.g., weekly patch updates).
  - **Manually**.
  - **Via EventBridge** (e.g., when AWS releases a new base AMI version).

## Automated Patch Updates
- Configure the pipeline to pull the **latest AWS-provided base AMI** automatically.
- Schedule builds so the golden AMI is always up to date with the latest OS patches.

## Integration with CI/CD
```
AWS releases new AMI → EventBridge rule → trigger Image Builder pipeline
                                              → new Golden AMI
                                              → EventBridge event on success
                                              → CodePipeline / CloudFormation deploys new AMI
```

## Service Role
- Image Builder creates a default IAM service role: **EC2InstanceProfileForImageBuilder**.
- The role is attached to the build instance and needs permissions to access SSM, S3, etc.

## Exam Tips
- **Golden AMI** = consistent, security-hardened base image → use EC2 Image Builder.
- Can build both **AMIs and Docker images**.
- **Image Recipe** = the customisation/hardening steps applied during the build.
- Automated scheduling ensures AMIs stay patched without manual effort.
- Output AMI → deploy via **CloudFormation**, **Launch Templates**, or **Auto Scaling Groups**.
- Reduces configuration drift — all new instances start from the same known-good image.
