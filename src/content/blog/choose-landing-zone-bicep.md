---
title: "Which Azure landing zone implementation should you build on in Bicep?"
description: "Classic ALZ-Bicep, the AVM-based platform landing zone, a custom composition, or a phased path: a decision framework for Bicep landing zones, with every date-sensitive fact checked against primary sources."
author: "Marcin Biszczanik"
pubDate: "2026-11-17"
ogEyebrow: "Landing zones · Bicep"
tags: ["azure", "bicep", "landing-zones", "azure-verified-modules", "architecture"]
---

If you are starting a new Azure landing zone in Bicep today, build it on the Azure Verified Modules (AVM) based platform landing zone, pin every module version, and treat the classic ALZ-Bicep repository only as something to migrate away from. That is a different answer from the one I wrote down in June 2026, and the reason it changed is the most useful part of this article: the ecosystem moved, and the only way to notice was to re-check the primary sources instead of trusting the decision.

This is the public version of a decision record I keep, [ADR-0001](https://github.com/mbiszczanik/azure-architecture-decisions/blob/main/adr/0001-landing-zone-reference-implementation.md), written for the situation I first met it in: a greenfield landing zone for workloads migrated from on-premises, a go-live a few months away, an operations team new to infrastructure as code, and a framework meant to be reused on the next engagement. The options and the trade-offs are general. The facts are dated, because they are the part that ages.

## What are the options?

There are four realistic ways to build a platform landing zone in Bicep:

1. **Classic ALZ-Bicep**: Microsoft's original Bicep accelerator (`Azure/ALZ-Bicep`), cloned and parameterized.
2. **AVM platform landing zone**: the current Bicep accelerator (`Azure/alz-bicep-accelerator`), which composes AVM pattern and resource modules.
3. **Custom composition on AVM resource modules**: your own orchestration, management group design and policy baseline, built from AVM building blocks.
4. **Phased**: classic ALZ-Bicep for the first go-live, with a planned migration to the AVM platform landing zone afterwards.

All four end with the same management group hierarchy, policy baseline and hub network in principle. They differ in who maintains what, for how long, and how upgrades reach you.

## What changed between June and October 2026?

The classic accelerator moved from "maintenance mode" to a dated end of support. As of 25 October 2026, the [ALZ-Bicep README](https://github.com/Azure/ALZ-Bicep) states that the AVM-based Bicep platform landing zone is generally available and is the default starter module of the accelerator, that the classic starter module was removed from the accelerator on 16 February 2026, and that the repository will keep receiving bug fixes, security patches and policy refreshes until 16 February 2027, after which it will be archived and no longer supported.

In June, the honest framing was "the strategic direction is AVM, but check whether each platform component you need is ready". By October the framing is simpler: the classic option has under four months of support left, and the AVM option is the default with an in-place migration guide from classic.

![Timeline from February 2026 to February 2027: classic ALZ-Bicep removed from the accelerator on 16 February 2026, ADR-0001 written on 12 June 2026, accelerator v2.4.0 on 6 October 2026, the re-check on 25 October 2026, and ALZ-Bicep archived on 16 February 2027; between the first and last date classic gets bug, security and policy fixes only.](/diagrams/choose-landing-zone-bicep/timeline.svg)

## Why is classic ALZ-Bicep no longer an option for new work?

Because a landing zone is a multi-year asset and this foundation stops being supported in February 2027. Everything that made it attractive is still true: it is the fastest path to a first deployment, it is battle-tested across many enterprise rollouts, it ships the full ALZ policy initiative, and "the Microsoft accelerator" is the easiest answer for a conservative stakeholder. None of that outweighs building on a repository that will be archived before most landing zones finish their first year.

Its structural weaknesses also age badly. Versioning is per repository tag, not per module, so you cannot take one fix without taking everything. Customization beyond the supported parameters tends toward forking, and a fork of an archived upstream is a fork you maintain alone.

## What does the AVM platform landing zone give you?

It gives you the same landing zone pattern, rebuilt from modules that are versioned, tested and published one by one. As of 25 October 2026, the [current Bicep accelerator](https://github.com/Azure/alz-bicep-accelerator) (release v2.4.0, 6 October 2026) builds management groups and policy through the `avm/ptn/alz/empty` pattern module and composes the rest from AVM resource modules: logging, the hub network, firewall, gateways, DNS. The [accelerator documentation](https://azure.github.io/Azure-Landing-Zones/accelerator/starter-bicep/) lists three networking choices, hub networking, Virtual WAN or none, and a step-by-step in-place migration path from classic.

It also deploys through Azure Deployment Stacks. The accelerator's [bootstrap scripts](https://github.com/Azure/accelerator-bootstrap-modules) create every deployment as a stack, at management group, subscription and resource group scope, and the templates are written around it: they carry separate role-assignment modules because, in their own words, "deployment stacks do not support cross-management group role assignments". If you have not decided how your team feels about Deployment Stacks, this choice makes part of that decision for you.

![What the AVM-based accelerator composes, all deployed as Deployment Stacks: governance through the avm/ptn/alz/empty pattern and separate role-assignment templates, management through a Log Analytics workspace, an automation account and the Azure Monitor Agent pattern, and connectivity through either hub networking or Virtual WAN modules. 23 distinct AVM modules, all on 0.x versions, as of 25 October 2026.](/diagrams/choose-landing-zone-bicep/composition.svg)

The advantages are the ones that matter over years, not weeks:

- **Per-module upgrades.** Each module has its own version in the public Bicep registry, so you can take a firewall fix without touching your policy baseline.
- **One set of building blocks for platform and workloads.** The same AVM resource modules your platform uses are available to the application teams that land on it.
- **Standards you did not have to write.** AVM requires tests, documentation and a published changelog for every module.

## What does "generally available" actually promise for AVM modules?

Less than a stakeholder will assume, and you should say so before they find out. I counted the module references in the accelerator's templates on 25 October 2026: 23 distinct AVM modules, and every one of them is on a `0.x` version. The [AVM FAQ](https://azure.github.io/Azure-Verified-Modules/resources/faq/) is explicit that a module does not need to reach 1.0.0 to be production ready, and equally explicit about what 1.0.0 brings: only from then on are breaking changes avoided and, when unavoidable, introduced through a major version.

In practice that means a minor version bump can change a parameter you depend on. The accelerator is generally available as a product; its building blocks are production-ready modules with pre-1.0 version promises. Both statements are true, and the gap between them is your upgrade process:

- Pin every module version. Never float to the latest.
- Read the module changelog before every bump, the way you would read release notes for a database engine.
- Upgrade one module at a time, so a regression points at a single change.

This is also where the June advice survives, in a new form. Then it was "verify each component is GA". Now it is "verify each module's version and status on the day you choose it". On 25 October 2026 the [AVM module index](https://azure.github.io/Azure-Verified-Modules/indexes/bicep/bicep-pattern-modules/) listed `avm/ptn/alz/empty` and `avm/ptn/alz/ama` as available, while the ALZ variant of the Azure Monitor baseline alerts pattern was still only proposed. Status moves both ways: in September I watched a network resource module I depend on go from maintained to orphaned in a matter of weeks.

## When does a custom composition on AVM win?

Only when your requirements genuinely leave the ALZ pattern, or when owning the accelerator is the point. Two cases justify it: a management group topology or policy baseline that differs from ALZ in substance rather than in naming, and a delivery organization that wants its own opinionated accelerator as a product.

The hidden cost is the policy catalog. Recreating the ALZ policy initiatives and their parameter mapping is weeks of careful work that the pattern options include, and every future policy refresh becomes yours to port. AVM resource modules make this far from "custom from scratch", but they do not give you the policy layer, and you will keep answering the question "why are you not using the Microsoft pattern?".

## Is the phased path still worth it?

Not for new work. In June the phased path was the honest answer to a hard deadline combined with platform components that were not yet ready: go live on the proven classic accelerator, migrate to AVM afterwards, and present the migration as a funded roadmap item rather than hide it. Two things killed it. The AVM option is now the default and the classic one has a support end date, so the "proven now, modern later" trade no longer buys anything. And the phased path always carried a quiet failure mode: if the first version works, the migration never gets funded, and you have built on classic after all.

The phased path survives in one place: if you already run a classic ALZ-Bicep landing zone, you are on it whether you chose it or not. Your decision is no longer which framework, but when to run the in-place migration, and the answer is before 16 February 2027. The [migration guide](https://azure.github.io/Azure-Landing-Zones/bicep/migration/) keeps your management group hierarchy in place and converges the existing resources onto the new templates. As of 25 October 2026 it does not cover networking yet, so plan the hub network separately and move it last.

## So which one should you choose?

Choose by your situation, not by the options list:

![Decision tree: if you already run classic ALZ-Bicep, migrate in place to AVM before 16 February 2027; otherwise, if your management groups or policy baseline genuinely differ from ALZ, compose your own on AVM resource modules; otherwise build on the AVM platform landing zone and pin every module version. The phased path is retired for new work.](/diagrams/choose-landing-zone-bicep/decision.svg)

| Your situation (as of October 2026) | Build on | What to do first |
| --- | --- | --- |
| New landing zone, requirements fit the ALZ pattern | AVM platform landing zone | Pin module versions; decide your stance on Deployment Stacks |
| New landing zone, topology or policy genuinely differs from ALZ | Custom composition on AVM resource modules | Budget the policy catalog explicitly |
| Existing classic ALZ-Bicep landing zone | Migrate in place to the AVM platform landing zone | Plan the migration before 16 February 2027, networking last |
| Conservative stakeholder asks "is this Microsoft best practice?" | AVM platform landing zone | Show the default in the accelerator, and explain what 0.x versions mean |

## How do you re-check these facts yourself?

Every date-sensitive fact in this article comes from a public source you can query in a few minutes. These are the checks I ran on 25 October 2026, in bash with the GitHub CLI; run them on the day you decide.

The support dates of classic ALZ-Bicep, from its README:

```bash
curl -sL https://raw.githubusercontent.com/Azure/ALZ-Bicep/main/README.md | grep -n "2026\|2027"
```

The current release of the AVM-based accelerator:

```bash
gh release view -R Azure/alz-bicep-accelerator --json tagName,publishedAt
```

Every AVM module the accelerator's templates reference, with the pinned version. Anything below `1.0` can still change its parameters in a minor release:

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

The status of the ALZ pattern modules in the AVM module index (`Available`, `Proposed`, `Orphaned`):

```bash
curl -sL https://raw.githubusercontent.com/Azure/Azure-Verified-Modules/main/docs/static/module-indexes/BicepPatternModules.csv \
  | grep -i 'alz' | cut -d, -f1,3,4
```

The versions published to the Bicep registry for any one module, here the management group and policy pattern:

```bash
curl -s https://mcr.microsoft.com/v2/bicep/avm/ptn/alz/empty/tags/list
```

If any of these answers differs from what is written here, trust the answer, not the article.

## When does this framework not apply?

It does not apply if you are choosing between Bicep and Terraform; that is a different decision with different drivers, and Terraform has its own AVM-based landing zone. It does not apply to a single-subscription workload that does not need a landing zone at all. And it does not survive unchecked: every fact in it carries a date because the ecosystem moves faster than a decision record. The first version of this framework recommended a phased path that is now indefensible, and nothing in my own notes would have told me so. A re-check against the primary sources did.

## The short version

- **New landing zone in Bicep:** build on the AVM platform landing zone. Pin every module and read changelogs, because 0.x versions can still break.
- **Requirements outside the ALZ pattern:** compose your own on AVM resource modules, and budget the policy catalog.
- **Already on classic ALZ-Bicep:** migrate in place before 16 February 2027.
- **Phased:** retired for new work.
- **Any of the above:** re-verify the dates on the day you decide.

---

I'm Marcin Biszczanik, a Cloud and Platform Consultant (AZ-305) writing about the decisions behind Azure platform work. This article is the long form of [ADR-0001](https://github.com/mbiszczanik/azure-architecture-decisions/blob/main/adr/0001-landing-zone-reference-implementation.md) in my public decision log, [`azure-architecture-decisions`](https://github.com/mbiszczanik/azure-architecture-decisions). If you are choosing a landing zone foundation right now, tell me on [LinkedIn](https://www.linkedin.com/in/marcin-biszczanik/) which option your situation pushed you toward, and what nearly pushed you the other way.
