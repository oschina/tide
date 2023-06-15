# @gitee# @gitee/tide-extension-task-item

## Introduction

This extension is used to render the list items for task lists, which has a checkbox to indicate the selection status and depends on the task list extension.

## Features

This extension re-implements the following features based on `@tiptap/extension-task-item`:

- Allows modifying the selection status in read-only mode
- Input rule: Quickly creates a task list by typing `[ ] `, `[x] `, `【 】 `, or `【x】 ` at the beginning of a line
- Paste rule: Automatically converts content in the format of `[ ] text` or `[x] text` to a task list item when pasted
- If there is a task list before or after creating a task list item, it will automatically merge into one task list
- In a bullet list or ordered list, you can quickly convert it to a task list by typing content that meets the above input rules at the beginning of a list item.
