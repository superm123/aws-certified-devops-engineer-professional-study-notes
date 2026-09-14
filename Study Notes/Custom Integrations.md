
### ALB Origin Protection with WAF
Cloudfront → Custom HTTP Header (X-Origin-Verify: xxx) → WAF Filtering Rule → ALB

Secrete Manager → Auto Rotate → Lambda → Updates Cloudfront and WAF

### WAF Logs
WAF → Cloudwatch || Data Firehose || S3 Bucket

### Control Tower with Config
Control Tower → Event Bridge → SQS (FIFO) → Lambda → Cloudformation StackSets → Deploy AWS Config Conformance Packs into new Account


---

## Security Hub

### Overview
- **Aggregates security findings** from multiple AWS services into a single dashboard.
- Sources: **GuardDuty, Inspector, Macie, IAM Access Analyzer, Config, Firewall Manager, Partner solutions**.
- Automatically checks against security standards (CIS AWS Foundations, AWS Foundational Security Best Practices, PCI-DSS).

### Multi-Account Setup
- Enable Security Hub with **AWS Organizations** using a delegated administrator.
- Trusted access for each service must be enabled (e.g., Config, GuardDuty) before Security Hub can aggregate their findings.
- Central admin account gets findings from all member accounts.

### Security Hub → Automation Pattern
```
Security Hub Finding → EventBridge → Lambda / SSM Automation / SNS
```
- Example: Security Hub finding "port 22 open to 0.0.0.0/0" → EventBridge → Lambda → modify Security Group.

---

## Amazon Macie

### Overview
- **Managed data security service** that uses ML to discover and protect **sensitive data in S3**.
- Detects **PII** (Personally Identifiable Information), financial data, credentials, and other sensitive content.
- Keyword: **"PII discovery in S3" → Macie**.

### How It Works
1. Macie scans S3 buckets you specify (or all buckets).
2. Generates **findings** for sensitive data discovered.
3. Findings sent to **EventBridge** and **Security Hub**.

### Use Cases
- Compliance requirements (GDPR, HIPAA, PCI) — prove you know where PII lives.
- Alert on unexpected PII in unintended buckets.
- Inventory of sensitive data across S3.

### Automation Pattern
```
Macie Finding (PII found) → EventBridge → Lambda → notify / quarantine / encrypt bucket
```

### Exam Tips
- Macie = **PII / sensitive data in S3** using ML.
- Compare: GuardDuty = threat detection; Inspector = CVE scanning; Macie = PII/sensitive data.
- Findings routed through EventBridge for automated response.

---

## Service Catalog

### Overview
- Allows IT administrators to create, manage, and distribute **approved product catalogues** to end users.
- End users (developers) can **self-service deploy approved products** without needing IAM permissions to the underlying services.
- Products are defined using **CloudFormation templates** (or Terraform).

### Key Concepts
| Concept | Description |
|---------|-------------|
| **Portfolio** | Collection of products; a folder of approved configurations |
| **Product** | A deployable resource or application (backed by a CloudFormation template) |
| **Constraint** | Rules governing how a product can be launched (IAM, template, notification, tag constraints) |
| **Provisioned Product** | A running instance of a product launched by an end user |

### Governance Benefits
- End users get exactly the approved resources — no more, no less.
- Admins maintain control over infrastructure standards without blocking developers.
- Integrates with **AWS Organizations** — share portfolios across accounts.
- **Tag enforcement** — ensure consistent tagging via tag update constraints.

### Exam Tips
- Service Catalog = **self-service approved products** with governance.
- Products backed by **CloudFormation templates**.
- Share portfolios across accounts via Organizations.
- Separates **infrastructure governance** from **developer velocity**.

---

## AWS Trusted Advisor

### Overview
- Provides **best practice recommendations** across 5 pillars:
  1. **Cost Optimisation** — underutilised resources, reserved instance opportunities.
  2. **Performance** — high-utilisation EC2, CloudFront optimisation.
  3. **Security** — open security groups, MFA on root, S3 bucket permissions, exposed access keys.
  4. **Fault Tolerance** — snapshots, Multi-AZ, Route 53 health checks.
  5. **Service Limits** — approaching AWS service limits.

### Tiers
- **Basic/Developer** — 7 core checks (security + service limits only).
- **Business/Enterprise** — all checks + AWS Support API + programmatic access.

### Exam Tips
- Trusted Advisor = **best practices advisor** (not a configuration recorder — that's Config).
- Know that security checks include: **exposed access keys, open security group ports, S3 public buckets, MFA on root**.
- Full Trusted Advisor access requires **Business or Enterprise Support**.

---

## AWS Amplify

### Overview
- Set of tools and features for **front-end mobile and web developers** to build full-stack applications on AWS.
- Covers: front-end development, back-end development, databases, DevOps, mobile apps.

### Two Main Services
| Service | Description |
|---------|-------------|
| **Amplify Studio** | Visual development environment for building full-stack apps (UI + backend) |
| **Amplify Hosting** | Git-based CI/CD workflow for deploying and hosting web apps (similar to Netlify/Vercel) |

### Amplify Hosting CI/CD
- Connect a **GitHub / CodeCommit / Bitbucket** repository.
- Amplify automatically builds and deploys on every `git push`.
- Feature branch deployments → unique preview URLs per branch.
- Custom domains supported.

### Exam Tips
- Amplify = **full-stack app development platform** for front-end/mobile developers.
- Amplify Hosting = managed **CI/CD + hosting** for web apps from a Git repo.
- Not a general-purpose deployment tool — it's targeted at front-end/mobile use cases.

---

## AWS CloudShell

### Overview
- Browser-based **pre-authenticated shell** in the AWS console.
- Comes pre-installed with AWS CLI, Python, Node.js, and common tools.
- Files persisted in home directory (~1 GB per region).
- Available in select regions (not all).
- Use cases: quick CLI operations without setting up local credentials; scripting; ad-hoc AWS management.

---

## EventBridge Automation Patterns (Exam Favourites)

### Config + SSM Automation (Auto-Remediation)
```
Config Rule (NON_COMPLIANT) → SSM Automation document → Remediate resource
```

### CodePipeline Failure Notification
```
CodePipeline state FAILED → EventBridge → SNS → Email/Slack
```

### Scheduled Lambda Execution
```
EventBridge Scheduled Rule (cron/rate) → Lambda → periodic task
```

### GuardDuty → Isolate Compromised EC2
```
GuardDuty Finding → EventBridge → Lambda → Modify Security Group → Isolate instance
```

### Inspector → Patch Trigger
```
Inspector High/Critical Finding → EventBridge → SNS + SSM Patch Manager task
```

### Multi-Account Security Alerting
```
GuardDuty / Security Hub (member) → EventBridge → Event Bus (central security account)
    → Lambda → Centralised alerting / ticketing
```
