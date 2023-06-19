# [Tide 🪼](https://gitee.com/oschina/tide)

Tide is a React-based rich text editor with out-of-the-box functionality, strong extensibility, and comprehensive support for Markdown syntax.

[![Version](https://img.shields.io/npm/v/@gitee/tide.svg?label=version)](https://www.npmjs.com/package/@gitee/tide)
[![Downloads](https://img.shields.io/npm/dm/@gitee/tide.svg)](https://npmcharts.com/compare/@gitee/tide?minimal=true)
[![License](https://img.shields.io/npm/l/@gitee/tide.svg)](https://www.npmjs.com/package/@gitee/tide)

## Online Demo

https://oschina.gitee.io/tide

![](./docs/images/tide-screenshot.jpg)

## Example Code

- [Basic Usage](./packages/editor/README.md)
- [Advanced Usage](./apps/demo)
- [Real-world Usage](./apps/legacy)

## Features

- JSON-based storage format
- Supports Markdown shortcut syntax
  - Headings
  - Quotes
  - Code blocks
  - Tables
  - Hyperlinks
  - Images
  - Separators
  - Bold, italic, strikethrough
  - Unordered lists, ordered lists, task lists
- Supports pasting Markdown text
- Supports enhanced Table functionality
- Supports pasting and dragging images
- Supports Emoji selection
- Built-in menu bar
- Supports multiple themes

## Directories

```
.
├── apps
│   ├── demo                      # Demo project deployed on Pages, URL: https://oschina.gitee.io/tide
│   └── legacy                    # Real-world project used by Gitee Community Edition,
│                                 # package name is @gitee/tide-legacy
├── presets                       # Presets with UI and configuration for @, #, ! mention functionality,
│                                 # mainly used by @gitee/tide-legacy
├── docs                          # Documentation (to be completed), including contribution guidelines
├── packages                      # Directory for organizing monorepo packages
│   ├── editor                    # Out-of-the-box editor base package, package name is @gitee/tide
│   ├── starter-kit               # Integrates commonly used extension packages with the @gitee/tide package
│   │                             # to provide an out-of-the-box experience
│   ├── common                    # Common utility classes, etc.
│   ├── react                     # React wrapper for the editor, facilitating usage in React projects
│   ├── extension-*               # Packages starting with extension- that provide
│   │                             # extension functionality for the editor
│   ├── tsconfig                  # Unified tsconfig configuration
│   └── eslint-config-custom      # Unified eslint configuration
└── scripts                       # Scripts to simplify the development process, etc.
```

## Build and Run

Tide uses [turborepo](https://turbo.build/repo) to manage the compilation and distribution of multiple npm packages and [pnpm](https://pnpm.io) to manage local dependencies.

```shell
git clone https://gitee.com/oschina/tide.git

cd tide

# Install dependencies
pnpm i

# Build packages
pnpm build

# Run the demo for development, it will automatically open the browser
pnpm dev:demo --open
```

> Due to the complex dependency relationships in the monorepo, local builds are not currently supported for use through `npm link`, `yarn link`, and `pnpm link --global`.

## Contributing

- For bug reports, please use [Issues](https://gitee.com/oschina/tide/issues)
- For code contribution, please use [Pull Request](https://gitee.com/oschina/tide/pulls). Before creating a pull request, please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

## Who's Using Tide

- [Gitee Enterprise Edition](https://e.gitee.com)
- [Gitee Community Edition](https://gitee.com)

## Credits

- [Tiptap](https://github.com/ueberdosis/tiptap)
- [ProseMirror](https://github.com/ProseMirror/prosemirror)
