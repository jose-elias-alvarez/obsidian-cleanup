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
                    }),
            );

        new Setting(this.containerEl)
            .setName("Automatically refresh panel")
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.autoRefresh)
                    .onChange(async (value) => {
                        this.plugin.settings.autoRefresh = value;
                        await this.plugin.saveSettings();
                    }),
            );

        new Setting(this.containerEl).setName("Empty files").setHeading();
        new Setting(this.containerEl).setName("Enable").addToggle((toggle) =>
            toggle
                .setValue(this.plugin.settings.emptyFiles.enable)
                .onChange(async (value) => {
                    this.plugin.settings.emptyFiles.enable = value;
                    await this.plugin.saveSettings();
                }),
        );
        new Setting(this.containerEl).setName("Ignore regex").addText((text) =>
            text
                .setValue(this.plugin.settings.emptyFiles.ignoreRegex)
                .onChange(async (value) => {
                    this.plugin.settings.emptyFiles.ignoreRegex = value;
                    await this.plugin.saveSettings();
                }),
        );

        new Setting(this.containerEl).setName("Orphaned files").setHeading();
        new Setting(this.containerEl).setName("Enable").addToggle((toggle) =>
            toggle
                .setValue(this.plugin.settings.orphanedFiles.enable)
                .onChange(async (value) => {
                    this.plugin.settings.orphanedFiles.enable = value;
                    await this.plugin.saveSettings();
                }),
        );
        new Setting(this.containerEl)
            .setName("Ignore files with tags")
            .addToggle((toggle) =>
                toggle
                    .setValue(
                        this.plugin.settings.orphanedFiles.ignoreFilesWithTags,
                    )
                    .onChange(async (value) => {
                        this.plugin.settings.orphanedFiles.ignoreFilesWithTags =
                            value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl)
            .setName("Ignore files with properties")
            .addToggle((toggle) =>
                toggle
                    .setValue(
                        this.plugin.settings.orphanedFiles
                            .ignoreFilesWithProperties,
                    )
                    .onChange(async (value) => {
                        this.plugin.settings.orphanedFiles.ignoreFilesWithProperties =
                            value;
                        await this.plugin.saveSettings();
                    }),
            );
        new Setting(this.containerEl).setName("Ignore regex").addText((text) =>
            text
                .setValue(this.plugin.settings.orphanedFiles.ignoreRegex)
                .onChange(async (value) => {
                    this.plugin.settings.orphanedFiles.ignoreRegex = value;
                    await this.plugin.saveSettings();
                }),
        );

        new Setting(this.containerEl).setName("Broken links").setHeading();
        new Setting(this.containerEl).setName("Enable").addToggle((toggle) =>
            toggle
                .setValue(this.plugin.settings.brokenLinks.enable)
                .onChange(async (value) => {
                    this.plugin.settings.brokenLinks.enable = value;
                    await this.plugin.saveSettings();
                }),
        );
        new Setting(this.containerEl).setName("Ignore regex").addText((text) =>
            text
                .setValue(this.plugin.settings.brokenLinks.ignoreRegex)
                .onChange(async (value) => {
                    this.plugin.settings.brokenLinks.ignoreRegex = value;
                    await this.plugin.saveSettings();
                }),
        );

        new Setting(this.containerEl).setName("Duplicate files").setHeading();
        new Setting(this.containerEl).setName("Enable").addToggle((toggle) =>
            toggle
                .setValue(this.plugin.settings.duplicateFiles.enable)
                .onChange(async (value) => {
                    this.plugin.settings.duplicateFiles.enable = value;
                    await this.plugin.saveSettings();
                }),
        );
        new Setting(this.containerEl).setName("Ignore regex").addText((text) =>
            text
                .setValue(this.plugin.settings.duplicateFiles.ignoreRegex)
                .onChange(async (value) => {
                    this.plugin.settings.duplicateFiles.ignoreRegex = value;
                    await this.plugin.saveSettings();
                }),
        );
        new Setting(this.containerEl).setName("Untagged files").setHeading();
        new Setting(this.containerEl).setName("Enable").addToggle((toggle) =>
            toggle
                .setValue(this.plugin.settings.untaggedFiles.enable)
                .onChange(async (value) => {
                    this.plugin.settings.untaggedFiles.enable = value;
                    await this.plugin.saveSettings();
                }),
        );
        new Setting(this.containerEl).setName("Ignore regex").addText((text) =>
            text
                .setValue(this.plugin.settings.untaggedFiles.ignoreRegex)
                .onChange(async (value) => {
                    this.plugin.settings.untaggedFiles.ignoreRegex = value;
                    await this.plugin.saveSettings();
                }),
        );
    }
}
