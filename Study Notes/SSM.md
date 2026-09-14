# AWS Systems Manager (SSM)

## Overview
- Central management service for **EC2 instances, on-premises servers, and hybrid environments**.
- Provides visibility and control of infrastructure at scale.
- Manages both **cloud instances** and **on-premises servers** registered as **managed nodes**.

---

## Key SSM Components

### Session Manager
- Browser or CLI-based interactive shell session to EC2 **without opening SSH/RDP ports**.
- No bastion hosts, no key pairs required.
- Sessions logged to **S3** and **CloudWatch Logs** for auditing.
- Works through AWS SSM Agent — outbound HTTPS only (port 443).

### Run Command
- Execute commands or scripts on **managed nodes** without SSH/RDP.
- Targets: individual instances, tag-based groups, resource groups.
- Logs output to **S3** or **CloudWatch Logs**.
- Use cases: software installation, configuration changes, scripted maintenance.

### Parameter Store
- Secure, hierarchical storage for **configuration data and secrets**.
- **Standard tier** — free, up to 4 KB per parameter.
- **Advanced tier** — paid, up to 8 KB, supports parameter policies (TTL/expiry notifications).
- **Types:** `String`, `StringList`, `SecureString` (KMS-encrypted).
- Integrates with: CloudFormation, CodeBuild, Lambda, ECS task definitions.

#### Secrets Manager vs Parameter Store
| Feature | Parameter Store | Secrets Manager |
|---------|----------------|-----------------|
| Secret rotation | Manual (or via Lambda) | Built-in **automatic rotation** |
| Cost | Free (Standard) | Paid per secret |
| Use case | Config + non-rotating secrets | Database credentials, API keys that rotate |

### Patch Manager
- Automates the process of **patching managed nodes** (EC2 and on-premises).
- Uses **patch baselines** — rules for auto-approving patches within days of their release.
- Can **scan** instances (report only) or **install** patches.
- Patch schedule defined by **Maintenance Windows**.
- Supports Linux and Windows instances (and Raspberry Pi OS).
- Can send compliance data to **AWS Config**.

```
Maintenance Window schedule
    → Patch Manager task
    → SSM Agent on instances
    → Installs approved patches
    → Reports compliance to SSM + Config
```

### Maintenance Windows
- Define a schedule for when to run potentially disruptive operations:
  - OS patching, driver updates, software installs, Run Command tasks, Automation documents.
- Components: `Window` (schedule), `Targets` (which instances), `Tasks` (what to run).

### Automation
- Run **Automation documents (runbooks)** to perform complex, multi-step operational tasks.
- AWS provides pre-built documents: `AWS-StopEC2Instance`, `AWS-PatchInstanceWithRollback`, etc.
- Custom documents can be created in YAML/JSON.
- Used for **AWS Config auto-remediation** — Config triggers SSM Automation on non-compliance.

### State Manager
- Ensures managed nodes maintain a **defined state** (configuration compliance).
- Applies and enforces configurations on a schedule.
- Use cases: ensure CloudWatch Agent is running, enforce software versions, apply OS hardening.

### Inventory
- Collects **metadata** about managed nodes: installed applications, OS details, network config, running services.
- Data queryable from SSM console.
- Can aggregate inventory data across accounts into an **S3 bucket** for analysis with Athena/QuickSight.

### OpsCenter
- Centralised location to view, investigate, and resolve **operational issues** (OpsItems).
- Integrates with: EventBridge, CloudWatch Alarms, Config, GuardDuty, Security Hub.
- OpsItems created automatically from findings or manually.

---

## SSM Agent
- Software installed on managed nodes (EC2 / on-premises / IoT Greengrass).
- Communicates with the SSM service over **HTTPS (port 443) outbound only** — no inbound ports needed.
- Pre-installed on: Amazon Linux 2, Windows Server 2016+, Ubuntu 16.04+.

---

## Hybrid Environment Setup
- Register on-premises servers as **managed nodes** using a **Hybrid Activation**.
- Requires an IAM service role and the SSM Agent installed on the on-premises server.
- Managed nodes in hybrid environments get an ID prefixed with `mi-` (not `i-`).

---

## SSM Advanced: IoT Greengrass Integration
- SSM Agent can be installed on **AWS IoT Greengrass** devices for edge device management.

---

## SSM with PrivateLink (VPC Endpoint)
- Access EC2 instances and SSM APIs **privately** (without internet) using **VPC Interface Endpoints**.
- Required endpoints: `com.amazonaws.<region>.ssm`, `com.amazonaws.<region>.ec2messages`, `com.amazonaws.<region>.ssmmessages`.

---

## Configuration Compliance
- SSM tracks patch compliance and State Manager association compliance.
- Compliance data viewable in the SSM console and exportable to S3.
- Integrates with **AWS Config** for organisation-wide compliance visibility.

---

## Exam Tips
- Session Manager = SSH without SSH ports — **no bastion, no key pair**.
- **Parameter Store** = config/secrets without rotation; **Secrets Manager** = secrets **with** automatic rotation.
- Patch Manager uses **patch baselines** and **maintenance windows**.
- SSM Automation documents used for **Config auto-remediation**.
- Hybrid managed nodes use `mi-` prefix IDs.
- SSM Agent communicates **outbound HTTPS only** — no inbound ports needed.
- Use **PrivateLink/VPC Endpoints** to keep SSM traffic private (no internet required).
