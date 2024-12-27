import {
    ButtonComponent,
    ExtraButtonComponent,
    ItemView,
    Notice,
    TFile,
    WorkspaceLeaf,
} from "obsidian";
import CleanupPluginConfirmDeleteModal from "./delete-modal";
import CleanupPlugin from "./main";

export default class CleanupPluginPanel extends ItemView {
    plugin: CleanupPlugin;

    constructor(leaf: WorkspaceLeaf, plugin: CleanupPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    private createFileLink(el: Element, file: TFile) {
        const container = el.createDiv({ cls: "cleanup-file-link-container" });
        container
            .createEl("a", {
                text: file.path,
            })
            .addEventListener("click", (event) => {
                event.preventDefault();
                this.app.workspace.getLeaf().openFile(file);
            });
        new ExtraButtonComponent(container)
            .setIcon("trash")
            .onClick(async () => {
                const modal = new CleanupPluginConfirmDeleteModal(this, file);
                if (this.plugin.settings.confirmFileDeletion) {
                    modal.open();
                } else {
                    await modal.delete();
                }
            });

        return container;
    }

    private renderFileLinkList(el: Element, files: TFile[]) {
        const list = el.createEl("ul");
        files.forEach((file) => this.createFileLink(list.createEl("li"), file));
    }

    private renderBrokenLinksList(el: Element, links: Map<string, TFile[]>) {
        const list = el.createEl("ul");
        links.forEach((files, link) => {
            const listItem = list.createEl("li");
            listItem
                .createEl("a", {
                    text: link,
                    cls: "cleanup-broken-link",
                })
                .addEventListener("click", (event) => {
                    event.preventDefault();
                    this.app.workspace.openLinkText(link, "");
                });
            const nestedList = listItem.createEl("ul");
            files.forEach((file) =>
                this.createFileLink(nestedList.createEl("li"), file),
            );
        });
    }

    private renderDuplicateFilesList(el: Element, duplicates: TFile[][]) {
        const list = el.createEl("ul");
        duplicates.forEach((group) => {
            const listItem = list.createEl("li");
            this.createFileLink(listItem, group[0]);
            const nestedList = listItem.createEl("ul");
            group
                .slice(1)
                .forEach((duplicate) =>
                    this.createFileLink(nestedList.createEl("li"), duplicate),
                );
        });
    }

    async onOpen() {
        const rootContainer = this.containerEl.children[1];
        rootContainer.empty();

        const container = rootContainer.createDiv({
            cls: "cleanup-container",
        });
        const loadingText = container.createEl("p", {
            text: "Loading files...",
        });

        const headingContainer = container.createDiv();
        headingContainer.classList.add("cleanup-heading-container");
        headingContainer.createEl("h1", { text: "Cleanup" });

        const refreshButton = new ButtonComponent(headingContainer)
            .setIcon("refresh-ccw")
            .onClick(async () => {
                new Notice("Refreshing cleanup panel...");
                await this.onOpen();
            });
        refreshButton.setDisabled(true);

        // if we await the promise, new panels won't receive focus until onOpen returns
        this.plugin
            .getCleanupData()
            .then(
                ({
                    emptyFiles,
                    orphanedFiles,
                    duplicates,
                    brokenLinks,
                    untaggedFiles,
                }) => {
                    loadingText.remove();
                    refreshButton.setDisabled(false);

                    for (const { title, empty, render } of [
                        {
                            title: "Empty files",
                            enabled: this.plugin.settings.emptyFiles.enable,
                            empty: emptyFiles.length === 0,
                            render: (section: HTMLDivElement) =>
                                this.renderFileLinkList(section, emptyFiles),
                        },
                        {
                            title: "Orphaned files",
                            enabled: this.plugin.settings.orphanedFiles.enable,
                            empty: orphanedFiles.length === 0,
                            render: (section: HTMLDivElement) =>
                                this.renderFileLinkList(section, orphanedFiles),
                        },
                        {
                            title: "Broken links",
                            enabled: this.plugin.settings.brokenLinks.enable,
                            empty: brokenLinks.size === 0,
                            render: (section: HTMLDivElement) =>
                                this.renderBrokenLinksList(
                                    section,
                                    brokenLinks,
                                ),
                        },
                        {
                            title: "Duplicate files",
                            enabled: this.plugin.settings.duplicateFiles.enable,
                            empty: duplicates.length === 0,
                            render: (section: HTMLDivElement) =>
                                this.renderDuplicateFilesList(
                                    section,
                                    duplicates,
                                ),
                        },
                        {
                            title: "Untagged files",
                            enabled: this.plugin.settings.untaggedFiles.enable,
                            empty: untaggedFiles.length === 0,
                            render: (section: HTMLDivElement) =>
                                this.renderFileLinkList(section, untaggedFiles),
                        },
                    ].filter((section) => section.enabled)) {
                        const section = container.createDiv({
                            cls: "cleanup-section",
                        });
                        section.createEl("h2", { text: title });
                        if (empty) {
                            section.createEl("p", {
                                text: `No ${title.toLowerCase()} found!`,
                            });
                        } else {
                            render(section);
                        }
                    }
                },
            );
    }

    getViewType() {
        return CleanupPlugin.viewType;
    }

    getDisplayText() {
        return CleanupPlugin.viewDisplayText;
    }

    getIcon() {
        return CleanupPlugin.icon;
    }
}
