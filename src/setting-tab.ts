import { App, PluginSettingTab, Setting } from "obsidian";
import CleanupPlugin from "src/main";

export default class CleanupPluginSettingTab extends PluginSettingTab {
    plugin: CleanupPlugin;

    constructor(app: App, plugin: CleanupPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        this.containerEl.empty();

        new Setting(this.containerEl)
            .setName("Confirm file deletion")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.confirmFileDeletion)
                    .onChange(async (value) => {
                        this.plugin.settings.confirmFileDeletion = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(this.containerEl)
            .setName("Automatically refresh panel")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.autoRefresh)
                    .onChange(async (value) => {
                        this.plugin.settings.autoRefresh = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(this.containerEl)
            .setName("Exclude regular expressions")
            .setDesc(
                "Exclude files matching the provided regular expression(s) from the corresponding section of the cleanup panel."
            )
            .setHeading();

        new Setting(this.containerEl).setName("Empty files").addText((text) =>
            text
                .setValue(this.plugin.settings.emptyFilesExcludeRegex)
                .onChange(async (value) => {
                    this.plugin.settings.emptyFilesExcludeRegex = value;
                    await this.plugin.saveSettings();
                })
        );
        new Setting(this.containerEl)
            .setName("Orphaned files")
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.orphanedFilesExcludeRegex)
                    .onChange(async (value) => {
                        this.plugin.settings.orphanedFilesExcludeRegex = value;
                        await this.plugin.saveSettings();
                    })
            );
        new Setting(this.containerEl).setName("Broken links").addText((text) =>
            text
                .setValue(this.plugin.settings.brokenLinksExcludeRegex)
                .onChange(async (value) => {
                    this.plugin.settings.brokenLinksExcludeRegex = value;
                    await this.plugin.saveSettings();
                })
        );
        new Setting(this.containerEl)
            .setName("Duplicate files")
            .addText((text) =>
                text
                    .setValue(this.plugin.settings.duplicateFilesExcludeRegex)
                    .onChange(async (value) => {
                        this.plugin.settings.duplicateFilesExcludeRegex = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}
