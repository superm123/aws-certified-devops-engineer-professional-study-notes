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

---

## 9. Extended Reference — Topics Added from PDF Consolidation

> This section fills gaps identified from the Pluralsight course PDFs that were not fully covered in the original guide.

---

### 9.1 SDLC Automation — Additional Services

#### AWS CodeCommit
- Managed **Git-based source code repository** — no server management.
- Compatible with all Git commands. Integrates with CodeBuild, CodeDeploy, CodePipeline.
- **Other supported pipeline sources:** GitHub, Bitbucket, GitLab, **S3 (versioning must be enabled)**.
- Security: IAM policies, HTTPS/SSH auth, encryption at rest (KMS), resource-based policies for cross-account access.
- `AWSCodeCommitPowerUser` — developer-level policy (all actions except repo create/delete).
- **Triggers** — fire on push/branch events → invoke Lambda or SNS for automation.

#### AWS CodeArtifact
- Managed **package repository** (npm, PyPI, Maven, NuGet, Swift, Cargo).
- **Domain** — top-level grouping; performs deduplication (pay once for same package version across repos).
- **Upstream connections** — cache packages from public registries (npmjs.com, PyPI, Maven Central) locally.
- Use in CodeBuild: fetch dependencies from CodeArtifact instead of public internet for security + reliability.

#### Amazon CodeGuru
- **Reviewer** — ML-powered automated code review on PRs; detects bugs, security issues, resource leaks, AWS API misuse.
- **Profiler** — runtime performance profiling; identifies expensive lines of code; works in build/test and production.
- **Secrets Detector** — scans code for hard-coded credentials; recommends moving to Secrets Manager.

#### EC2 Image Builder
- Automates building, testing, and distributing **golden AMIs** and **Docker images**.
- **Image Recipe** — defines customisation/hardening steps (install software, apply patches, run scripts).
- Schedule pipeline to keep AMIs up to date with latest patches automatically.
- Integrates with EventBridge: trigger rebuild when AWS releases a new base AMI.

#### Jenkins on AWS
- **Open-source** build/orchestration tool; can replace CodeBuild or CodePipeline.
- **Master-agent architecture** — build workers run in an **Auto Scaling group** for elasticity.
- Plugins: CodeBuild, CodePipeline, CodeDeploy, S3, EC2.
- Multiple Jenkins masters in multiple AZs for high availability.

#### Pipeline Testing Types
| Stage | Test Type |
|-------|-----------|
| Build | Unit tests, static code analysis |
| Post-build | Integration tests, service/API tests |
| Pre-deploy | UAT, performance/load tests, compliance tests |
| Post-deploy | Smoke tests, end-to-end tests |

**Testing Pyramid:** Unit (many, cheap) → Integration → Service/API → UI/E2E (few, expensive).

#### AWS Amplify
- Full-stack mobile and web development platform.
- **Amplify Studio** — visual development environment (UI + backend).
- **Amplify Hosting** — Git-based CI/CD + hosting; auto-deploy on `git push`; feature branch preview URLs.

---

### 9.2 Configuration Management — Additional Topics

#### AWS CDK (Cloud Development Kit)
- Framework to define infrastructure using **high-level languages**: TypeScript, Python, Java, C#, Go.
- **Synthesises to a CloudFormation template** — CloudFormation deploys the stack.
- Building blocks: **App** (root) → **Stack** (CF stack) → **Construct** (cloud component).
- Construct levels: L1 (raw CF resource), L2 (curated abstraction with defaults), L3 (pattern — multiple resources).
- Reduces hundreds of YAML lines to tens of code lines for complex resources (VPC, networking).

#### CloudFormation StackSets — Key Details
- **Admin account** deploys to **target accounts** across multiple regions.
- Permission models: **Self-managed** (manual IAM roles) vs **Service-managed** (AWS Organizations).
- **Automatic deployment** — with Organizations, new accounts added to an OU get the stack deployed automatically.
- `Maximum concurrent accounts` and `failure tolerance` control rollout behaviour.

#### OpsWorks Modes (Quick Reference)
| Mode | Description |
|------|-------------|
| **Stacks** | Chef Solo; define layers; no managed master |
| **Chef Automate** | AWS-managed Chef server |
| **Puppet Enterprise** | AWS-managed Puppet master |
- Supports **hybrid** (on-premises nodes reachable by Chef/Puppet).

---

### 9.3 Monitoring & Logging — Additional Topics

#### AWS CloudTrail
- Records all **API calls** to AWS (Console, CLI, SDK, services).
- **Management events** — default on (control-plane: create/delete/modify).
- **Data events** — optional (S3 object-level operations, Lambda invocations).
- **Insights events** — anomaly detection on unusual API volumes.
- Logs → S3 (primary) + optional CloudWatch Logs delivery.
- **Log integrity validation** — SHA-256 hash; detects tampered log files.
- **Organisation trail** — one trail covers all accounts in the org.
- Near-real-time response: CloudTrail → EventBridge → Lambda/SSM.

#### AWS X-Ray — Key Details
- **Service Map** — visual topology with health color codes (Green/Yellow/Red).
- **Annotations** — searchable key-value pairs; **Metadata** — non-searchable context.
- **X-Ray Daemon** — sidecar on UDP 2000; required on EC2, ECS (sidecar container), Lambda (built-in).
- **Sampling** — not every request recorded by default; custom sampling rules available.

#### CloudWatch Unified Agent
- Single agent for both **custom metrics** (memory, disk, swap) and **logs**.
- Configured via **SSM Parameter Store** for centralised fleet management.
- Replaces older CloudWatch Logs Agent and SSM metric collection.

#### VPC Flow Logs — Does NOT Capture
Instance metadata (169.254.169.254), DNS, DHCP, Windows license activation, Time Sync Service.

---

### 9.4 Incident & Event Response — Additional Patterns

#### Config Auto-Remediation (Full Pattern)
```
Config Rule (change trigger) → evaluates resource → NON_COMPLIANT
    → SSM Automation Document runs
    → Resource fixed
    → Config re-evaluates → COMPLIANT
    → (optional) EventBridge → SNS → notify team
```

#### GuardDuty → Remediation (Full Pattern)
```
GuardDuty finding (e.g., CryptoCurrency mining)
    → EventBridge rule
    → Lambda function
    → Modify Security Group (deny all traffic = isolate)
    → Snapshot EBS (forensics)
    → SNS notification to security team
```

#### Multi-Account Security Event Routing
```
GuardDuty / Config / Security Hub (member accounts)
    → EventBridge (member account)
    → Cross-account Event Bus (Security/SIEM account)
    → Lambda / Step Functions → centralised alerting / ticketing
```

---

### 9.5 Security & Compliance — Additional Topics

#### Network Security Hierarchy
| Layer | Service |
|-------|---------|
| DDoS (L3/L4) | AWS Shield (Standard = free; Advanced = paid) |
| Web attacks (L7) | AWS WAF (Web ACL on CloudFront/ALB/API GW) |
| VPC traffic filtering | AWS Network Firewall (stateful; IDS/IPS) |
| Instance-level | Security Groups + NACLs |
| Central policy mgmt | AWS Firewall Manager (org-wide WAF/Shield/NF policies) |

#### Amazon GuardDuty — Key Details
- Data sources: VPC Flow Logs, CloudTrail, DNS logs, EKS audit logs, RDS login events, Lambda network activity.
- Finding types: Reconnaissance, Instance Compromise, Account Compromise, Bucket Compromise.
- Multi-account: **delegated administrator** via Organizations.
- Suppression rules to reduce noise from known-safe activity.

#### Amazon Inspector — Key Details
- Scans: EC2 (requires SSM Agent), ECR container images, Lambda functions.
- **Continuous** — re-evaluates automatically when new CVEs are published.
- Multi-account: delegated administrator.
- Remediation: Finding → EventBridge → SSM Patch Manager.

#### Amazon Macie
- ML-based discovery of **PII and sensitive data** in S3 buckets.
- Generates findings → EventBridge → Lambda (auto-quarantine/encrypt) or Security Hub.
- Use for compliance (GDPR, HIPAA, PCI).

#### AWS Service Catalog
- IT admins create **portfolios** of approved products (CloudFormation templates).
- End users self-service deploy approved products without direct IAM permissions to underlying services.
- Share portfolios across accounts via Organizations.
- Enforces **governance** (tagging, constraints, approval workflows).

#### AWS Organizations + Control Tower
- **Control Tower** — automated landing zone with guardrails (preventive = SCPs; detective = Config rules).
- **RAM (Resource Access Manager)** — share resources (subnets, TGW, Route 53 rules) across accounts.
- **CloudHSM** — dedicated single-tenant HSM; FIPS 140-2 Level 3; you manage keys (AWS has no access).
- **AWS Directory Service** — Managed Microsoft AD for domain join and SSO; trust with on-prem AD.

#### SSM Systems Manager at Scale
- **OpsCenter** — centralised operational issue (OpsItem) tracking; integrates with GuardDuty, Config, CloudWatch Alarms.
- **Inventory** — aggregate managed node metadata across all accounts into S3.
- **IoT Greengrass support** — SSM Agent on edge devices.
- **PrivateLink** — keep EC2 ↔ SSM traffic private (no internet); requires 3 VPC interface endpoints.

---

### 9.6 Updated Service Keyword Cheat Sheet

| Keyword / Scenario | Service |
|--------------------|---------|
| Auditing API calls | **CloudTrail** |
| PII / sensitive data in S3 | **Macie** |
| CVE scanning / vulnerability assessment | **Inspector** |
| Threat detection / anomalous behaviour | **GuardDuty** |
| Aggregate security findings | **Security Hub** |
| DDoS protection | **AWS Shield** |
| Layer 7 web attack filtering | **AWS WAF** |
| VPC stateful firewall / IDS / IPS | **Network Firewall** |
| Central firewall policy across org | **Firewall Manager** |
| Config management (Chef/Puppet) | **OpsWorks** |
| Distributed tracing / microservices debug | **AWS X-Ray** |
| Code quality review on PRs | **CodeGuru Reviewer** |
| Runtime performance profiling | **CodeGuru Profiler** |
| Hard-coded secrets in code | **CodeGuru Secrets Detector** |
| Golden AMI automation | **EC2 Image Builder** |
| Package repository (npm/PyPI/Maven) | **CodeArtifact** |
| Full-stack web/mobile app platform | **AWS Amplify** |
| Approved products self-service | **Service Catalog** |
| High-level IaC (TypeScript/Python/Java) | **AWS CDK** |
| Multi-account stack deployment | **CloudFormation StackSets** |
| Dedicated HSM hardware | **CloudHSM** |
| Managed Microsoft AD | **Directory Service** |
| Share resources across accounts | **RAM** |
| Automated multi-account governance | **Control Tower** |
