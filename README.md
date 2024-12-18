# Cleanup

Clean up your Obsidian vault from a convenient panel.

## Usage

After installing and enabling the plugin, use the `Open cleanup panel` command or ribbon icon to open a panel in a new tab containing lists of the following:

- Empty files
- Orphaned files: files that are not linked to from any other files
- Broken links: files that are linked to from other files but do not exist
- Duplicate files: files that contain the same content

Each file has a link which you can use to open it, or you can use the trash can icon to delete it. That's it!

## Configuration

The plugin exposes the following general configuration options:

- Confirm file deletion (defaults to true): whether to show a confirmation modal when deleting a file.
- Automatically refresh panel (defaults to true): whether to automatically refresh the panel after certain operations. If disabled, you can refresh the panel on command by using the refresh icon in the top right.

Each section of the panel also has its own options, including one that controls whether the panel is enabled.

### Ignore regex

For each section, you can configure a JavaScript regular expression which will test against the file's path, relative to the vault root (including the file extension). If there's a match, the file will be ignored, i.e. not displayed in the section.

Regular expressions are powerful and flexible and can be made to do (almost) anything you want. (If you're unfamilar, ask ChatGPT.) For example, to exclude files in the `Daily` and `Files` directories from a section:

```
^(Daily|Files)/
```

Or to exclude daily notes in YYYY-MM-DD format:

```
\d{4}-\d{2}-\d{2}\.md$
```

## Notes

- Opening the panel for the first time may be slow, especially on larger vaults, but subsequent invocations should be faster.
- Notes containing only whitespace are considered empty.
- Empty notes are not considered to be duplicates of each other.
- Only Markdown files are checked for duplicate content, since it's too slow to check images and other attachments.
