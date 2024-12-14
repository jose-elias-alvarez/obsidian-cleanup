export interface CleanupPluginSettings {
    confirmFileDeletion: boolean;
    autoRefresh: boolean;
    emptyFilesExcludeRegex: string;
    orphanedFilesExcludeRegex: string;
    brokenLinksExcludeRegex: string;
    duplicateFilesExcludeRegex: string;
}

export const DEFAULT_SETTINGS: CleanupPluginSettings = {
    confirmFileDeletion: true,
    autoRefresh: true,
    emptyFilesExcludeRegex: "",
    orphanedFilesExcludeRegex: "",
    brokenLinksExcludeRegex: "",
    duplicateFilesExcludeRegex: "",
};
