# AWS Config

## Overview
- Service to **record, audit, and evaluate** the configurations of your AWS resources over time.
- Answers: *"What did this resource look like at any point in time? Is it compliant with my policies?"*
- Configuration data is stored in **S3** and can be queried via the Config console or API.
- Integrated with **CloudWatch Metrics** and **CloudTrail**.

## What It Records
- Resource configuration snapshots at point-in-time.
- Configuration history — every change tracked.
- Relationships between resources.

## Config Rules
- Evaluate resource configurations against desired settings.
- **AWS Managed Rules** — pre-built rules for common compliance checks (e.g., `s3-bucket-public-read-prohibited`, `ec2-instances-in-vpc`).
- **Custom Rules** — Lambda-backed rules for organisation-specific requirements.
- **Evaluation triggers:**
  - **Configuration change** — evaluates when a resource is created/changed.
  - **Periodic** — evaluates on a schedule (e.g., every 24 hours).

## Compliance States
- `COMPLIANT` — resource meets the rule requirements.
- `NON_COMPLIANT` — resource violates the rule.
- `NOT_APPLICABLE` — rule doesn't apply to this resource type.

## Automated Remediation
- Attach an **SSM Automation document** to a Config rule to auto-remediate non-compliant resources.
- Remediation can be:
  - **Automatic** — triggers immediately on non-compliance.
  - **Manual** — requires human to trigger from the Config console.
- Examples:
  - S3 bucket public read enabled → SSM Automation removes public access.
  - Security Group allows unrestricted SSH → SSM Automation closes port 22.
  - EC2 instance missing required tags → SSM Automation applies default tags.

```
Config Rule evaluates resource → NON_COMPLIANT finding
    → SSM Automation document triggered
    → Resource remediated
    → Re-evaluated → COMPLIANT
```

## Config + EventBridge
- Config emits events to **EventBridge** on rule evaluation results.
- Pattern: Config NON_COMPLIANT → EventBridge → Lambda (custom remediation) or SNS (notification).

## Aggregator

An aggregator is an AWS Config resource type that collects AWS Config configuration and compliance data from the following:

- Multiple accounts and multiple regions.
- Single account and multiple regions.
- An organization in AWS Organizations and all the accounts in that organization.

> **Exam tip:** Use an **aggregator** to get a centralised view of compliance across your entire organisation.

## Config + Organizations
- **Delegated administrator** account can manage Config across all member accounts.
- **Conformance Packs** — a collection of Config rules and remediation actions deployed as a single entity across accounts/regions.
- Deployed via **CloudFormation StackSets** or the Config console.

## Exam Tips
- Config = **record + audit resource configurations**; enforce compliance with rules.
- Remediation = **SSM Automation** documents (not Lambda directly — Lambda is used for custom rules).
- **Aggregator** = multi-account/multi-region compliance visibility.
- **Conformance Packs** = bundle of Config rules deployed organisation-wide.
- Config is NOT a prevention service — it detects and can remediate **after** the fact.
- Use Config with **CloudTrail** for full picture: Config = what changed; CloudTrail = who changed it.
