---
title: "Which Azure landing zone implementation should you build on in Bicep?"
description: "Choose a Bicep landing zone foundation by support exposure, supported customization and operating ownership, with the migration conditions that matter before committing."
author: "Marcin Biszczanik"
pubDate: "2026-10-29"
ogEyebrow: "Landing zones · Bicep"
tags: ["azure", "bicep", "landing-zones", "azure-verified-modules", "architecture"]
---

If you are choosing a new Azure landing zone in Bicep, start by testing the Azure Verified Modules (AVM) based platform landing zone against your requirements. Do not choose classic ALZ-Bicep simply because your team already knows it. Do not build your own composition simply because your management groups (the hierarchy that groups subscriptions for governance) look different from the default.

First establish what the supported configuration can do. Then decide which maintenance obligations your team is willing to own.

That is the decision this article helps you make. Compare who owns the policy baseline, module upgrades and migration risk after the first release.

This revisits the framework in my public [ADR-0001](https://github.com/mbiszczanik/azure-architecture-decisions/blob/main/adr/0001-landing-zone-reference-implementation.md). Its June 2026 version already defaulted to AVM and left a conditional classic-first fallback for a hard deadline combined with unavailable components. I revised the record on 25 October 2026; the June reasoning stays in its [revision history](https://github.com/mbiszczanik/azure-architecture-decisions/blob/main/adr/0001-landing-zone-reference-implementation.md#revision-history). The recommendation below narrows that fallback for new work.

**Source review: 29 October 2026.** Product status and support dates below refer to that check. The migration discussion describes published guidance, not a migration I have executed for this article.

## What are the options?

There are four paths worth distinguishing:

1. **Classic ALZ-Bicep:** the original `Azure/ALZ-Bicep` implementation, now on a limited maintenance timeline.
2. **AVM platform landing zone:** the current Bicep accelerator, configured and extended through its supported interfaces.
3. **Custom composition on AVM:** your own orchestration and governance design using AVM modules, where the supported accelerator does not meet a demonstrated requirement or owning that framework is an explicit product decision.
4. **Classic first, AVM later:** two implementations and a funded migration between them.

They can serve the same broad purpose: a governed foundation for workloads. They do not guarantee identical hierarchies, policies or networks. Configuration, chosen components and ownership differ.

## What does the support timeline actually say?

As checked on 29 October 2026, the [Classic ALZ-Bicep README](https://github.com/Azure/ALZ-Bicep) distinguishes removal from the accelerator from the end of repository support:

- The Classic starter was removed from the accelerator on **16 February 2026**.
- Bug fixes, security patches and policy refreshes continue during the stated maintenance period.
- The repository is scheduled to be archived and unsupported after **16 February 2027**.

That endpoint concerns this implementation's maintenance. It does not mean Azure deletes a deployed landing zone on that date.

The AVM recommendation is not new in October. The [accelerator release notes](https://azure.github.io/Azure-Landing-Zones/accelerator/accelerator-release-notes/) already recommended the AVM Bicep option for new deployments in their 24 November 2025 entry. These dates predate the decision record. A later source review can correct an assessment without establishing a later change in the product.

<picture>
  <source media="(max-width: 600px)" srcset="/diagrams/choose-landing-zone-bicep/timeline-mobile.svg" />
  <img src="/diagrams/choose-landing-zone-bicep/timeline.svg" alt="Classic ALZ-Bicep timeline: AVM Bicep recommended for new deployments in the accelerator release notes on 24 November 2025; Classic starter removed on 16 February 2026; source review on 29 October 2026; Classic repository support ends and archival follows on 16 February 2027. Removal from the accelerator is distinct from the maintenance endpoint." />
</picture>

For new long-lived work, my recommendation is to avoid adding exposure to that maintenance endpoint. Familiarity can reduce initial learning, but it does not remove the migration and support responsibility. If an exception is proposed, require the concrete blocker in AVM, an owner for the exception and a credible exit plan. "We will migrate later" is not that plan.

## What does the AVM platform landing zone give you?

The [official Bicep overview](https://azure.github.io/Azure-Landing-Zones/bicep/) describes templates for governance, management and connectivity built on AVM. It explicitly supports custom management-group hierarchies, resource configuration and choosing the components you need. A different hierarchy or resource naming scheme is therefore a requirement to test against the accelerator, not automatic evidence that you need a replacement.

<picture>
  <source media="(max-width: 600px)" srcset="/diagrams/choose-landing-zone-bicep/composition-mobile.svg" />
  <img src="/diagrams/choose-landing-zone-bicep/composition.svg" alt="The AVM platform landing zone provides configurable governance, management and connectivity components. The documented delivery pipeline uses Deployment Stacks, with standard deployment what-if for preview. Supported configuration is the first place to test requirements before choosing custom orchestration." />
</picture>

Its modularity gives your team a way to evaluate component upgrades separately. That does not make upgrades independent of their dependencies. Pin the versions you accept, read the relevant release notes and validate the resulting platform together.

The operating model also matters. As checked on 29 October 2026, the official overview documents deployment through **Azure Deployment Stacks**, with a configuration that removes managed resources when they leave the template. It describes preview through standard deployment what-if and warns that the preview may not fully reflect stack deletions. This is documented pipeline behavior, not a claim that every script or deployment path uses the same command.

Before adopting it, make someone responsible for reviewing removals, approving upgrades and investigating partial failures. Choosing the accelerator also means choosing an operating model your team has to understand.

## What does a 0.x module version mean?

Do not use the version number as a shortcut for readiness. On 29 October 2026 I counted the module references in the templates of accelerator release v2.4.0 (6 October 2026): 23 distinct AVM modules, every one pinned to a `0.x` version. The [AVM FAQ](https://azure.github.io/Azure-Verified-Modules/resources/faq/), checked on 29 October 2026, allows production use before version 1.0. It also says that the full semantic-versioning commitment applies from 1.0: unavoidable breaking changes then require a major version increment.

For a pre-1.0 dependency, assess each upgrade rather than assuming a minor bump preserves its interface. My practical rule is to pin versions, read changelogs and validate changes before promoting them. An available module is not a promise that every version is appropriate for your requirements.

If you already maintain custom Bicep modules, the related [keep / adapt / drop method](/blog/keep-adapt-drop-avm/) addresses which of that work remains useful alongside AVM. Here the question is narrower: who should own the platform composition?

## When does a custom composition on AVM win?

First write down the requirement that the accelerator cannot satisfy, then test its supported configuration and extension points. A preference for a different default is not enough.

For example, a delivery organization might deliberately want to publish and support its own framework across multiple environments. That is a legitimate product decision if it accepts ownership of the orchestration, policy integration, upgrade process and documentation. It is not a free consequence of using AVM resource modules.

For a single platform, I would require a demonstrated gap before taking on that ownership. Record the requirement, the supported approach you tried, why it fails and which custom layer is actually necessary. Keep the exception as small as that evidence allows.

The policy layer deserves its own owner. Reusing resource modules does not automatically supply the governance design, assignment parameters or upgrade decisions your composition needs. Estimate policy integration and maintenance from the actual scope.

## Is classic first, AVM later still a useful plan?

For new work, it is an exception I would ask the team to justify, rather than a default response to a deadline. It adds a second implementation and a migration whose budget competes with the next delivery. The support endpoint is a constraint on that plan, not evidence that a migration will happen automatically.

If you already run Classic, migration planning is a different decision from choosing a greenfield foundation. Use the [migration guide](https://azure.github.io/Azure-Landing-Zones/bicep/migration/), checked on 29 October 2026, but read its conditions before promising an in-place transition:

- Existing management-group and resource identifiers need to align with the new configuration to avoid duplicates.
- Policy-definition changes can fail during an update even when what-if appears acceptable. The guide describes staged policy removal and recreation as a mitigation.
- Hub and Virtual WAN networking are outside that guide's current detailed scope.

Those conditions make rehearsal, policy continuity and rollback ownership part of the migration scope. My recommendation is to assess them before committing a completion date, and to plan the networking work outside the guide's scope explicitly. The support deadline is not a substitute for an approved, tested migration plan.

## So which one should you choose?

<picture>
  <source media="(max-width: 600px)" srcset="/diagrams/choose-landing-zone-bicep/decision-mobile.svg" />
  <img src="/diagrams/choose-landing-zone-bicep/decision.svg" alt="Decision tree: existing Classic platforms need a migration assessment with identifier alignment, policy continuity and networking scope. New platforms first test the AVM accelerator&#x27;s supported configuration. Use AVM when it meets the requirement; consider a bounded custom composition only after documenting an unmet requirement or an explicit framework ownership decision. Classic-first is an exception requiring an owner and exit plan." />
</picture>

<div style="overflow-x: auto;" role="region" aria-label="Landing zone decision comparison" tabindex="0">

| Your situation, as of 29 October 2026 | My recommendation | First decision to make |
| --- | --- | --- |
| New platform; supported configuration meets the requirements | AVM platform landing zone | Who owns version upgrades and stack removals? |
| New platform; hierarchy or settings differ from defaults | Test supported customization first | Which exact requirement, if any, remains unmet? |
| Demonstrated gap or an explicit decision to own a framework | A bounded custom composition on AVM | Who maintains the orchestration and policy layer? |
| Existing Classic platform | Assess and rehearse migration | Can identifiers align, and who owns policy continuity and rollback? |
| Classic-first exception proposed for new work | Require a documented blocker and exit plan | Is the migration funded and feasible against the support horizon? |

</div>

The useful output of this decision is more than a repository name. It is a named owner, a tested assumption and a maintenance obligation the team has accepted.

## How can you check the decision yourself?

Before reusing the recommendation, check these primary sources on the day you decide:

1. The [Classic README](https://github.com/Azure/ALZ-Bicep): distinguish accelerator removal, limited maintenance and the support endpoint.
2. The [Bicep overview](https://azure.github.io/Azure-Landing-Zones/bicep/) and [getting-started guide](https://azure.github.io/Azure-Landing-Zones/bicep/gettingstarted/): test required configuration and the documented delivery model.
3. The [AVM FAQ](https://azure.github.io/Azure-Verified-Modules/resources/faq/) and the exact module versions you intend to use: check readiness and upgrade expectations separately.
4. The [migration guide](https://azure.github.io/Azure-Landing-Zones/bicep/migration/): check scope, current blockers and the identifiers your platform actually uses.

Commands I ran on 29 October 2026, in bash with the GitHub CLI.

The support dates of classic ALZ-Bicep, from its README:

```bash
curl -sL https://raw.githubusercontent.com/Azure/ALZ-Bicep/main/README.md | grep -n "2026\|2027"
```

The current release of the AVM-based accelerator:

```bash
gh release view -R Azure/alz-bicep-accelerator --json tagName,publishedAt
```

Every AVM module the accelerator's templates reference. Anything below `1.0` can still change its parameters in a minor release:

```bash
repo=Azure/alz-bicep-accelerator
gh api "repos/$repo/git/trees/main?recursive=1" --jq '.tree[].path' \
  | grep -E '^templates/.*\.bicep$' \
  | while read -r f; do curl -s "https://raw.githubusercontent.com/$repo/main/$f"; done \
  | grep -oE 'br/public:avm/[a-z0-9/-]+:[0-9.]+' | sort -u
```

That the accelerator's bootstrap deploys through Deployment Stacks:

```bash
gh api repos/Azure/accelerator-bootstrap-modules/contents/alz/local/scripts-bicep/bicep-deploy.ps1 \
  -H "Accept: application/vnd.github.raw" | grep -n "DeploymentStack @"
```

If any answer differs from what is written here, trust the answer, not the article.

Record the source version where available, check date and the requirement it supports. A review of documentation establishes what is documented. A successful deployment or migration requires separate execution evidence in your environment.

## When does this framework not apply?

This assumes you have already chosen Bicep and need a platform landing zone. Choosing Bicep versus Terraform, or deciding whether a workload needs a platform landing zone at all, are separate questions. It is also not a migration runbook: use the current guide and validate the actual platform state before changing resources.

## The short version

- **New Bicep platform:** test the AVM platform landing zone's supported configuration first.
- **Different defaults:** customize before deciding to replace the composition.
- **Custom framework:** require a demonstrated gap or deliberate ownership decision.
- **Existing Classic platform:** assess migration conditions against the 16 February 2027 support endpoint.
- **Every option:** name the owner of upgrades, policy changes and failure recovery.

---

I'm Marcin Biszczanik, a Cloud and Platform Consultant (AZ-305) writing about the decisions behind Azure platform work. Related frameworks live in my public decision log, [`azure-architecture-decisions`](https://github.com/mbiszczanik/azure-architecture-decisions), including [ADR-0001](https://github.com/mbiszczanik/azure-architecture-decisions/blob/main/adr/0001-landing-zone-reference-implementation.md). If you are choosing a landing zone foundation, tell me on [LinkedIn](https://www.linkedin.com/in/marcin-biszczanik/) which requirement changed your choice, and which maintenance obligation came with it.
