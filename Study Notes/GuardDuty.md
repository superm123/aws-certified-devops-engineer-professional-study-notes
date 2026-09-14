# Amazon GuardDuty

## Overview
- **Intelligent threat detection** service — uses machine learning, anomaly detection, and threat intelligence.
- Analyses **data sources** to detect malicious or unauthorised activity.
- Fully managed — no agents, no hardware to deploy.
- Keyword: **"threat detection" → GuardDuty**.

## Data Sources Analysed
| Data Source | What It Provides |
|-------------|----------------|
| **VPC Flow Logs** | Unusual network traffic patterns |
| **CloudTrail Management Events** | Suspicious API calls (e.g., unauthorized IAM changes) |
| **CloudTrail S3 Data Events** | Suspicious S3 access patterns |
| **DNS Logs** | Malware communicating via DNS (C2 traffic) |
| **EKS Audit Logs** | Suspicious Kubernetes API activity |
| **Lambda Network Activity** | Unusual Lambda network behaviour |
| **RDS Login Events** | Brute force or unusual database login attempts |
| **Malware Protection** | Scans EC2 and EBS volumes for malware |

> GuardDuty does NOT require you to enable VPC Flow Logs or CloudTrail separately — it accesses these independently.

## Finding Types
- **Reconnaissance** — port scanning, unusual API calls probing account.
- **Instance Compromise** — cryptocurrency mining, backdoor communication, data exfiltration.
- **Account Compromise** — unusual login patterns, API calls from known malicious IPs/TOR nodes.
- **Bucket Compromise** — exposed S3 bucket being accessed by unusual sources.

## Findings Severity
`LOW` → `MEDIUM` → `HIGH`

## Automated Response Pattern
```
GuardDuty Finding → EventBridge → Lambda / SNS / Step Functions
```
- Trigger automated remediation:
  - **Isolate compromised EC2** (modify Security Group to deny all traffic).
  - **Revoke IAM credentials** of compromised user.
  - **Snapshot EBS volume** for forensics.
  - **Alert security team** via SNS.

## Multi-Account Management
- **GuardDuty delegated administrator** in AWS Organizations.
- One management account can enable/manage GuardDuty across **all member accounts**.
- Centralised findings in the delegated admin account.
- Prevents member accounts from disabling GuardDuty.

## Suppression Rules
- Automatically archive findings matching specified criteria (reduces noise from known-safe activity).

## Trusted IP List / Threat Intel
- **Trusted IP list** — suppress findings from known safe IPs (e.g., corporate NAT gateway).
- **Custom threat intelligence** — upload your own lists of known malicious IPs/domains.

## Exam Tips
- GuardDuty = **threat detection** using ML and threat intel.
- Analyses VPC Flow Logs, CloudTrail, DNS logs **without you having to set them up**.
- Finding → **EventBridge** → **Lambda** for automated remediation is the key pattern.
- Multi-account: use **GuardDuty delegated admin** via Organizations.
- Compare with:
  - **Inspector** = vulnerability assessment (CVEs, network exposure) on EC2/containers.
  - **Macie** = sensitive data (PII) discovery in S3.
  - **Security Hub** = aggregates findings from GuardDuty, Inspector, Macie, Config, etc.
