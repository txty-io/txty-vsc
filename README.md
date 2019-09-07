# Texterify VSC Extension

[![Build Status](https://travis-ci.org/chrztoph/texterify-vsc.svg?branch=master)](https://travis-ci.org/chrztoph/texterify-vsc) [![License](https://img.shields.io/github/license/chrztoph/texterify-vsc.svg)](https://img.shields.io/github/license/chrztoph/texterify-vsc.svg) [![Open Issues](https://img.shields.io/github/issues-raw/chrztoph/texterify-vsc.svg)](https://img.shields.io/github/issues-raw/chrztoph/texterify-vsc.svg)

**Official VSC extension to interact with Texterify.**

This extension allows you to add keys and download your translations without leaving your editor.

For more information about Texterify visit https://github.com/chrztoph/texterify.

## Commands

- Texterify: Add Key
- Texterify: Download keys

## Installation

This extension uses the `texterify` CLI program. To install it run
```sh
npm install -g texterify
```
or
```sh
yarn global add texterify
```

## Configuration

Place a `texterify.json` file in the root directory of your VSC project.

| Option | Description |
| --- | --- |
| api_base_url | The base URL of the API ending with `/api`. |
| api_version | The version of the API (e.g. `v1`). |
| project_id | The ID of the project which can be found on the project site. |
| export_directory | The directory to export the translations to. |

### Example

```json
{
    "api_base_url": "http://localhost/api",
    "api_version": "v1",
    "project_id": "6fa821e2-1e7e-4ec6-9b0f-9949ce83b160",
    "export_directory": "translations"
}

```
