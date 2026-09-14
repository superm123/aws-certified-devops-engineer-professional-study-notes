
For access to billing, apart form IAM policies you need to activate IAM Access on the Billing console.

### sts:AssumeRole
Calls are made by a user to assume a role for themselves as long as they are in the trust policy of the role.

### iam:PassRole
Allows any user (IAM Principal) with this permission to attach any role to a service such as EC2, Lambda or many more. Exmaple usage with Lambda:
```bash
aws lambda create-function 
    --function-name my-function 
    --runtime nodejs14.x 
    --zip-file fileb://my-function.zip 
    --handler my-function.handler 
    --role arn:aws:iam::123456789012:role/service-role/MyTestFunction-role-tges6bf4
```

This could be a used as a weak-link to elevate access in security breaches. More infromation on that here:

https://tutorialsdojo.com/understanding-the-iampassrole-permission/

### SCPs


> [!NOTE] How they work?
> Remember that if SCP exist it should explicitly Allow the action, otherwise it's an implicit Deny by default


##### Protect specific IAM paths with an SCP

Example: The SCP blocks principals from passing a role unless it has a “team” tag with the value “security” and is in the IAM path /security_app_roles/.

```text
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::*:role/security_app_roles/*",
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalTag/team": "security"
        }
      }
    }
  ]
}
```

Learn more here:

https://aws.amazon.com/blogs/security/how-to-use-the-passrole-permission-with-iam-roles/


### Difference between Service Role and Service Linked Role

Service roles and service-linked roles differ in their functions and management.  

• **Service Roles:** These are IAM roles that a service assumes to perform actions on your behalf. IAM administrators can create, modify, and delete these roles.

• **Service-Linked Roles:** These are a specific type of service role linked to an AWS service. The service assumes the role to perform actions on your behalf, but IAM administrators can only view, not edit, their permissions.


### IAM Access Analyzer
AWS IAM Access Analyzer helps you identify the resources in your organization and accounts, such as Amazon S3 buckets or IAM roles, that are shared with an external entity. This lets you identify unintended access to your resources and data, which is a security risk.

You can set the scope for the analyzer to an organization or an AWS account. This is your zone of trust. The analyzer scans all of the supported resources within your zone of trust. When Access Analyzer finds a policy that allows access to a resource from outside of your zone of trust, it generates an active finding.


### Permissions Boundaries
Is used to limit the actions of a specific user in terms of how they can use `IAM:*.` . Allowing them to managed themselves and others within a certain boundary set by a higher admin.
Permission boundary itself is a normal IAM Policy that should be protected within IAM policies to avoid restricted users to make changes in it.

### Policy evaluation logic
When an AWS service receives a request from any principal, AWS completes several steps to determine whether to allow or deny the request.

AWS apply Allow or Deny based on this order:

1. Explicit deny
2. SCPs
3. Resource Policy
4. Permission Boundary
5. Session Policy
6. Identity Policy


![[Pasted image 20240824182105.png]]

---

## AWS Organizations & Multi-Account Security

### AWS Organizations Overview
- Centrally manage **multiple AWS accounts** under a single master (management) account.
- **Organisational Units (OUs)** — group accounts hierarchically (e.g., dev OU, prod OU, security OU).
- Service Control Policies (SCPs) applied at OU or account level.
- Enables: consolidated billing, multi-account governance, Service Catalog sharing, GuardDuty/Config/Security Hub delegation.

### Service Control Policies (SCPs)
- IAM policies applied at the **Organisation root, OU, or account level**.
- Act as **maximum permission boundaries** — they don't grant permissions; they restrict what the account can use.
- Even an account's root user is restricted by SCPs (except for root tasks like closing the account).

> **Key rule:** If an SCP exists on an account, it must explicitly **Allow** the action, otherwise it is an implicit **Deny**.

### SCP vs Permission Boundary
| Feature | SCP | Permission Boundary |
|---------|-----|---------------------|
| Scope | Account/OU level | Individual IAM principal |
| Set by | Org management account | IAM admin in the account |
| Effect | Limits what the whole account can do | Limits what one user/role can do |

### AWS Control Tower
- Orchestrates AWS best-practice account vending and governance using Organizations, Config, SSM, and CloudTrail.
- Sets up a **Landing Zone** — a multi-account environment with security guardrails.
- **Guardrails** = pre-packaged Config rules + SCPs.
- Preventive guardrails: SCPs (prevent non-compliant actions).
- Detective guardrails: Config rules (detect after the fact).

### Resource Access Manager (RAM)
- Share AWS resources securely **across accounts** within your Organisation.
- Supported resources: subnets, Transit Gateways, Route 53 Resolver rules, License Manager, etc.
- Avoids duplicating resources in every account.

---

## AWS CloudHSM

- **Dedicated Hardware Security Module** in AWS — single-tenant, dedicated hardware.
- Use when: compliance requires **dedicated hardware** (FIPS 140-2 Level 3).
- Compare with KMS: KMS is multi-tenant; CloudHSM is single-tenant dedicated hardware.
- You manage your own encryption keys (AWS has no access to keys in CloudHSM).

---

## AWS Directory Service

- Provides **Microsoft Active Directory** in the cloud.
- Options:
  - **AWS Managed Microsoft AD** — fully managed AD domain in AWS; can establish trust with on-prem AD.
  - **AD Connector** — proxy to redirect authentication to an existing on-premises AD.
  - **Simple AD** — lightweight, standalone AD-compatible directory (no trust with on-prem).

### Use Cases
- Authenticate EC2 instances with corporate AD credentials.
- Enable SSO for AWS console access via AD.
- Join EC2 Windows instances to a domain automatically.

---

## Exam Tips (IAM + Organizations)
- SCP = **maximum permissions** for an account; doesn't grant permissions on its own.
- Root user in a member account is **still subject to SCPs**.
- **Control Tower** = automated landing zone setup + guardrails using Organizations.
- **RAM** = share resources (subnets, TGW) across accounts — no resource duplication.
- **CloudHSM** = dedicated hardware (FIPS 140-2 Level 3) → answer when exam says "dedicated hardware".
- **AWS Managed Microsoft AD** = trust relationship with on-premises AD.
