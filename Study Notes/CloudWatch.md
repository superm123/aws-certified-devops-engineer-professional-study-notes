# Amazon CloudWatch

## Overview
- AWS's **monitoring and observability** service.
- Collects **metrics, logs, and events** from AWS services and custom applications.
- Enables **alarms, dashboards, automated actions**, and **log analytics**.

---

## CloudWatch Metrics

### Key Concepts
- **Namespace** — container for metrics (e.g., `AWS/EC2`, `AWS/Lambda`, custom namespaces).
- **Metric** — time-ordered data points (e.g., `CPUUtilization`).
- **Dimension** — name/value pair that identifies a metric (e.g., `InstanceId=i-1234`).
- **Resolution** — Standard (1-minute) or **High-Resolution** (1-second) for custom metrics.
- **Period** — the length of time used to evaluate a metric.
- **Statistics** — aggregations over a period: `Average`, `Minimum`, `Maximum`, `Sum`, `SampleCount`, `pNN.NN` (percentiles).
- **Retention** — metrics retained for up to **15 months** (granularity degrades over time).

### Default vs Custom Metrics
- **Default** metrics: CPU, network, disk I/O, status checks (from the EC2 hypervisor).
- **Custom** metrics: memory, disk utilisation, application-level — require **CloudWatch Agent** or PutMetricData API call.

---

## CloudWatch Alarms
- Watches a **single metric** over a specified period and performs actions.
- **States:** `OK`, `ALARM`, `INSUFFICIENT_DATA`.
- **Actions when ALARM:**
  - Send **SNS notification**.
  - Trigger **Auto Scaling** action.
  - Trigger **EC2 action** (stop, terminate, reboot, recover).
- **Composite Alarms** — combine multiple alarms with AND/OR logic to reduce alarm noise.

---

## CloudWatch Logs

### Key Concepts
- **Log Group** — container for log streams from the same source (e.g., `/aws/lambda/my-function`).
- **Log Stream** — sequence of log events from a single source instance.
- **Retention** — configurable per log group (1 day to forever); default = never expire.

### Sending Logs to CloudWatch
- **CloudWatch Agent (Unified Agent)** — installed on EC2 or on-premises; collects:
  - System logs (syslog, Windows Event Log)
  - Application logs
  - Custom metrics (memory, disk) alongside logs
  - Config file: `/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`
- **Lambda** — automatically sends logs to CloudWatch Logs (requires execution role with `logs:CreateLogGroup` etc.).
- **ECS / EKS** — use `awslogs` log driver or Fluent Bit sidecar.
- **VPC Flow Logs** — can be sent to CloudWatch Logs or S3.
- **CloudTrail** — can deliver logs to CloudWatch Logs.

### CloudWatch Logs Insights
- Interactive **SQL-like query language** to search and analyse log data.
- Query syntax: `fields`, `filter`, `stats`, `sort`, `limit`, `parse`.
- Example:
  ```
  fields @timestamp, @message
  | filter @message like /ERROR/
  | sort @timestamp desc
  | limit 20
  ```
- Results can be saved as queries and visualised in dashboards.
- Billed per data scanned.

### Metric Filters
- Extract **numeric metrics from log data** — turn log text into CloudWatch metrics.
- Pattern-match on log events → increment a counter → create an **alarm** on that metric.
- Example: count `ERROR` occurrences in Lambda logs → alarm if > 5 in 5 minutes.

### Logs Subscriptions
- Stream log data in **near-real-time** to:
  - **Lambda** — process/transform and send elsewhere.
  - **Kinesis Data Streams** — real-time analytics.
  - **Kinesis Firehose** → S3, Redshift, OpenSearch.
- **Cross-account log sharing** using subscription filters.

---

## CloudWatch Unified Agent
- Single agent that handles **both metrics and logs**.
- Replaces older CloudWatch Logs Agent (logs only) and SSM Agent metric collection.
- Configured via **SSM Parameter Store** for centralised config management.
- Collects **memory, disk utilisation, swap** (not available as default EC2 metrics).
- Supported on Linux and Windows.

---

## VPC Flow Logs
- Capture **IP traffic information** to/from network interfaces in a VPC.
- Can be created at: **VPC**, **Subnet**, or **ENI** level.
- Destinations: **CloudWatch Logs**, **S3**, or **Kinesis Data Firehose**.
- Log record fields include: `srcaddr`, `dstaddr`, `srcport`, `dstport`, `protocol`, `action` (ACCEPT/REJECT), `bytes`, `packets`.
- Use cases:
  - Diagnose overly restrictive Security Group / NACL rules.
  - Monitor traffic reaching your instance.
  - Detect unusual traffic / security incident investigation.
- **Does NOT capture** DNS queries, DHCP traffic, traffic to/from instance metadata service (169.254.169.254).

---

## CloudWatch Dashboards
- Multi-metric, multi-region, cross-account visualisations.
- Widgets: **line, stacked area, number, gauge, text, alarm status, log table, explorer**.
- Shareable with users who don't have AWS console access (public dashboard or signed URL).

---

## CloudWatch Events → EventBridge
- **CloudWatch Events has been renamed to Amazon EventBridge**.
- All existing CloudWatch Events rules still work.
- EventBridge adds: SaaS event buses, schema registry, pipes, and more.

---

## Exam Tips
- **Memory and disk metrics require CloudWatch Agent** — not collected by default.
- **Logs Insights** = SQL-like query over log groups — use for ad-hoc analysis.
- **Metric Filters** = create a metric from log content — use for alarms on log patterns.
- **Subscription filters** = stream logs in near-real-time to Lambda/Kinesis.
- **VPC Flow Logs** = network traffic capture; does NOT capture DNS or metadata traffic.
- **Unified Agent** = single agent for both custom metrics and logs; configured via SSM Parameter Store.
- **Composite Alarms** = AND/OR multiple alarms to reduce noise.
- Retention on log groups defaults to **never expire** — always set an explicit retention policy to manage cost.
