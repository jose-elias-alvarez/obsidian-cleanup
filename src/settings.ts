export interface CleanupPluginSettings {
    confirmFileDeletion: boolean;
    autoRefresh: boolean;
    emptyFiles: {
        enable: boolean;
        ignoreRegex: string;
    };
    orphanedFiles: {
        enable: boolean;
        ignoreFilesWithTags: boolean;
        ignoreFilesWithProperties: boolean;
        ignoreRegex: string;
    };
    brokenLinks: {
        enable: boolean;
        ignoreRegex: string;
    };
    duplicateFiles: {
        enable: boolean;
        ignoreRegex: string;
    };
    untaggedFiles: {
        enable: boolean;
        ignoreRegex: string;
    };
}

export const DEFAULT_SETTINGS: CleanupPluginSettings = {
    confirmFileDeletion: true,
    autoRefresh: true,
    emptyFiles: {
        enable: true,
        ignoreRegex: "",
    },
    orphanedFiles: {
        enable: true,
        ignoreFilesWithTags: false,
        ignoreFilesWithProperties: false,
        ignoreRegex: "",
    },
    brokenLinks: {
        enable: true,
        ignoreRegex: "",
    },
    duplicateFiles: {
        enable: true,
        ignoreRegex: "",
    },
    untaggedFiles: {
        enable: false,
        ignoreRegex: "",
    },
};
