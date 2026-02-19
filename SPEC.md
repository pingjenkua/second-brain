# Second Brain - Specification

## Overview
A personal knowledge management system for reviewing memories, documents, and tasks.

## Tech Stack
- NextJS 14 (App Router)
- TailwindCSS
- Local storage (JSON file-based for simplicity, or SQLite)

## Features

### 1. Dashboard
- Overview of recent memories, documents, tasks
- Quick stats

### 2. Memories
- Create/edit/delete memory entries
- Fields: title, content, tags, date created, mood/emoji
- Search and filter by tags/date

### 3. Documents
- Upload/view documents (text, markdown)
- Categories/folders
- Search functionality

### 4. Tasks
- Todo list with priorities (high/medium/low)
- Status: pending, in-progress, completed
- Due dates

### 5. Review Mode
- Spaced repetition style review of memories
- Daily "brain dump" of things to remember

## UI/UX
- Clean, minimal dark theme
- Sidebar navigation
- Card-based content display
- Fast, responsive

## Data Storage
- JSON file-based in `/data` folder for simplicity
- `memories.json`, `documents.json`, `tasks.json`
