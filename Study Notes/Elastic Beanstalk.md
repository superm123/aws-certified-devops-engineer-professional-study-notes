
## Elastic Beanstalk Overview

- Quickly deploy applications **without managing the underlying infrastructure**.
- Supports: Apache, IIS, Java (Tomcat), NGINX, Passenger, Puma, Node.js, PHP, Python, Ruby, Go, .NET.
- Handles: **capacity provisioning, load balancing, auto scaling, health monitoring, deployment**.
- You retain control over the AWS resources — EB creates them but you can configure them.
- Best for developers who want to focus on code, not infrastructure.

### Core Concepts
| Concept | Description |
|---------|-------------|
| **Application** | Top-level container — holds environments, versions, and configurations |
| **Application Version** | A labelled iteration of code (e.g., a WAR/JAR/ZIP bundle stored in S3) |
| **Environment** | A running version of an application — includes EC2, ALB, ASG |
| **Environment Tier** | **Web Server** (handles HTTP) or **Worker** (processes SQS messages) |
| **Platform** | The OS + language runtime stack (e.g., Java 11 on AL2) |

Version quota: 1000 versions per application.

### Deployment Strategies
| Strategy | Description | Downtime? | Rollback |
|----------|-------------|-----------|---------|
| **All at once** | Deploy to all instances simultaneously | Brief downtime | Re-deploy previous version |
| **Rolling** | Deploy in batches (e.g., 25% at a time) — capacity temporarily reduced | No (partial) | Additional rolling deployment |
| **Rolling with additional batch** | Launch extra instances before rolling — full capacity maintained | No | Additional rolling deployment |
| **Immutable** | Launch a new ASG with new instances; swap when healthy | No | Terminate new ASG (fast rollback) |
| **Traffic splitting (Canary)** | Send a percentage of traffic to new version; monitor; shift rest | No | Reroute traffic back instantly |
| **Blue/Green** | Deploy to a separate environment; swap CNAME (DNS) when ready | No | Swap CNAME back |

#### Key Notes
- **Immutable** = safest in-place strategy; creates fresh instances; fast rollback by terminating new ASG.
- **Blue/Green** uses two separate EB environments + **CNAME swap** (requires DNS change propagation).
- **Traffic splitting** is similar to Blue/Green but within a single environment using weighted routing.
- **Rolling** reduces capacity temporarily — do not use for latency-sensitive production systems.

### EB + CloudFormation
- Elastic Beanstalk uses **CloudFormation under the hood** to provision resources.
- You can use EB **and** CloudFormation together — EB manages the app, CF manages other infrastructure.
- For complex or custom infrastructure, prefer CloudFormation over EB.

### EB + OpsWorks
- OpsWorks supports **Chef and Puppet** for node configuration.
- If your on-premises servers are reachable by Chef/Puppet, they can be registered with OpsWorks — same tooling for cloud and on-prem.

### EB Antipatterns (when NOT to use it)
- Complex dependency management or custom provisioning — use CloudFormation/CDK.
- Need fine-grained control over infrastructure — use CloudFormation.
- Microservices with containers — use ECS/EKS.

### Health Monitoring
- Enhanced health monitoring provides real-time application OS monitoring.
- Health dashboard shows instance-level health indicators.

> Clarification: Auto Scaling in EB is managed by the environment's ASG. EB handles launching, configuring, and terminating instances via the ASG automatically.

---

# .ebextensions

Resources defined within your environment, meaning that if you include your databases here, they are going to be recreated upon blue-green deployments.

### **Files**
You can use the `files` key to create files on the EC2 instance. The content can be either inline in the configuration file, or the content can be pulled from a URL. The files are written to disk in lexicographic order.

### **Sources**
You can use the `sources` key to download an archive file from a public URL and unpack it in a target directory on the EC2 instance.

### **Packages**
You can use the `packages` key to download and install prepackaged applications and components.

### **Commands**
You can use the `commands` key to execute commands on the EC2 instance. The commands run before the application and web server are set up and the application version file is extracted.

### **Container commands**
You can use the `container_commands` key to execute commands that affect your application source code. Container commands run after the application and web server have been set up and the application version archive has been extracted, but before the application version is deployed

You can use `leader_only` to only run the command on a single instance, or configure a `test` to only run the command when a test command evaluates to `true`

Further reading:
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/customize-containers-ec2.html
