import { Plugin, TFile } from "obsidian";
import CleanupPluginPanel from "./panel";
import CleanupPluginSettingTab from "./setting-tab";
import { CleanupPluginSettings, DEFAULT_SETTINGS } from "./settings";

export default class CleanupPlugin extends Plugin {
    static viewType = "cleanup-view";
    static viewDisplayText = "Cleanup";
    static openPanelId = "open-cleanup-panel";
    static openPanelName = "Open cleanup panel";
    static icon = "wand-sparkles";

    settings: CleanupPluginSettings;

    private simpleHash(content: string) {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return hash;
    }

    private createMatcher(regexString: string) {
        if (!regexString) return () => false;
        const compiled = new RegExp(regexString);
        return (path: string) => compiled.test(path);
    }

    public async getCleanupData(): Promise<{
        emptyFiles: TFile[];
        orphanedFiles: TFile[];
        brokenLinks: Map<string, TFile[]>;
        duplicates: TFile[][];
    }> {
        const emptyFiles: TFile[] = [];
        const orphanedFiles: TFile[] = [];
        const brokenLinks: Map<string, TFile[]> = new Map();
        const duplicates: Map<number, TFile[]> = new Map();

        const orphanedFileMatcher = this.createMatcher(
            this.settings.orphanedFilesExcludeRegex
        );
        const emptyFileMatcher = this.createMatcher(
            this.settings.emptyFilesExcludeRegex
        );
        const brokenLinkMatcher = this.createMatcher(
            this.settings.brokenLinksExcludeRegex
        );
        const duplicateFileMatcher = this.createMatcher(
            this.settings.duplicateFilesExcludeRegex
        );

        await Promise.all(
            this.app.vault.getFiles().map(async (file) => {
                const isMarkdownFile = file.name.endsWith(".md");
                const content = isMarkdownFile // reading non-markdown blobs is *really* slow
                    ? (await this.app.vault.cachedRead(file)).trim()
                    : "";
                const contentHash = content ? this.simpleHash(content) : 0;

                const isEmpty =
                    (isMarkdownFile
                        ? content.length === 0
                        : file.stat.size === 0) && !emptyFileMatcher(file.path);
                if (isEmpty) emptyFiles.push(file);

                const isOrphaned =
                    // @ts-ignore
                    !this.app.metadataCache.getBacklinksForFile(file)?.data
                        .size && !orphanedFileMatcher(file.path);
                if (isOrphaned) orphanedFiles.push(file);

                if (!brokenLinkMatcher(file.path))
                    Object.keys(
                        this.app.metadataCache.unresolvedLinks[file.path] || {}
                    ).forEach((link) =>
                        brokenLinks.set(link, [
                            ...(brokenLinks.get(link) || []),
                            file,
                        ])
                    );

                if (
                    contentHash && // don't bother determining duplicates for files w/o content
                    !duplicateFileMatcher(file.path)
                )
                    duplicates.set(contentHash, [
                        ...(duplicates.get(contentHash) || []),
                        file,
                    ]);
            })
        );
        return {
            emptyFiles,
            orphanedFiles,
            brokenLinks,
            // transform before returning, since we no longer care about the hash
            duplicates: Array.from(duplicates.values()).filter(
                (d) => d.length > 1
            ),
        };
    }

    async refreshPanels() {
        await Promise.all(
            this.app.workspace
                .getLeavesOfType(CleanupPlugin.viewType)
                .map(
                    (leaf) =>
                        leaf.view instanceof CleanupPluginPanel &&
                        leaf.view.onOpen()
                )
        );
    }

    async activatePanel() {
        const leaves = this.app.workspace.getLeavesOfType(
            CleanupPlugin.viewType
        );
        if (leaves.length > 0) {
            leaves.forEach((leaf) => this.app.workspace.revealLeaf(leaf));
            return;
        }

        const leaf = this.app.workspace.getLeaf(true);
        await leaf.setViewState({
            type: CleanupPlugin.viewType,
            active: true,
        });
        await this.app.workspace.revealLeaf(leaf);
        this.app.workspace.setActiveLeaf(leaf, { focus: true });
    }

    async onload() {
        await this.loadSettings();

        this.registerView(
            CleanupPlugin.viewType,
            (leaf) => new CleanupPluginPanel(leaf, this)
        );

        this.addCommand({
            id: CleanupPlugin.openPanelId,
            name: CleanupPlugin.openPanelName,
            callback: async () => await this.activatePanel(),
        });
        this.addRibbonIcon(
            CleanupPlugin.icon,
            CleanupPlugin.openPanelName,
            async () => await this.activatePanel()
        );

        this.registerEvent(
            this.app.workspace.on("active-leaf-change", async (leaf) => {
                if (
                    leaf?.view instanceof CleanupPluginPanel &&
                    this.settings.autoRefresh
                ) {
                    await leaf.view.onOpen();
                }
            })
        );

        this.addSettingTab(new CleanupPluginSettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
        if (this.settings.autoRefresh) await this.refreshPanels();
    }
}