const questions = [
  {
    "title": "Cross-Account CodePipeline S3 KMS Encryption",
    "scenario": "A DevOps engineer is configuring an AWS CodePipeline in Account A (Dev) to deploy application artifacts to an Amazon ECS cluster in Account B (Prod). Pipeline executions fail at the deployment stage with an access denied error when attempting to read build artifacts from the Amazon S3 artifact bucket.",
    "question": "Which combination of steps will resolve the cross-account deployment failure?",
    "options": [
      "A. Encrypt the S3 artifact bucket with the default AWS-managed S3 key (aws/s3) and grant Account B root access in the bucket policy.",
      "B. Encrypt the S3 artifact bucket using an AWS KMS Customer Managed Key (CMK), update the KMS key policy to allow Account B's cross-account role kms:Decrypt permissions, and configure CodePipeline to assume Account B's deployment role.",
      "C. Make the S3 artifact bucket public and configure CodeDeploy to fetch artifacts over HTTP.",
      "D. Create an S3 bucket in Account B and configure CodePipeline in Account A to upload build artifacts directly using AWS IAM Access Keys."
    ],
    "correct_answer": "B. Encrypt the S3 artifact bucket using an AWS KMS Customer Managed Key (CMK), update the KMS key policy to allow Account B's cross-account role kms:Decrypt permissions, and configure CodePipeline to assume Account B's deployment role.",
    "explanation": "Default AWS-managed keys (aws/s3) cannot be shared across AWS accounts. To allow cross-account pipeline deployments, the S3 artifact bucket must be encrypted with a Customer Managed Key (CMK), and the key policy along with S3 bucket policy must explicitly grant decrypt/read permissions to the target account's cross-account deployment role.",
    "category": "SDLC Automation"
  },
  {
    "title": "Zero-Downtime ECS Blue/Green CodeDeploy",
    "scenario": "A company requires zero-downtime blue/green deployments for their containerized microservice hosted on Amazon ECS with AWS Fargate. During deployments, traffic must be routed to a test target group on the Application Load Balancer for 15 minutes of validation before production traffic is shifted.",
    "question": "Which CodeDeploy lifecycle hook should be used to run automated validation scripts against the test traffic endpoint before main traffic routing occurs?",
    "options": [
      "A. BeforeInstall",
      "B. AfterInstall",
      "C. AfterAllowTestTraffic",
      "D. BeforeAllowTraffic"
    ],
    "correct_answer": "C. AfterAllowTestTraffic",
    "explanation": "For Amazon ECS deployments, CodeDeploy executes AfterAllowTestTraffic after test traffic is shifted to the new (Green) replacement task set. This hook triggers a Lambda function to perform automated validation tests on the test port before production traffic is rerouted.",
    "category": "SDLC Automation"
  },
  {
    "title": "CloudFormation Multi-Account Multi-Region Guardrails",
    "scenario": "A enterprise DevOps team needs to automatically provision standard security logging configurations and baseline IAM roles across all existing and newly created AWS accounts in an AWS Organization.",
    "question": "Which AWS CloudFormation feature provides the most efficient and scalable solution?",
    "options": [
      "A. CloudFormation StackSets with SERVICE_MANAGED permissions and auto-deployment enabled",
      "B. CloudFormation Nested Stacks triggered by an S3 event notification",
      "C. AWS CodePipeline with cross-account CloudFormation actions in every region",
      "D. A custom Python script using AWS SDK (boto3) running on a scheduled EC2 instance"
    ],
    "correct_answer": "A. CloudFormation StackSets with SERVICE_MANAGED permissions and auto-deployment enabled",
    "explanation": "CloudFormation StackSets with SERVICE_MANAGED permissions integrate natively with AWS Organizations. Enabling auto-deployment automatically deploys specified stack instances whenever a new AWS account is added to target Organizational Units (OUs).",
    "category": "Configuration Management & IaC"
  },
  {
    "title": "Automated EC2 Security Patching without SSH",
    "scenario": "A security audit reveals that several Amazon EC2 Linux instances across multiple VPCs are missing critical security patches. The operations team is forbidden from opening SSH port 22 or maintaining SSH key pairs on instances.",
    "question": "How can the team automate patch compliance and baseline patch installation securely?",
    "options": [
      "A. Use AWS Systems Manager Patch Manager with Patch Baselines and Maintenance Windows, accessing instances via SSM Agent",
      "B. Deploy Ansible playbooks using AWS CodeDeploy over public IP addresses",
      "C. Use AWS Config custom Lambda rules to execute yum update via EC2 User Data on reboot",
      "D. Open port 22 strictly for AWS Cloud9 and execute patch scripts manually"
    ],
    "correct_answer": "A. Use AWS Systems Manager Patch Manager with Patch Baselines and Maintenance Windows, accessing instances via SSM Agent",
    "explanation": "AWS Systems Manager Patch Manager automates patching Linux and Windows instances without requiring open inbound ports or SSH keys. Instances communicate outbound securely via the Systems Manager Agent.",
    "category": "Configuration Management & IaC"
  },
  {
    "title": "Multi-Region Active-Passive Aurora Disaster Recovery",
    "scenario": "A financial application requires a Disaster Recovery (DR) solution with a Recovery Time Objective (RTO) of less than 1 minute and a Recovery Point Objective (RPO) of less than 1 second across two AWS regions.",
    "question": "Which database architecture meets these stringent RTO and RPO requirements?",
    "options": [
      "A. Amazon RDS for PostgreSQL with cross-region read replicas",
      "B. Amazon Aurora Global Database with storage-level replication",
      "C. Amazon DynamoDB with nightly S3 export and cross-region import",
      "D. Amazon EC2 hosted PostgreSQL with manual EBS snapshot replication"
    ],
    "correct_answer": "B. Amazon Aurora Global Database with storage-level replication",
    "explanation": "Amazon Aurora Global Database provides sub-second cross-region replication latency (RPO < 1s) and supports cross-region failover in under 1 minute (RTO < 1m) without data loss.",
    "category": "Resilient Cloud Solutions"
  },
  {
    "title": "Auto Scaling Self-Healing Application Load Balancer",
    "scenario": "An e-commerce application running on an Auto Scaling Group behind an Application Load Balancer (ALB) occasionally experiences web server process crashes. The EC2 instance status checks remain green (Healthy), so ASG does not replace the instances, causing HTTP 502 errors for users.",
    "question": "What is the most effective solution to ensure automatic replacement of instances when web applications crash?",
    "options": [
      "A. Change the Auto Scaling Group Health Check Type from EC2 to ELB and configure an ALB target group health check path",
      "B. Write a Cron job on the EC2 instances to reboot every 4 hours",
      "C. Increase the desired capacity of the Auto Scaling Group by 50%",
      "D. Attach a CloudWatch Alarm to the CPU Utilization metric to terminate instances exceeding 90%"
    ],
    "correct_answer": "A. Change the Auto Scaling Group Health Check Type from EC2 to ELB and configure an ALB target group health check path",
    "explanation": "By default, ASG only checks EC2 hypervisor health. Setting the Health Check Type to ELB instructs ASG to replace instances whenever the Application Load Balancer marks the web target path as Unhealthy.",
    "category": "Resilient Cloud Solutions"
  },
  {
    "title": "Distributed Tracing Microservice Bottlenecks",
    "scenario": "A microservices application consisting of 15 containerized services running on EKS suffers from intermittent latency spikes. Engineers are unable to determine which specific downstream database call or service dependency is causing the delay.",
    "question": "Which service and integration should be implemented to visualize end-to-end trace latency across services?",
    "options": [
      "A. AWS X-Ray SDK integration with HTTP trace header propagation",
      "B. Amazon CloudWatch Logs Insights with basic log filtering",
      "C. AWS CloudTrail log insights",
      "D. VPC Flow Logs piped into Amazon OpenSearch Service"
    ],
    "correct_answer": "A. AWS X-Ray SDK integration with HTTP trace header propagation",
    "explanation": "AWS X-Ray provides distributed tracing across microservices by propagating the HTTP X-Amzn-Trace-Id header, generating a Service Map and segment timing breakdown for downstream SQL and API requests.",
    "category": "Monitoring and Logging"
  },
  {
    "title": "Real-time VPC Security Group Breach Alerting",
    "scenario": "A security policy mandates that any unauthorized modifications to VPC Security Groups or Network ACLs must be detected and alerted to the Security Operations Center (SOC) within 60 seconds.",
    "question": "Which architecture fulfills this real-time auditing requirement?",
    "options": [
      "A. AWS CloudTrail API logging to S3 filtered by Amazon Athena queries executed every 24 hours",
      "B. AWS CloudTrail real-time events matched by an Amazon EventBridge rule that triggers an Amazon SNS notification",
      "C. AWS Config periodic evaluations configured on a 12-hour schedule",
      "D. VPC Flow Logs exported to S3 and analyzed with AWS Glue"
    ],
    "correct_answer": "B. AWS CloudTrail real-time events matched by an Amazon EventBridge rule that triggers an Amazon SNS notification",
    "explanation": "CloudTrail captures AWS API calls (e.g., AuthorizeSecurityGroupIngress) in real-time. EventBridge matches these API call events immediately and routes notifications to SNS within seconds.",
    "category": "Incident and Event Response"
  },
  {
    "title": "Automated S3 Public Bucket Remediation",
    "scenario": "A compliance rule dictates that no Amazon S3 bucket in the organization may be publicly accessible. If a bucket becomes publicly readable, access must be blocked automatically without human intervention.",
    "question": "What is the recommended serverless architecture to enforce this control?",
    "options": [
      "A. AWS Config rule s3-bucket-public-read-prohibited connected to an AWS Systems Manager Automation document for remediation",
      "B. An IAM Policy attached to all users denying s3:GetObject",
      "C. A daily Lambda function that deletes all S3 buckets containing public objects",
      "D. AWS Trusted Advisor email notification to the account administrator"
    ],
    "correct_answer": "A. AWS Config rule s3-bucket-public-read-prohibited connected to an AWS Systems Manager Automation document for remediation",
    "explanation": "AWS Config continuously monitors bucket compliance against rules. Adding an automated remediation target via Systems Manager Automation (e.g., AWS-DisableS3BucketPublicRead) remediates non-compliant S3 buckets automatically upon detection.",
    "category": "Incident and Event Response"
  },
  {
    "title": "Centralized Multi-Account Guardrails with SCPs",
    "scenario": "An enterprise enterprise organization wants to ensure that no member account inside a specific Organizational Unit (OU) can disable AWS CloudTrail or delete S3 log storage buckets, even if an administrator in a member account has full AdministratorAccess IAM privileges.",
    "question": "Which strategy provides this absolute security boundary?",
    "options": [
      "A. Attach a Service Control Policy (SCP) to the OU with an explicit Deny for cloudtrail:StopLogging and cloudtrail:DeleteTrail",
      "B. Create an IAM Permission Boundary and attach it to the AWS Account Root User in member accounts",
      "C. Enable AWS Security Hub in default mode in member accounts",
      "D. Remove the IAM AdministratorAccess policy from all member accounts"
    ],
    "correct_answer": "A. Attach a Service Control Policy (SCP) to the OU with an explicit Deny for cloudtrail:StopLogging and cloudtrail:DeleteTrail",
    "explanation": "Service Control Policies (SCPs) define the maximum permissions for accounts in an AWS Organization or OU. An explicit Deny in an SCP overrides all IAM permissions granted inside member accounts, including AdministratorAccess.",
    "category": "Security and Compliance"
  }
];
