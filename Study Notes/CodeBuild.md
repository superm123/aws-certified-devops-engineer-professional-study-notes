

### buildspec.yaml

```yaml
version: 0.2

run-as: Linux-user-name

env:
  shell: shell-tag
  variables:
    key: "value"
    key: "value"
  parameter-store:
    key: "value"
    key: "value"
  exported-variables:
    - variable
    - variable
  secrets-manager:
    key: secret-id:json-key:version-stage:version-id
  git-credential-helper: no | yes

proxy:
  upload-artifacts: no | yes
  logs: no | yes

batch:
  fast-fail: false | true
  # build-list:
  # build-matrix:
  # build-graph:
        
phases:
  install:
    run-as: Linux-user-name
    on-failure: ABORT | CONTINUE
    runtime-versions:
      runtime: version
      runtime: version
    commands:
      - command
      - command
    finally:
      - command
      - command
    
  pre_build:
    run-as: Linux-user-name
    on-failure: ABORT | CONTINUE
    commands:
      - command
      - command
    finally:
      - command
      - command
    
  build:
    run-as: Linux-user-name
    on-failure: ABORT | CONTINUE
    commands:
      - command
      - command
    finally:
      - command
      - command
    
  post_build:
    run-as: Linux-user-name
    on-failure: ABORT | CONTINUE
    commands:
      - command
      - command
    finally:
      - command
      - command
    
reports:
  report-group-name-or-arn:
    files:
      - location
      - location
    base-directory: location
    discard-paths: no | yes
    file-format: report-format
artifacts:
  files:
    - location
    - location
  name: artifact-name
  discard-paths: no | yes
  base-directory: location
  exclude-paths: excluded paths
  enable-symlinks: no | yes
  s3-prefix: prefix
  secondary-artifacts:
    artifactIdentifier:
      files:
        - location
        - location
      name: secondary-artifact-name
      discard-paths: no | yes
      base-directory: location
    artifactIdentifier:
      files:
        - location
        - location
      discard-paths: no | yes
      base-directory: location
cache:
  paths:
    - path
    - path

```

- artifact section is optional, you don't need it if you use codebuild for pushing a container image to ECR or running tests
- You can make code coverage reports using CodeBuild, Line coverage and Branch coverage are supported

---

## CodeBuild Overview

- Fully managed **build service** — compiles source code, runs tests, and produces deployable artifacts.
- No build servers to provision or manage; scales automatically.
- Integrates with: **CodePipeline, CodeCommit, GitHub, Bitbucket, S3** (as source).
- Build artifacts are stored in **S3**.
- Build logs streamed to **CloudWatch Logs**.

### Key Components
| Component | Description |
|-----------|-------------|
| **Build Project** | Defines what to build: source, environment, buildspec, output artifacts |
| **Buildspec file** | YAML instructions for CodeBuild (`buildspec.yml` in repo root, or inline in project) |
| **Build Environment** | Docker image used for the build (AWS managed images or custom) |
| **Artifacts** | Output of the build, stored in S3 |

### Build Phases (in order)
1. `SUBMITTED` → `QUEUED` → `PROVISIONING`
2. `DOWNLOAD_SOURCE`
3. **`INSTALL`** → **`PRE_BUILD`** → **`BUILD`** → **`POST_BUILD`**
4. `UPLOAD_ARTIFACTS`
5. `FINALIZING` → `COMPLETED`

### Build Notifications
- SNS notifications for build state changes via **CodePipeline** or **EventBridge**.
- Pattern: EventBridge rule on CodeBuild state change → SNS topic → email/Slack.

### CodeBuild with Pull Request Code Review
- Trigger CodeBuild on a **pull request** to run automated code quality checks.
- Results posted back to the PR as **comments** (approve/reject workflow).
- Integrates with CodeCommit PR workflow and GitHub Actions equivalent.

### Accessing Secrets in Builds
- Store secrets in **AWS Secrets Manager** or **SSM Parameter Store**.
- Reference in buildspec via `env.secrets-manager` or `env.parameter-store` sections.
- Never hard-code credentials in the buildspec file.

### CodeBuild Agent (Local)
- Run CodeBuild builds **locally** on your development machine for faster iteration.
- Set up the build image once, then iterate without pushing to CodeCommit.

### Code Coverage Reports
- CodeBuild supports **test reports** including line coverage and branch coverage.
- Use `reports` section in buildspec to publish test result files (JUnit XML, Cucumber JSON, etc.).

---

## Exam Tips (CodeBuild)
- buildspec.yml lives in the **root** of the source repository (or inline in the project config).
- `artifact` section in buildspec is **optional** — skip it if you're pushing a Docker image to ECR.
- Secrets → reference from **Parameter Store or Secrets Manager** in buildspec `env` section.
- CodeBuild can replace **Jenkins** as the build provider in CodePipeline.
- Build notifications → **EventBridge** (pipeline state or CodeBuild state) → SNS.
