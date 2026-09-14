# AWS CodePipeline

## Overview
- Fully managed **continuous delivery** service to model, visualize, and automate release pipelines.
- Orchestrates the flow of code changes from **source → build → test → deploy**.
- Pipelines must have a **minimum of 2 stages** (source + one other).
- Each stage contains one or more **actions** (sequential or parallel).
- Artifacts between stages are stored in an encrypted **S3 artifact bucket**.

## Pipeline Structure
```
Source Stage → Build Stage → Test Stage → Approval Stage → Deploy Stage
```

### Action Categories
| Category | Examples |
|----------|---------|
| **Source** | CodeCommit, S3, GitHub, Bitbucket, ECR |
| **Build** | CodeBuild, Jenkins |
| **Test** | CodeBuild, Jenkins, BlazeMeter, Ghost Inspector |
| **Deploy** | CodeDeploy, CloudFormation, Elastic Beanstalk, ECS, S3 |
| **Approval** | Manual approval (SNS notification to approver) |
| **Invoke** | Lambda function |

> **Exam tip:** Drop-downs in the console reveal what's supported — e.g., build providers include CodeBuild **and** Jenkins.

## Manual Approval Actions
- Inserts a **stop sign** before a stage (typically before deploying to prod).
- Sends an **SNS notification** to reviewers/approvers.
- Pipeline is paused until an approver approves or rejects.
- Restrict who can approve via **IAM policies** (`codepipeline:PutApprovalResult`).
- Common use cases: code review gate, QA sign-off, compliance checkpoint.

## Continuous Delivery vs Continuous Deployment
| Term | Behaviour |
|------|-----------|
| **Continuous Delivery** | Automated pipeline up to (but not including) prod deploy; manual approval required |
| **Continuous Deployment** | Fully automated end-to-end including prod deploy; no manual gates |

## CodePipeline + EventBridge
- CodePipeline **reports every state change** as an event to EventBridge (CloudWatch Events).
- You can create **custom EventBridge rules** to react to pipeline events:
  - Stage starts/succeeds/fails
  - Pipeline execution state changes
  - Action state changes
- EventBridge targets: **Lambda, SNS, SQS, CodeBuild, another pipeline**.
- Pattern: EventBridge → SNS → notify on pipeline failure.

## Cross-Account Pipeline Deployments
- Pipeline in a **central/dev account** deploys to **test and prod accounts**.
- The pipeline **assumes a cross-account IAM role** in the target account.
- Steps:
  1. Deploy to dev (same account).
  2. Pipeline assumes cross-account role → deploys to test account.
  3. (Optional manual approval) → pipeline assumes role → deploys to prod account.
- Cross-account artifact access: grant S3 and KMS permissions to the target account.

## Multi-Account Environment Pattern
```
Dev Account (loose controls) → Test Account (tighter) → Prod Account (most restrictive)
```
- Dev: developers have more freedom, rapid iteration.
- Test: automated test gates, stricter IAM.
- Prod: minimal direct access, all changes via pipeline.

> **Exam tip:** Isolation of errors + limiting blast radius are the main reasons to use multi-account deployments.

## Pipeline Testing Types
| Stage | Test Type | Purpose |
|-------|-----------|---------|
| Build | **Unit tests** | Test individual units/functions of code |
| Build | **Static code analysis** | Scan code for errors, security holes, style issues without running it |
| Post-build | **Integration tests** | Test how components interact |
| Pre-deploy | **UAT (User Acceptance Testing)** | Validate business requirements |
| Pre-deploy | **Performance/load tests** | Validate under load |
| Post-deploy | **Compliance tests** | Regulatory/policy checks |

**Testing Pyramid** (from cheapest/fastest at base to most expensive at top):
```
          /  UI/E2E  \     ← most expensive, fewest
         / Integration \
        /   Service/API  \
       /     Unit Tests    \ ← cheapest, most numerous
```

## CodePipeline with Lambda (Invoke Action)
Lambda can be invoked as an action from a pipeline stage. Use cases:
- Deploy to non-natively supported targets.
- Run custom validation or approval logic.
- Notify external systems.
- Transform/manipulate artifacts between stages.

## Jenkins Integration
- Jenkins can **replace CodeBuild** (build provider) or **replace CodePipeline** (orchestrator).
- Jenkins deployed in a **master-agent** (master-worker) configuration.
- Build workers run in an **Auto Scaling group** for elasticity.
- Jenkins plugins available for: **CodeBuild, CodePipeline, CodeDeploy, S3, EC2**.
- Multiple masters in multiple AZs for HA.
- Jenkins is **open-source** — preferred when teams have existing Jenkins investment.

> **Exam tip:** Jenkins = open-source; CodePipeline = AWS managed. Both can orchestrate deployments.

## CodePipeline Extras
- **Disable transition** between stages to pause a pipeline without deleting it.
- **Parallel actions** within a stage run simultaneously.
- **Stage retry** — retry a failed stage without restarting the whole pipeline.
- **CodeStar** — higher-level overlay that sets up CodeCommit + CodeBuild + CodePipeline + CodeDeploy with project templates.

## Deployment Scenarios (Exam)

### S3 Deployment
- Enable **versioning** on S3 bucket for use as source or target.
- CodeDeploy can deploy from S3 to EC2, ECS, or Lambda.

### ECS Deployment
- **Rolling update**: replace tasks gradually.
- **Blue/Green (CodeDeploy)**: deploy new task set, shift traffic via ALB listener rules, rollback by shifting traffic back.

### Lambda Deployment (via CodeDeploy)
- Uses **Lambda versions and aliases**.
- Traffic shifting: **Linear** (e.g., 10% every 10 min), **Canary** (e.g., 10% then 90%), **All-at-once**.
- Hooks: `BeforeAllowTraffic` / `AfterAllowTraffic` for validation.

### CloudFormation Deployment
- CodePipeline can deploy a **CloudFormation stack** as a deploy action.
- Action modes: `CREATE_UPDATE`, `DELETE_ONLY`, `REPLACE_ON_FAILURE`, `CHANGE_SET_EXECUTE`.

## Exam Tips
- Pipelines need **minimum 2 stages**.
- **Artifacts** are passed between stages via **encrypted S3**.
- Use **manual approval + SNS** for human gates before prod.
- Multi-account deploys use **cross-account IAM role assumption**.
- EventBridge monitors all pipeline state changes — use it to trigger notifications and automations.
- Jenkins can substitute for CodeBuild or CodePipeline.
- Static code analysis, unit tests → at **build** stage. Integration, performance, UAT → **post-build/pre-deploy**.
