# n8n-nodes-nullbounce

[![npm version](https://badge.fury.io/js/%40nullbounce%2Fn8n-nodes-nullbounce.svg)](https://www.npmjs.com/package/@nullbounce/n8n-nodes-nullbounce)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This is an official community node for [n8n](https://n8n.io) that integrates with the [NullBounce](https://nullbounce.com) email verification service.

NullBounce allows you to verify and clean email addresses in real time, reduce bounce rates, protect your sender reputation, and check your credit balance directly inside your n8n automation workflows.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Credentials](#credentials)
- [Operations](#operations)
  - [Email](#1-email)
  - [Account](#2-account)
- [Example Workflows](#example-workflows)
- [Support & Documentation](#support--documentation)
- [License](#license)

---

## Prerequisites

To use this node, you need:

1. A **NullBounce** account. If you don't have one, sign up at [nullbounce.com](https://nullbounce.com).
2. A NullBounce **API Key**. You can generate one from your [NullBounce Dashboard](https://app.nullbounce.com).

---

## Installation

### In n8n (Community Nodes)

1. Go to **Settings > Community Nodes** in your n8n instance.
2. Select **Install a community node**.
3. Enter the package name:

   ```text
   @nullbounce/n8n-nodes-nullbounce
   ```

4. Agree to the risks of installing third-party code and click **Install**.

### CLI / Docker

If you run n8n in Docker or via CLI, you can install the package into your custom nodes directory:

```bash
cd ~/.n8n/custom
npm install @nullbounce/n8n-nodes-nullbounce
```

Restart your n8n instance to load the node.

---

## Credentials

To configure the credentials:

1. In your n8n workflow, add the **NullBounce** node.
2. Under **Credential to connect with**, select **Create New Credential**.
3. Enter your **API Key** from the NullBounce dashboard.
4. Click **Save**.
5. You can click **Test connection** to ensure your API key is valid and connected successfully.

---

## Operations

### 1. Email

- **Validate**: Validates a single email address.
  - **Input Parameter**: `Email` (e.g. `={{ $json.email }}` or `user@example.com`).
  - **Behavior**: Preserves all incoming item fields and enriches the output with a `nullbounce` object containing full verification details.

**Sample Output:**

```json
{
	"id": 101,
	"name": "Alex",
	"email": "alex@example.com",
	"nullbounce": {
		"created": "2026-09-10T17:46:37Z",
		"email": "alex@example.com",
		"is_disposable": false,
		"is_free": false,
		"is_role": false,
		"status_text": "Valid",
		"substatus_text": "",
		"result": "Safe",
		"user": {
			"email": "your_account@company.com"
		}
	}
}
```

### 2. Account

- **Get Balance**: Retrieves the current available credit balance of your NullBounce account.
  - No parameters required.

**Sample Output:**

```json
{
	"balance": 1250
}
```

---

## Example Workflows

### 1. Clean Contacts from Google Sheets / CRM

- **Trigger** (e.g., Google Sheets / Airtable / Webhook) ➔
- **NullBounce** (`Email: Validate`) ➔
- **If** (`{{ $json.nullbounce.result }} === 'Safe'`) ➔
- **CRM / Email Marketing Tool** (Add only verified emails).

### 2. Automated Low-Credit Monitoring

- **Schedule Trigger** (Runs daily) ➔
- **NullBounce** (`Account: Get Balance`) ➔
- **If** (`{{ $json.balance }} < 200`) ➔
- **Slack / Telegram** (Alert team: _"NullBounce credits are running low!"_).

---

## Support & Documentation

- **NullBounce Website:** [https://nullbounce.com](https://nullbounce.com)
- **API Documentation:** [https://nullbounce.com/docs/api/](https://nullbounce.com/docs/api/)
- **Support Email:** [support@nullbounce.com](mailto:support@nullbounce.com)
- **Bug Reports & Issues:** [GitHub Issues](https://github.com/NullBounce/n8n-nodes-nullbounce/issues)

---

## License

[MIT](LICENSE.md) © 2026 NullBounce
