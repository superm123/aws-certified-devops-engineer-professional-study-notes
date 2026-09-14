# Amazon CodeGuru

## Overview
- Developer tool that uses **machine learning and program analysis** to:
  1. Improve **code quality** (CodeGuru Reviewer).
  2. Optimise **application performance** (CodeGuru Profiler).
  3. Detect **secrets/credentials in code** (CodeGuru Secrets Detector).

---

## CodeGuru Reviewer

### What It Does
- Performs **automated code reviews** on pull requests or committed code.
- Detects:
  - **Bugs** — logic errors, incorrect use of AWS APIs.
  - **Security vulnerabilities** — injection flaws, exposed credentials, insecure data handling.
  - **Resource leaks** — unclosed streams, missing exception handling.
  - **Concurrency issues**.
  - **AWS best practice violations**.

### How It Works
```
Developer commits / raises PR → CodeGuru Reviewer analyses code
                                    → Posts inline comments/recommendations on PR
```

### Supported Languages
Java, Python, JavaScript, TypeScript, C, C++, Ruby, Go, Kotlin.

### Integration Points
- **CodeCommit** pull requests.
- **GitHub / GitHub Enterprise** via CodeGuru connection.
- **Bitbucket**.

---

## CodeGuru Profiler

### What It Does
- **Runtime performance profiling** — identifies the most **expensive lines of code** (CPU, latency, cost).
- Provides recommendations to:
  - Reduce CPU utilisation.
  - Cut compute costs.
  - Remove inefficient code paths.
- Creates **visualisations** (flame graphs) of where your application spends time.

### Where It Runs
- Can profile applications in **build/test** stages and in **production**.
- Works for applications running on EC2, ECS, EKS, Lambda, and on-premises.

### Key Term: Anomaly Detection
- Profiler can detect **anomalous** performance — an unexpectedly expensive line of code.

---

## CodeGuru Secrets Detector

### What It Does
- Scans code, configuration files, and documentation for **hard-coded secrets**:
  - API keys, passwords, tokens, private keys.
- Identifies secrets during **code review** before they reach production.
- Suggests **remediation** (e.g., move secret to AWS Secrets Manager).

---

## Where CodeGuru Fits in the Pipeline
```
Developer writes code
    ↓
Git commit / PR
    ↓
CodeGuru Reviewer → inline PR comments (quality + security issues)
    ↓
CodeBuild (build & test)
    ↓
CodeGuru Profiler → performance analysis
    ↓
Deploy to prod
    ↓
CodeGuru Profiler (production) → continuous performance monitoring
```

---

## Exam Tips
- **Reviewer** = static code analysis + security review on PRs → ML-powered inline comments.
- **Profiler** = runtime performance profiling → find expensive code → reduce cost/CPU.
- **Secrets Detector** = finds hard-coded credentials in code → remediate to Secrets Manager.
- CodeGuru = **developer-facing** tool; fits in code review and CI/CD pipeline.
- Profiler works in **both build/test AND production** environments.
- Reviewer supports CodeCommit, GitHub, Bitbucket pull requests.
