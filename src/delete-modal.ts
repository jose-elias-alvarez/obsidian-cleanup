import { Modal, Setting, TFile } from "obsidian";
import CleanupPluginPanel from "./panel";

export default class CleanupPluginConfirmDeleteModal extends Modal {
    panel: CleanupPluginPanel;
    file: TFile;

    constructor(panel: CleanupPluginPanel, file: TFile) {
        super(panel.app);
        this.panel = panel;
        this.file = file;
    }

    async delete() {
        await this.app.vault.trash(this.file, true);
        if (this.panel.plugin.settings.autoRefresh)
            await this.panel.plugin.refreshPanels();
        this.close();
    }

    async onOpen() {
        this.titleEl.setText("Delete file");
        this.contentEl.createEl("p", {
            text: `Are you sure you want to delete ${this.file.path}?`,
        });
        new Setting(this.contentEl)
            .addButton((button) =>
                button
                    .setButtonText("Delete")
                    .setWarning()
                    .onClick(async () => await this.delete())
            )
            .addButton((button) =>
                button.setButtonText("Cancel").onClick(() => this.close())
            );
    }

    onClose() {
        this.contentEl.empty();
    }
}
