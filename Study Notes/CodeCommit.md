# AWS CodeCommit

## Overview
- Fully **managed** Git-based source control service — no server provisioning, scaling, or patching required.
- Repositories are **highly available, fault tolerant, and have no size limit** (scales automatically).
- Integrates natively with **CodeBuild, CodeDeploy, CodePipeline, Lambda, SNS**.
- Compatible with all existing **Git tooling and commands** (clone, commit, push, pull, branch, merge).

## Other Repository Sources in AWS Pipelines
CodeCommit is **not** the only source you can use. Supported alternatives:
- **GitHub / GitHub Enterprise**
- **Bitbucket**
- **Amazon S3** — requires **versioning enabled** to act as a repository
- GitLab (via custom integrations)

> **Exam tip:** If S3 is used as a source and versioning is not on, the console will prompt you to enable it.

## Key Git Workflow
```
clone → local changes → git add → git commit (local) → git push (to CodeCommit)
```
- `git commit` only commits to the **local** repo.
- `git push origin main` sends changes to the **central** CodeCommit repo.
- Other developers use `git pull` to retrieve updates.

## CLI Commands (very literal naming pattern)
| Action | Command |
|--------|---------|
| Create repo | `aws codecommit create-repository --repository-name <name>` |
| View repo | `aws codecommit get-repository --repository-name <name>` |
| List repos | `aws codecommit list-repositories` |
| Delete repo | `aws codecommit delete-repository --repository-name <name>` |

> **Exam tip:** Commands are named literally — if you need to delete a repository, the command is `delete-repository`. Exception: view a repo uses `get-repository`, not `view-repository`.

## Authentication
- **HTTPS** — Generate Git credentials from IAM → Security Credentials (username/password).
- **SSH** — Upload public key in IAM → Security Credentials.
- **HTTPS (GRC)** — AWS CLI credential helper.

## Branching & Merging
- Branches allow isolated development without affecting `main`.
- Use **pull requests** to merge changes back — supports code review.
- Each developer can work on their own branch; merge conflicts must be resolved before merging to main.

## Data Security
- All data is **encrypted at rest** using AWS-managed keys (AWS KMS).
- Encrypted **in transit** using HTTPS/SSH.
- **IAM policies** control access:
  - `AWSCodeCommitFullAccess` — full admin access
  - `AWSCodeCommitPowerUser` — all actions except repository deletion/creation (typical for developers)
  - Custom policies for granular read-only or branch-level access
- Attach policies to **IAM Groups** for team-level access management.
- Use **resource-based policies** or **branch-level permissions** to restrict who can push directly to protected branches (e.g., `main`/`prod`).

## Notifications & Automation Triggers
- **CodeCommit triggers** can fire on events (push, create branch) → invoke **Lambda** or **SNS**.
- **EventBridge** can monitor CodeCommit events to trigger CodeBuild (e.g., run build on every push to main).

## Cross-Region Replication
- Replicate a CodeCommit repo to another region using **AWS Lambda** triggered by CodeCommit events.
- Requires a cross-region IAM role with CodeCommit permissions.

## Exam Tips
- CodeCommit is a **managed service** — no server management.
- `git commit` = local only; `git push` = sends to CodeCommit.
- S3 needs **versioning on** to be used as a pipeline source.
- Other repos (GitHub, Bitbucket, GitLab) work with CodePipeline.
- Use IAM groups + policies to manage developer permissions at scale.
- Triggers + EventBridge are your automation hooks from CodeCommit events.
