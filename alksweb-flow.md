# ALKSWeb Admin Keys & Change Request Flow

This document describes how ALKSWeb interacts with the following repositories when a user requests Admin Keys and is prompted to create a change request:


## 1. User Requests Admin Keys in ALKSWeb

## 2. ALKSWeb Interacts with ALKS.js

## 3. ALKS Backend (ALKS)

## 4. ALKSWeb Prompts for Change Request

## 5. ChangeMinder Integration

## 6. ChangeAPI Interaction

## 7. Completion & Notification


## Summary Diagram

```
User → ALKSWeb → ALKS.js → ALKS
           ↓
      ChangeMinder → ChangeAPI
           ↓
        Approval
           ↓
      ALKSWeb → ALKS.js → ALKS
           ↓
         Admin Keys
```


This flow ensures secure, auditable, and policy-compliant Admin Key creation across the integrated systems.
