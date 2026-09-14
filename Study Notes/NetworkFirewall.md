# AWS Network Security Services

## AWS Network Firewall

### Overview
- **Stateful, managed Network Firewall** and intrusion detection/prevention service for VPCs.
- Filters traffic at the **network layer** (L3/L4) and application layer (L7 with domain/TLS filtering).
- Deployed in a **dedicated firewall subnet** within the VPC.
- Scales automatically.

### How It Works
```
Internet Gateway → [Firewall Subnet + Network Firewall] → Application Subnets
```
- Inbound and outbound traffic flows through the Network Firewall endpoint.
- Uses **route tables** to direct traffic through the firewall before it reaches application resources.

### Rule Groups
- **Stateless rules** — evaluate each packet independently (like NACLs); specify allow/drop/forward to stateful.
- **Stateful rules** — track connection state; can use Suricata-compatible IDS/IPS rules; domain-list filtering.

### Use Cases
- Block specific domains (domain allow/deny lists).
- Deep packet inspection.
- IDS/IPS for VPC traffic.
- Centralised egress filtering across multiple VPCs (via AWS Transit Gateway).

---

## AWS WAF (Web Application Firewall)

### Overview
- Protects **web applications** from common web exploits (OWASP Top 10).
- Operates at **Layer 7** (HTTP/HTTPS).
- Deployed in front of: **CloudFront, ALB, API Gateway, AppSync**.

### Key Concepts
- **Web ACL (Access Control List)** — collection of rules applied to protected resources.
- **Rules** — conditions that inspect: IP addresses, headers, body, URI, query strings, cookies.
- **Rule Groups** — reusable sets of rules (AWS managed, Marketplace, or custom).
- **Managed Rule Groups** — pre-built by AWS and third parties (e.g., AWS Core rule set, SQL injection, known bad inputs).
- **Rate-based rules** — block IPs that exceed a request threshold (DDoS mitigation).

### WAF Logs
WAF can send full request logs to:
- **CloudWatch Logs**
- **Amazon S3**
- **Kinesis Data Firehose**

---

## AWS Shield

### Overview
- **DDoS protection** service.
- Protects at **Layer 3 and Layer 4** (network and transport).

### Tiers
| Tier | Details |
|------|---------|
| **Shield Standard** | Free; automatic protection for all AWS customers; protects against most common DDoS attacks |
| **Shield Advanced** | Paid; enhanced DDoS protection; 24/7 DDoS Response Team (DRT); cost protection; advanced reporting; protection for ALB, CloudFront, Route 53, Global Accelerator, EC2 |

---

## Combined Security Posture Pattern
```
Internet
    ↓
AWS Shield (DDoS L3/L4)
    ↓
CloudFront + WAF (L7 web attack filtering)
    ↓
ALB + ACM Certificate (TLS termination)
    ↓
Network Firewall (L3-L7 VPC traffic filtering)
    ↓
Security Groups + NACLs (instance-level)
    ↓
Application
```

---

## AWS Firewall Manager

### Overview
- **Centralised management** of WAF, Shield Advanced, Network Firewall, and Security Groups across an AWS Organisation.
- Requires AWS Organizations with all features enabled.
- Applies security policies consistently across accounts and regions.

### Use Cases
- Enforce WAF rules across all CloudFront distributions in the org.
- Ensure all VPCs have Network Firewall enabled.
- Enforce Shield Advanced protection for specified resource types.

---

## Exam Tips
- **Network Firewall** = VPC-level stateful firewall with IDS/IPS; sits in a firewall subnet.
- **WAF** = Layer 7 web attack protection; deployed on CloudFront/ALB/API Gateway.
- **Shield Standard** = free, automatic; **Shield Advanced** = paid, DRT access, advanced reporting.
- **Firewall Manager** = single-pane-of-glass to manage WAF/Shield/Network Firewall across org.
- WAF + Shield together protect against both web application exploits and DDoS.
- WAF logs → CloudWatch Logs, S3, or Kinesis Firehose.
- Common pattern: **CloudFront custom header → WAF rule on ALB** to ensure all traffic passes through CloudFront (see Custom Integrations notes).
