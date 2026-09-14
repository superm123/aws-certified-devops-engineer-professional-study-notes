
### Network ACL

- default NACL allows all inbound and outbound traffic
- Rules are evaluated starting with the lowest numbered rule. As soon as a rule matches traffic, it's applied regardless of any higher-numbered rule that might contradict it
	- It means specific port rules should be placed before rules for larger port range (e.g ephemeral ports)
- Reachability Analyzer is a static configuration analysis tool. Use Reachability Analyzer to analyze and debug network reachability between two resources in your VPC

Every subnet should be associated to a route table. You can explicitly associate it otherwise subent is implicitly associated with main route table.

You can associate multiple subnets to one route table but one subnet can only be associated with one route table.


### Availability Zones

- AZs are within 100 KM (60 miles) of each other
- 

---

## VPC Flow Logs
- Capture **IP traffic metadata** to/from network interfaces in a VPC.
- Can be created at: **VPC level**, **Subnet level**, or **individual ENI** level.
- Destinations: **CloudWatch Logs**, **S3**, or **Kinesis Data Firehose**.

### Log Record Fields
`version | account-id | interface-id | srcaddr | dstaddr | srcport | dstport | protocol | packets | bytes | start | end | action | log-status`

- `action`: `ACCEPT` or `REJECT`.
- `protocol`: `6` = TCP, `17` = UDP, `1` = ICMP.

### Use Cases
- Diagnose overly restrictive Security Group or NACL rules.
- Monitor traffic patterns.
- Security incident investigation (detect port scanning, unusual traffic).

### What Flow Logs DO NOT Capture
- Traffic to/from the **EC2 instance metadata service** (169.254.169.254).
- **DNS queries** made through Route 53 resolver.
- **DHCP traffic**.
- Traffic to the **Amazon Time Sync Service** (169.254.169.123).
- Windows license activation traffic.

---

## VPC Endpoints

### Interface Endpoint (PrivateLink)
- An **ENI** with a private IP in your subnet that routes traffic to an AWS service privately.
- Supports most AWS services (SSM, S3, EC2, etc.).
- DNS: creates a private DNS hostname for the service.
- Use for: keeping traffic off the public internet (compliance, security).

### Gateway Endpoint
- A route table target for **S3** and **DynamoDB** only.
- No ENI, no hourly cost (only data transfer cost).
- Added to route table as a prefix list target.

---

## Route 53 Key Concepts
- **Simple** — single record, no health checks.
- **Weighted** — distribute traffic by percentage (traffic splitting, canary deployments).
- **Latency** — route to lowest latency region.
- **Failover** — primary/secondary with health checks.
- **Geolocation** — route by user geographic location.
- **Geoproximity** — route by proximity to a resource (with optional bias).
- **Multi-value Answer** — return multiple healthy records; simple client-side load balancing.

### Health Checks
- Monitor endpoints (HTTP, HTTPS, TCP) or CloudWatch alarms.
- Integrate with **DNS failover** — remove unhealthy records from DNS responses.

---

## Transit Gateway
- **Hub-and-spoke** network topology for connecting multiple VPCs and on-premises networks.
- Replaces complex VPC peering meshes.
- Supports: VPC attachments, VPN attachments, Direct Connect Gateway attachments.
- Route tables on the Transit Gateway control traffic flow between attachments.

---

## Exam Tips (Networking)
- VPC Flow Logs = network traffic **metadata** — not packet content.
- Flow Logs do **not** capture DNS, DHCP, metadata service, or Windows activation traffic.
- Interface Endpoints = PrivateLink (most services); Gateway Endpoints = S3 and DynamoDB only.
- Route 53 **Weighted routing** = traffic splitting for canary/blue-green deployments.
- Route 53 **Failover** = active-passive DR pattern.
- Transit Gateway = simplifies multi-VPC networking (hub-and-spoke).
