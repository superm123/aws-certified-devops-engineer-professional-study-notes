# AWS CodeArtifact

## Overview
- Fully managed **artifact / package repository** service.
- Stores software packages (the output of a build) securely within AWS.
- Integrates with standard package managers across multiple languages.

## Supported Package Formats / Managers
| Format | Language/Ecosystem |
|--------|-------------------|
| **npm** | JavaScript / Node.js |
| **PyPI** | Python (pip) |
| **Maven / Gradle** | Java |
| **NuGet** | .NET / C# |
| **Swift / Cargo** | Swift, Rust |
| **generic** | Any binary artifact |

## Key Concepts

### Domain
- Top-level grouping of repositories.
- A **domain** performs **deduplication** — if multiple repos reference the same package version, it is stored only once; you pay for one copy regardless of how many repos reference it.

### Repository
- Stores a collection of package versions.
- Repositories support **inheritance** — upstream repository connections.

### Upstream Connections
- A CodeArtifact repository can be configured with **upstream repositories**.
- When a package is requested and not found locally, CodeArtifact fetches it from the upstream (e.g., npmjs.com, PyPI, Maven Central).
- Result: packages from public repositories are **cached** in your private CodeArtifact domain.
- Benefit: no direct internet dependency for builds; faster, more reliable builds; security scanning possible.

## Integration with CI/CD
```
CodeCommit → CodeBuild → [build produces packages] → CodeArtifact
                                         ↑
                               (retrieves dependencies from CodeArtifact)
```
- CodeBuild retrieves dependencies **from CodeArtifact** rather than public internet.
- Publish build outputs (JAR, ZIP, npm packages) back to CodeArtifact for downstream consumers.

## Access Control
- IAM policies control access to domains and repositories.
- **Resource-based policies** on repositories allow cross-account access.
- Useful for sharing internal packages across multiple AWS accounts/teams.

## Exam Tips
- CodeArtifact = **managed package store** (not a code repository — that's CodeCommit).
- Supports npm, PyPI, Maven, NuGet — know these for the exam.
- **Domain** → deduplication; **Repository** → package storage with upstream support.
- Upstream connections cache public packages (npm registry, PyPI, Maven Central) locally.
- Use CodeArtifact to avoid direct internet access during CodeBuild builds (security + reliability).
- Cross-account sharing via resource-based policies on repositories.
