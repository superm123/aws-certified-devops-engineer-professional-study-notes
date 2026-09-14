# Amazon Inspector

## Overview
- Automated **vulnerability assessment** service for EC2 instances, container images, and Lambda functions.
- Scans for **software vulnerabilities (CVEs)** and **unintended network exposure**.
- Keyword: **"vulnerability assessment" → Inspector**.
- Inspector v2 (current) is **automatic and continuous** — no need to schedule assessments manually.

## What Inspector Scans
| Target | What Is Checked |
|--------|----------------|
| **EC2 Instances** | OS/software CVEs, network reachability (open ports/paths from internet) |
| **ECR Container Images** | Software package CVEs in container layers |
| **Lambda Functions** | Software package CVEs in function code and layers |

## How It Works
1. **SSM Agent** must be installed on EC2 instances (for software vulnerability scanning).
2. Inspector automatically discovers instances, images, and Lambda functions across accounts.
3. Continuously scans and re-evaluates as new CVEs are published.
4. Generates **findings** with:
   - Severity score (Critical, High, Medium, Low, Informational)
   - CVE identifier
   - Affected resource
   - Remediation guidance

## Inspector Findings → Automation
```
Inspector Finding → EventBridge / Security Hub → Lambda / SNS / Jira / Ticket
```
- Automated patch triggering via **SSM Patch Manager** on high/critical findings.
- Route findings to **Security Hub** for centralised view.

## Multi-Account Management
- **Inspector delegated administrator** via AWS Organizations.
- Centrally manage Inspector across all member accounts.
- Aggregate findings from all accounts in one place.

## Exam Tips
- Inspector = **CVE scanning and network exposure** on EC2, ECR, Lambda.
- Inspector v2 = automatic, **continuous** (re-scans when new CVEs are published).
- **SSM Agent** is required on EC2 for software vulnerability scanning.
- Compare:
  - **GuardDuty** = threat detection (active malicious behaviour).
  - **Inspector** = vulnerability assessment (potential weaknesses).
  - **Macie** = PII/sensitive data discovery in S3.
  - **Security Hub** = aggregates all findings.
- Finding → EventBridge → Lambda → **SSM Automation** = automated patching pattern.
