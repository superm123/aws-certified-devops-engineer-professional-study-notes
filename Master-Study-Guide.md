# AWS Certified DevOps Engineer - Professional (DOP-C02) Master Study Guide

Welcome to the comprehensive Master Study Guide for the **AWS Certified DevOps Engineer - Professional (DOP-C02)** exam. This guide synthesizes all domain breakdowns, architectural patterns, AWS operational tools, deployment strategies, and security frameworks into a single cohesive document.

---

## Table of Contents
1. [Exam Overview & Architecture Principles](#1-exam-overview--architecture-principles)
2. [Domain 1: SDLC Automation (22%)](#2-domain-1-sdlc-automation-22)
3. [Domain 2: Configuration Management and IaC (19%)](#3-domain-2-configuration-management-and-iac-19)
4. [Domain 3: Resilient Cloud Solutions (15%)](#4-domain-3-resilient-cloud-solutions-15)
5. [Domain 4: Monitoring and Logging (15%)](#5-domain-4-monitoring-and-logging-15)
6. [Domain 5: Incident and Event Response (14%)](#6-domain-5-incident-and-event-response-14)
7. [Domain 6: Security and Compliance (15%)](#7-domain-6-security-and-compliance-15)
8. [AWS Services Quick Reference & Exam Cheat Sheet](#8-aws-services-quick-reference--exam-cheat-sheet)

---

## 1. Exam Overview & Architecture Principles

### 📋 Exam Details
- **Exam Code:** DOP-C02
- **Level:** Professional
- **Questions:** 75 (Multiple choice / Multiple response)
- **Time:** 180 Minutes
- **Passing Score:** 750 / 1000

### 📚 Domain Weights
| Domain | Domain Title | Weight |
|---|---|---|
| Domain 1 | SDLC Automation | **22%** |
| Domain 2 | Configuration Management & Infrastructure as Code | **19%** |
| Domain 3 | Resilient Cloud Solutions | **15%** |
| Domain 4 | Monitoring and Logging | **15%** |
| Domain 5 | Incident and Event Response | **14%** |
| Domain 6 | Security and Compliance | **15%** |

---

## 2. Domain 1: SDLC Automation (22%)

### Continuous Integration & Continuous Delivery (CI/CD)

#### AWS CodePipeline
- **Overview:** Fully managed continuous delivery service for fast, reliable application and infrastructure updates.
- **Pipeline Structure:** Composed of **Stages** (Source, Build, Test, Deploy) containing one or more sequential or parallel **Actions**.
- **Action Categories:** Source (S3, CodeCommit, GitHub, ECR), Build (CodeBuild, Jenkins), Test, Deploy (CodeDeploy, CloudFormation, Elastic Beanstalk, ECS, S3), Approval (Manual), Invoke (AWS Lambda).
- **Artifacts:** CodePipeline passes revision artifacts between stages stored in an encrypted **Amazon S3 artifact bucket**.
- **Cross-Account Deployment Pattern:**
  1. Source pipeline in Central/Dev Account.
  2. S3 Artifact bucket encrypted with **AWS KMS Customer Managed Key (CMK)** with bucket policy allowing Target Account access.
  3. KMS Key policy allowing Target Account cross-account IAM role to `kms:Decrypt` and `kms:GenerateDataKey`.
  4. CodePipeline assumes cross-account IAM Role in Target Account (`sts:AssumeRole`) to execute deployment actions.

#### AWS CodeBuild
- **Overview:** Fully managed build service that compiles source code, runs tests, and produces software packages.
- **Build Specification (`buildspec.yml`):**
  - **Phases:** `install` (runtimes), `pre_build` (login to ECR, dynamic env vars), `build` (compilation, unit tests), `post_build` (packaging, pushing images/artifacts).
  - **Environment Variables:** Static plaintext, Parameter Store (`parameter-store`), Secrets Manager (`secrets-manager`).
  - **Artifacts:** Defines files/patterns to upload to S3 for downstream pipeline consumption.
  - **Cache:** Local cache (Docker layers, custom paths) or S3 cache to speed up subsequent builds.
- **VPC Access:** To access resources in a private VPC (e.g., RDS, internal endpoints), configure CodeBuild with VPC ID, Subnets, and Security Groups.

#### AWS CodeDeploy
- **Overview:** Automated deployment service for EC2 instances, on-premises servers, AWS Lambda, and ECS services.
- **AppSpec File (`appspec.yml`):**
  - **EC2 / On-Prem Lifecycle Hooks (Execution Order):**
    `ApplicationStop` ➡️ `DownloadBundle` ➡️ `BeforeInstall` ➡️ `Install` ➡️ `AfterInstall` ➡️ `ApplicationStart` ➡️ `ValidateService`
  - **ECS Lifecycle Hooks:** `BeforeInstall` ➡️ `AfterInstall` ➡️ `AfterAllowTestTraffic` ➡️ `BeforeAllowTraffic` ➡️ `AfterAllowTraffic`.
  - **Lambda Lifecycle Hooks:** `BeforeAllowTraffic` ➡️ `AfterAllowTraffic` (invokes test Lambda function before routing traffic).
- **Deployment Strategies:**
  - **In-Place:** Updates instances with latest revision (causes temporary capacity reduction).
  - **Blue/Green:** Provisions new set of instances (Green), deploys revision, tests, routes traffic via ALB, terminates old instances (Blue). Required for ECS and Lambda.

---

## 3. Domain 2: Configuration Management and IaC (19%)

### AWS CloudFormation & Infrastructure as Code

#### Core Components & Lifecycle
- **Template Sections:** `FormatVersion`, `Description`, `Parameters`, `Mappings`, `Conditions`, `Transform` (SAM/Serverless), `Resources` (Required), `Outputs`.
- **Change Sets:** Preview how proposed changes to a stack might impact running resources before executing updates.
- **Stack Policies:** Prevent accidental updates or deletions to critical resources (e.g., production database instances).
- **Stack Sets:** Create, update, or delete stacks across multiple accounts and AWS Regions with a single CloudFormation template. Integrates directly with **AWS Organizations** (`SERVICE_MANAGED` permission model) for auto-deployment to new OU accounts.

#### Advanced Drift Detection & Remediation
- **Drift Detection:** Identifies unrecorded infrastructure changes made outside CloudFormation management.
- **Nested Stacks vs. Cross-Stack References:**
  - **Nested Stacks (`AWS::CloudFormation::Stack`):** Used for modular reuse within the same deployment boundary (e.g., standard VPC architecture).
  - **Cross-Stack References (`Export` / `Fn::ImportValue`):** Share values (like VPC IDs, Subnet IDs) across completely separate stacks and lifecycles.

#### Custom Resources & Helper Scripts
- **Custom Resources (`AWS::CloudFormation::CustomResource`):** Trigger an AWS Lambda function or SNS topic to perform custom logic (e.g., database bootstrapping, external API calls) during stack creation, update, or deletion. Must send response signal back to CloudFormation S3 Signed URL.
- **Helper Scripts:**
  - `cfn-init`: Reads template metadata (`AWS::CloudFormation::Init`) to install packages, write files, and start services on EC2.
  - `cfn-signal`: Signals CloudFormation success/failure for `CreationPolicy` or `WaitCondition`.
  - `cfn-hup`: Daemon to check for metadata updates and re-apply `cfn-init`.

### AWS Systems Manager (SSM)

- **Parameter Store vs. Secrets Manager:**
  - **Parameter Store:** Plaintext/String/StringList and `SecureString` (KMS). Cost-effective, hierarchical parameter trees (`/prod/db/port`).
  - **Secrets Manager:** Built for secrets needing automatic rotation (RDS, API Keys), cross-account access natively, higher cost per secret.
- **State Manager:** Automates keeping EC2 and on-prem instances in defined state (e.g., antivirus updated, firewall enabled).
- **Patch Manager:** Automates patching EC2 instances with security/system updates using **Patch Baselines** and maintenance windows.
- **Run Command:** Remotely manage configurations at scale securely via SSM Agent without opening inbound SSH/RDP ports or managing key pairs.
- **Session Manager:** Interactive browser/CLI shell access to instances secured via IAM, with full session logging to S3/CloudWatch.

---

## 4. Domain 3: Resilient Cloud Solutions (15%)

### High Availability, Scaling & Disaster Recovery

#### Disaster Recovery (DR) Strategies
1. **Backup and Restore:** Low cost, RTO/RPO in hours/days. Regular S3/EBS snapshots, AMI cross-region replication.
2. **Pilot Light:** Minimal core infrastructure always running in DR region (e.g., active database replication like RDS Read Replica). App servers turned off or minimal ASG (0 instances). RTO in minutes.
3. **Warm Standby:** Scaled-down but fully functional copy of environment running in DR region. Traffic redirected via Route 53 during disaster; ASG scales up to full production load. RTO in seconds/minutes.
4. **Multi-Region Active-Active:** Full environment active in two or more regions simultaneously. Route 53 latency/geolocation routing. DynamoDB Global Tables, Aurora Global Database. RTO/RPO near zero.

#### Amazon Route 53 Routing Policies
- **Failover Routing:** Primary and Secondary health check routing for DR.
- **Weighted Routing:** Distribute traffic by percentages (ideal for Canary & Blue/Green infrastructure updates).
- **Latency-Based Routing:** Route users to the AWS region that provides lowest network latency.
- **Geolocation & Geoproximity Routing:** Route traffic based on caller's geographic location or distance.

#### Multi-Region Database Architectures
- **Amazon Aurora Global Database:** Active-passive multi-region database. Primary region handles reads/writes, up to 5 secondary read-only regions with sub-second cross-region replication latency. Storage-level physical replication. Fast failover (< 1 minute).
- **Amazon DynamoDB Global Tables:** Multi-master, active-active cross-region database. Concurrent writes in multiple regions with automatic conflict resolution (last writer wins).

---

## 5. Domain 4: Monitoring and Logging (15%)

### Observability Architecture

#### Amazon CloudWatch & Logs
- **CloudWatch Logs Insights:** Interactive query engine to analyze logs using Piped query syntax (`fields`, `filter`, `stats`, `sort`, `limit`).
- **Metric Filters:** Extract custom metric numeric values from log event streams in real time to trigger CloudWatch Alarms.
- **Unified CloudWatch Agent:** Collects system metrics (RAM memory utilization, disk space used, process stats) and application log files from EC2 and on-premises servers.
- **Logs Subscription Filters:** Stream real-time log events to **Amazon Kinesis Data Streams**, **Amazon Kinesis Data Firehose**, or **AWS Lambda** for centralized auditing or OpenSearch indexing.

#### AWS X-Ray & Distributed Tracing
- **Overview:** Analyzes and debugs distributed applications, microservices, and serverless architectures.
- **Key Concepts:**
  - **Segment:** Data sent by application containing compute resource stats, request details, and timing.
  - **Subsegment:** Granular timing breakdown for downstream HTTP calls, AWS service calls (S3, DynamoDB), or SQL database queries.
  - **Trace:** Path of an individual HTTP request passing through multi-tier microservices connected by a trace header (`X-Amzn-Trace-Id`).
  - **Service Map:** Visual chart showing inter-component latency, error rates (`4xx`), and fault rates (`5xx`).

#### VPC Flow Logs
- **Overview:** Captures IP traffic flow going to and from network interfaces in your VPC.
- **Targets:** S3 bucket, CloudWatch Logs group, Kinesis Data Firehose.
- **Fields:** `srcaddr`, `dstaddr`, `srcport`, `dstport`, `protocol`, `packets`, `bytes`, `action` (`ACCEPT` / `REJECT`).
- **Use Cases:** Troubleshooting Security Group / NACL rules, detecting suspicious outbound C2 connections.

---

## 6. Domain 5: Incident and Event Response (14%)

### Automated Remediation & Event-Driven Operations

#### Event-Driven Remediation Patterns
- **EventBridge Rules:** Capture real-time AWS API calls (via CloudTrail) or state changes (GuardDuty, Config) and trigger target actions (Lambda, Step Functions, Systems Manager Automation, SNS).
- **AWS Config Automated Remediation:** When AWS Config flags a resource as `NON_COMPLIANT` against an AWS Config Rule (e.g., `s3-bucket-public-read-prohibited`), it automatically invokes an **SSM Automation Document** to fix the resource (e.g., `AWS-DisableS3BucketPublicRead`).

#### Self-Healing Infrastructure Patterns
- **Auto Scaling Group Self-Healing:** ASG automatically replaces degraded or unhealthy EC2 instances based on EC2 status checks or custom ALB target group health checks.
- **Lambda Dead Letter Queues (DLQ) & Destination Routing:** Route failed asynchronous Lambda invocations to an **SQS DLQ** or **EventBridge On-Failure Destination** for automated retries and dead-letter analysis.

---

## 7. Domain 6: Security and Compliance (15%)

### Governance, Identity & Compliance

#### AWS Organizations & Service Control Policies (SCPs)
- **Overview:** Governance framework for central management of multiple AWS accounts.
- **Service Control Policies (SCPs):**
  - Define maximum allowable permissions for IAM entities in targeted AWS Accounts or Organizational Units (OUs).
  - **Guardrail mechanism:** SCPs **do not grant** permissions; they specify boundaries. If an SCP explicitly denies an action (`Deny`), no IAM policy inside the target account can override it.
  - Does not affect the AWS Account Root user or service-linked roles, but affects all IAM Users, Roles, and cross-account access inside member accounts.

#### AWS Security Hub & AWS GuardDuty
- **AWS Security Hub:** Aggregates, normalizes, and prioritizes security alerts (findings) from GuardDuty, Inspector, Macie, IAM Access Analyzer, and AWS Config against security standards (CIS AWS Foundations Benchmark, AWS Foundational Security Best Practices).
- **Amazon GuardDuty:** Intelligent threat detection service that continuously monitors VPC Flow Logs, CloudTrail logs, EKS audit logs, DNS logs, and S3 management events using machine learning to detect compromised instances, unauthorized access, and anomalous behavior.

#### AWS IAM & Identity Center
- **IAM Permission Boundaries:** Advanced IAM feature setting maximum permissions an IAM role/user can obtain, commonly used to delegate IAM role creation safely to developers without allowing privilege escalation.
- **AWS IAM Identity Center (successor to AWS Single Sign-On):** Centralizes SSO access to AWS accounts and cloud applications. Connects directly to external Identity Providers (IdP) via **SAML 2.0** or **SCIM** (Azure AD / Entra ID, Okta, Ping Identity).

---

## 8. AWS Services Quick Reference & Exam Cheat Sheet

| AWS Service | Core Purpose | Key Exam Trigger |
|---|---|---|
| **AWS CodePipeline** | Managed CI/CD Orchestrator | Automate multi-stage cross-account build/test/deploy releases. |
| **AWS CodeBuild** | Managed Build & Container Compiler | Run unit tests, build Docker images using `buildspec.yml`. |
| **AWS CodeDeploy** | Automate Software Deployments | Rolling, Canary, Blue/Green updates on EC2, ECS, Lambda using `appspec.yml`. |
| **AWS CloudFormation** | Declarative Infrastructure as Code | StackSets for multi-account/multi-region IaC deployment; Drift Detection. |
| **AWS Systems Manager** | Fleet Management & Config | Patch Manager, State Manager, Parameter Store, Session Manager without SSH. |
| **AWS Config** | Resource Inventory & Compliance Audit | Audit timeline, compliant/non-compliant rules with SSM auto-remediation. |
| **AWS Organizations** | Multi-Account Management | Service Control Policies (SCPs) for centralized account guardrails. |
| **Amazon EventBridge** | Event Bus Router | Decoupled event routing between CloudTrail/Config and Lambda/SSM targets. |
| **AWS Secrets Manager** | Encrypted Secret Rotation | Auto-rotating RDS passwords, API tokens, native cross-account access. |
| **AWS X-Ray** | Distributed Tracing | End-to-end trace view of microservice latency, bottleneck analysis (`X-Amzn-Trace-Id`). |
| **AWS Security Hub** | Security Compliance Aggregator | Unified view of security posture against CIS benchmarks and Security standards. |
