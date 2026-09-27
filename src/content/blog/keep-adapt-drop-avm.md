---
title: "When Azure Verified Modules appeared, I had to decide what of my own work to throw away"
description: "A repeatable keep / adapt / drop method for judging your existing work against an authoritative baseline like Azure Verified Modules, with a real migration as the worked example."
author: "Marcin Biszczanik"
pubDate: "2026-09-27"
ogEyebrow: "IaC · DevOps"
tags: ["azure", "bicep", "azure-verified-modules", "iac", "architecture"]
---

When a credible standard appears next to work you already own, most of that work quietly splits into three piles you cannot tell apart by looking: things the standard now does better than you, things it does but still needs your opinion on top, and things it does not do at all. I hit this directly when Azure Verified Modules (AVM) matured into a real baseline for the kind of Bicep modules I had been maintaining myself. This article is the method I used to decide what to keep, what to adapt, and what to drop, written so you can apply it to your own situation.

## What problem does this method solve?

It solves the problem of judging your existing work once an authoritative baseline exists alongside it. The baseline might be a vendor module library like AVM, a managed service, an official reference architecture, or any well-maintained standard that now covers ground you used to cover yourself. Misjudging the split is expensive in both directions. Keeping too much means you maintain a worse copy of something that is now maintained for you, and you signal to anyone reading your work that you reinvent wheels. Dropping too much means you throw away the genuine differentiators that were the reason your work existed in the first place. The method below is how you sort the piles deliberately instead of by gut feel.

It is domain-agnostic. I will use my own Azure migration as the worked example at the end, but the five steps apply to any "my work versus a new standard" decision.

## What are the steps, in order?

The method is five steps, and the order is not negotiable:

1. **Inventory** what you have, by reality rather than by reputation.
2. **Establish the baseline** as it actually is today, verified against primary sources.
3. **Run the verdict** on each item: keep, adapt, or drop, against one governing question.
4. **Pressure-test the keeps**, because they are the claims most likely to be wrong and most costly if they are.
5. **Record the rationale**, because the reason behind a verdict outlives the verdict.

Inventory comes before baseline because you must know what you are judging before you judge it. Baseline comes before verdict because you cannot rule on duplication against a standard you have not actually checked. Pressure-testing comes after the verdict because you challenge conclusions, not raw material. Skip the order and you get confident, wrong answers.

## Step 1: How do you inventory by reality?

You list everything in scope and capture only what is observably true about each item: what it actually is, what it actually does, and who actually authored it. No verdicts yet. Three disciplines keep this step honest.

Read the artifact, not its label. A folder called `modules/` may contain abandoned experiments, and a `README` may describe a structure that no longer exists. Inspect the real thing. Self-description is a hypothesis to check, not a fact to record.

Establish provenance before anything else. For every item, confirm you actually own it. Work you did not author cannot become evidence of your own judgment, and presenting it as if it were is misattribution. This single check matters more than it sounds: when I ran it on my own candidate set, two repositories turned out to be authored by other people, and they had to be removed from consideration entirely. The ideas inside someone else's work are not owned by anyone and can be rebuilt as your own, but their specific implementation cannot be lifted.

Separate the asset from the teaching material. Things built to demonstrate or to learn obey different rules than things built to be reused. Do not judge a tutorial by whether a standard replaces it, because that was never its job.

## Step 2: Why must you verify the baseline before judging?

Because baselines move, and a verdict built on a stale picture of the baseline is stale itself. You write down what the baseline actually provides today, from primary sources, on the date you do the work. This is the step people skip, and skipping it is the root of almost every wrong verdict downstream.

Three reasons verification is non-negotiable here. First, a fast-moving standard changes weekly, so what it covered last quarter is not what it covers now. Second, memory and secondary documentation both lie in different ways: your memory lags reality, and blogs and summaries lag and distort, so you go to the source of truth, the registry or the repository or the official reference, and read its current state. Third, maintenance status is a fact, not a vibe. A baseline component that exists but is abandoned is not the same as one that is actively maintained, so you check for explicit signals: an archival notice, an orphaned marker, a maintenance-mode banner, a last-commit date. An abandoned baseline component is a reason to keep your own, not to drop it.

Apply a fail-closed rule: anything you cannot verify is treated as not established. You do not state an unverified baseline fact as if it were true, because the verdict you build on it will be passed off as confident and may be wrong in public, under your name.

## Step 3: What is the one question that produces the verdict?

The question is: does the baseline already do this, and do it at least as well? You ask it of every inventory item, and the answer sorts the item into one of three outcomes.

Drop it if the baseline covers it fully and at least as well. Keeping it means maintaining a worse copy of something maintained for you. The item stays in its original home as history and does not move forward.

Adapt it if the baseline covers the substance but leaves room for your opinion on top: organizational defaults, an opinionated composition, a hardened configuration, a sensible-default wrapper. The forward artifact is your layer on the baseline, not a reimplementation of it. You consume the baseline and add the judgment.

Keep it if the baseline does not do this at all, or does it in a way that is abandoned or materially inadequate. This is your genuine differentiator, and it is also the verdict you must now distrust most.

Two refinements prevent the common errors. The phrase "at least as well" is doing real work: a baseline that covers something worse than you, with an older approach or an abandoned module or a missing capability you need, is not a reason to drop, so name precisely what it lacks. And beware the adapt-to-drop slide: an "adapt" that adds almost nothing over the baseline is really a drop in disguise, because if your layer is a thin passthrough it is just the baseline with extra steps.

## Step 4: Why pressure-test the keeps specifically?

Because the keeps are your claimed differentiators, the things you assert the baseline does not do, and "the standard does not do X" is a universal negative, which is hard to prove and easy to get wrong. They are simultaneously your most valuable verdicts and your most fragile ones, so you attack each keep before trusting it.

Try to refute the claim rather than confirm it. Actively search for the baseline capability you believe is absent, under different names, in adjacent categories, in proposed or preview state. The goal is to find it, not to reassure yourself it is missing. Check more than one way, because a single search that returns nothing is weak evidence, so you confirm absence through independent routes and see whether they agree. And separate "does not exist" from "I did not find it", because those are different conclusions, and an unproven keep should not be published as a differentiator. A keep that survives a genuine attempt to refute it is one you can stand behind in public; a keep that was never challenged is a guess.

## Step 5: What do you record, and why does it matter more than the migration?

You record, for each decision, why the baseline did or did not cover the item and what specifically the keep or adapt adds, with the date and the baseline state you judged against. The verdict is the cheap part; the reason is the asset. This record matters more than the migration it produces for two reasons: it lets you re-run the judgment later when the baseline has moved, without starting from zero, and it is itself evidence of how you think, which is the rarest and most transferable thing you can show.

## When does this method not apply?

It does not apply in three cases, and being honest about its limits is part of using it well. If no credible baseline exists, there is nothing to judge against, and you are doing greenfield design instead. If the cost of being wrong is trivial, as with throwaway or private work, the ceremony is not worth it, so reserve the full method for work that is long-lived, public, or load-bearing. And if the baseline is itself immature or unstable, judging against it is judging against a moving, unreliable target, so weight your keeps toward caution and re-check often.

## Worked example: migrating my Bicep library to Azure Verified Modules

Here is the method applied, with the Azure details it otherwise abstracts away. My public repository [`azure-bicep-modules`](https://github.com/mbiszczanik/azure-bicep-modules) is the result.

The situation: a personal Bicep library, built up over time, held resource modules (virtual networks, NSGs, key vaults, VMs), multi-resource demos, and certification labs. AVM had since matured into an authoritative baseline for exactly this kind of resource-level Bicep. The question was what, if anything, was still worth carrying into a new, clean, AVM-first library.

In Step 1, the inventory was built by reading the actual file tree, because the repository's own README described a folder structure the tree no longer matched. Provenance checking surfaced the most important finding: two repositories in my candidate set had been authored by other people, not by me, so they were removed entirely, because using them would have been misattribution in a portfolio meant to signal my own judgment. Certification labs were tagged as a separate class, not judged against AVM, because teaching by hand is the opposite of consuming a prebuilt module.

In Step 2, rather than trust my memory of what AVM contained, I checked every relevant claim against the live Bicep module registry and the AVM module index, and recorded versions and maintenance status with the date. This mattered concretely, and it kept mattering. When I first ran the method, in June 2026, the obvious baseline candidate, the `avm/ptn/network/hub-networking` pattern, carried an orphaned marker, meaning only security and bug fixes were being applied to it, and it builds hub-spoke on classic virtual network peering rather than on Azure Virtual Network Manager. When I re-ran the check before publishing, in late September 2026, the picture had moved in both directions. AVM had retired its orphan-marker files in favor of ownership recorded in each module's metadata, and the hub-networking pattern now lists an owner and shows as available again. Meanwhile `avm/res/network/network-manager`, the resource module my own pattern is built on, had been marked orphaned in mid-September. Neither change was visible from memory, and both were one lookup away in the primary source.

In Step 3, most of the resource-level modules sorted to drop, because AVM covered virtual networks, NSGs, key vaults and VMs fully and better, so maintaining private copies meant maintaining worse duplicates. Several sorted to adapt: the monitoring pieces became an opinionated composition consuming AVM resource modules, and the key vault became a hardened wrapper with organizational defaults rather than a reimplementation. One sorted to keep: a secure hub-spoke pattern wired through Azure Virtual Network Manager connectivity, with organizational-default network security rules. The baseline did not provide it then and still does not: as of September 2026 there is no AVM pattern module that composes Virtual Network Manager connectivity into a hub-spoke topology, and no open proposal for one. That became the flagship module, [`secure-hub-spoke-avnm`](https://github.com/mbiszczanik/azure-bicep-modules). The keep never rested on the hub-networking orphan marker alone, which is why that marker's removal does not change it.

The orphaned `network-manager` resource module is the more interesting development, because the flagship consumes it, pinned at version 0.6.1. Orphaned AVM modules still receive security and bug fixes, so this does not turn the keep into a drop, but it is exactly the kind of maintenance-status fact the method says to record: the dependency's status is now part of the documented baseline, and the verdict gets re-checked when it changes, whether someone adopts the module or AVM deprecates it.

In Step 4, that keep was exactly the kind of universal-negative claim that needs attacking, so I checked the supposed absence three independent ways and then handed it to adversarial review tasked with finding the capability and refuting the claim. The keep survived, which is what made it safe to build and to describe publicly as a real gap being filled rather than a wheel being reinvented.

In Step 5, every verdict was written down with its reason and the dated baseline state it was judged against, because AVM moves weekly and the same judgment will need re-running later. The September re-check above is that record doing its job: it took one pass against the primary sources, not a fresh migration. That record, more than the modules it produced, is the durable output. Broader platform decisions of the same kind live as architecture decision records in a separate public repository, [`azure-architecture-decisions`](https://github.com/mbiszczanik/azure-architecture-decisions).

What the method prevented was two errors in opposite directions: the mechanical porting of resource modules AVM had made redundant, and the premature dropping of the connectivity pattern that was the actual differentiator. Neither would have been visible without inventory-by-reality, a verified baseline, and a pressure-tested keep.

## The short version

When a credible standard lands next to your work, ask one question of every piece: **does the baseline do this, at least as well?**

1. Inventory by reality, and check you actually authored it.
2. Verify the baseline today, from primary sources, with the date.
3. Drop what it does as well, adapt what needs your opinion on top, keep what it does not do.
4. Try to refute every keep before you trust it.
5. Write down why, so the next re-check is one pass, not a migration.

Has a standard ever made part of your own work redundant? I would like to hear what you kept, and how you proved it was still needed.

---

I'm Marcin Biszczanik, a Cloud and Platform Consultant (AZ-305) writing about the decisions behind Azure platform work. The modules from this article live in [`azure-bicep-modules`](https://github.com/mbiszczanik/azure-bicep-modules), and the decision records in [`azure-architecture-decisions`](https://github.com/mbiszczanik/azure-architecture-decisions). You can reach me on [LinkedIn](https://www.linkedin.com/in/marcin-biszczanik/).
