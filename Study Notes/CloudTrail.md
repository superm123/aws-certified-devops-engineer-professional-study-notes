# AWS CloudTrail

## Overview
- Service that provides **governance, compliance, and risk auditing** of your AWS account.
- Records **API calls** made to AWS services — who did what, from where, and when.
- Keyword on the exam: **"auditing" → think CloudTrail**.

## What CloudTrail Records
- Every API call made via: **Console, CLI, SDK, services acting on your behalf**.
- Log fields include: `eventTime`, `userIdentity`, `eventName`, `sourceIPAddress`, `requestParameters`, `responseElements`, `awsRegion`.

## Trail Types
| Type | Scope |
|------|-------|
| **Management events** (default on) | Control plane operations — create/delete/modify resources |
| **Data events** | Object-level operations — S3 `GetObject`, Lambda `Invoke` (high volume, optional) |
| **Insights events** | Detects unusual API call volumes (anomaly detection) |

## Storage & Delivery
- Logs delivered to **S3 bucket** (primary).
- Can stream to **CloudWatch Logs** for metric filters and alerting.
- Can stream to **CloudWatch Events / EventBridge** for automated response.
- Log files are **SSE-S3 or SSE-KMS encrypted**.
- Log file **integrity validation** — uses SHA-256 hashing to detect tampering.

## CloudTrail + CloudWatch Integration
```
API Call → CloudTrail → CloudWatch Logs → Metric Filter → Alarm → SNS/Lambda
```
- Create **metric filters** on CloudTrail logs to count specific events (e.g., `DeleteBucket`).
- Trigger alarms and notifications when thresholds are exceeded.

## CloudTrail + EventBridge Integration
```
API Call → CloudTrail → EventBridge rule → Target (Lambda / SNS / SSM)
```
- Near-real-time event routing for **automated remediation**.
- Example: Root account login detected → EventBridge → Lambda → alert + disable root access keys.

## Multi-Region & Organisation Trails
- Create a **single trail** covering **all regions** (`--is-multi-region-trail`).
- Create an **organisation trail** in AWS Organizations management account to cover all member accounts.
- All logs centralised to a single S3 bucket.

## CloudTrail Lake
- Managed **data lake** for CloudTrail events — queryable with SQL.
- Stores events for up to **7 years**.
- No need to manage S3 + Athena setup separately.

## Exam Tips
- **Auditing** keyword → CloudTrail.
- By default, trails store **management events**; **data events** (S3 object-level) are opt-in.
- CloudTrail logs + CloudWatch Logs → metric filters → alarms → SNS = audit alerting pattern.
- **Log integrity validation** detects tampered log files.
- Organisation trail = one trail covering all accounts in the org.
- CloudTrail is NOT real-time — typical delivery delay is ~15 minutes; use EventBridge for near real-time.
