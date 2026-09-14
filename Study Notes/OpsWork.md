
# AWS OpsWorks

## Overview
- **Configuration management** service using **Chef** and **Puppet** — no other CM tools.
- Lets you manage the configuration of your servers using Chef recipes or Puppet manifests.
- Supports both **AWS-hosted** servers and **on-premises** servers (as long as they are reachable by the Chef/Puppet master).

## Three Modes

| Mode | Description |
|------|-------------|
| **OpsWorks for Chef Automate** | AWS-managed Chef server; you write Chef recipes; AWS handles the master server infrastructure |
| **OpsWorks for Puppet Enterprise** | AWS-managed Puppet master server; you write Puppet manifests; AWS handles the master |
| **OpsWorks Stacks** | AWS-integrated Chef without managed servers — you define stacks and layers; uses Chef Solo (agent-based, no separate master) |

## Key Concepts (OpsWorks Stacks)
- **Stack** — top-level container representing a set of instances and resources.
- **Layer** — defines how instances in the stack behave (e.g., web server layer, database layer).
- **Instance** — EC2 or on-premises server managed within a layer.
- **App** — the application to be deployed to instances.
- **Recipes / Lifecycle Events** — Chef recipes that run at lifecycle events: `Setup`, `Configure`, `Deploy`, `Undeploy`, `Shutdown`.

## On-Premises Support
- Install the OpsWorks agent on on-premises servers.
- Register on-premises servers with OpsWorks to manage them alongside cloud instances.
- Enables a **hybrid configuration management** model.

## OpsWorks vs Elastic Beanstalk vs CloudFormation
| Service | Best For |
|---------|---------|
| **OpsWorks** | Chef/Puppet-based config management; hybrid (cloud + on-prem) |
| **Elastic Beanstalk** | Developers who want quick app deployment without infra concern |
| **CloudFormation** | Full infrastructure management with precise resource control |

> These services can be used **together** — e.g., EB deploys the app, CloudFormation provisions supporting infra, OpsWorks manages server configuration.

## Exam Tips
- OpsWorks = **Chef and Puppet only** — not Ansible, Salt, or Terraform.
- Use OpsWorks when you have existing Chef/Puppet expertise or tooling.
- On-premises nodes reachable by Chef/Puppet can be managed by OpsWorks (hybrid).
- If the question mentions Chef or Puppet → OpsWorks is the AWS answer.
- OpsWorks Stacks uses **Chef Solo** (no separate master server needed).