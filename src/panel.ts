import {
    ButtonComponent,
    ExtraButtonComponent,
    ItemView,
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
            .onClick(() => this.onOpen());
        refreshButton.setDisabled(true);

        // if we await the promise, new panels won't receive focus until onOpen returns
        this.plugin
            .getCleanupData()
            .then(({ emptyFiles, orphanedFiles, duplicates, brokenLinks }) => {
                loadingText.remove();
                refreshButton.setDisabled(false);

                container.createEl("h2", { text: "Empty files" });
                if (emptyFiles.length === 0) {
                    container.createEl("p", {
                        text: "No empty files found!",
                    });
                } else {
                    const list = container.createEl("ul");
                    emptyFiles.forEach((file) =>
                        this.createFileLink(list.createEl("li"), file),
                    );
                }

                container.createEl("h2", { text: "Orphaned  files" });
                if (orphanedFiles.length === 0) {
                    container.createEl("p", {
                        text: "No orphaned files found!",
                    });
                } else {
                    const list = container.createEl("ul");
                    orphanedFiles.forEach((file) =>
                        this.createFileLink(list.createEl("li"), file),
                    );
                }

                container.createEl("h2", { text: "Broken links" });
                if (brokenLinks.size === 0) {
                    container.createEl("p", {
                        text: "No broken links found!",
                    });
                } else {
                    const list = container.createEl("ul");
                    brokenLinks.forEach((files, link) => {
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
                            this.createFileLink(
                                nestedList.createEl("li"),
                                file,
                            ),
                        );
                    });
                }

                container.createEl("h2", { text: "Duplicate files" });
                if (!duplicates.length) {
                    container.createEl("p", {
                        text: "No duplicate files found!",
                    });
                } else {
                    const list = container.createEl("ul");
                    duplicates.forEach((group) => {
                        const listItem = list.createEl("li");
                        this.createFileLink(listItem, group[0]);
                        const nestedList = listItem.createEl("ul");
                        group
                            .slice(1)
                            .forEach((duplicate) =>
                                this.createFileLink(
                                    nestedList.createEl("li"),
                                    duplicate,
                                ),
                            );
                    });
                }
            });
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
