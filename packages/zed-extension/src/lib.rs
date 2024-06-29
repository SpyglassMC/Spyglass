use std::fs;
use zed_extension_api::{self as zed, Result};

static GITHUB_REPO: &'static str = "SpyglassMC/Spyglass";
static BIN_NAME: &'static str = "spyglass";

struct SpyglassExtension {
    cached_binary_path: Option<String>,
}

enum Status {
    None,
    CheckingForUpdate,
    Downloading,
    Failed(String),
}

fn update_status(id: &zed::LanguageServerId, status: Status) {
    match status {
        Status::None => zed::set_language_server_installation_status(
            id,
            &zed::LanguageServerInstallationStatus::None,
        ),
        Status::CheckingForUpdate => zed::set_language_server_installation_status(
            id,
            &zed::LanguageServerInstallationStatus::CheckingForUpdate,
        ),
        Status::Downloading => zed::set_language_server_installation_status(
            id,
            &zed::LanguageServerInstallationStatus::Downloading,
        ),
        Status::Failed(msg) => zed::set_language_server_installation_status(
            id,
            &zed::LanguageServerInstallationStatus::Failed(msg),
        ),
    }
}

impl SpyglassExtension {
    fn language_server_binary_path(
        &mut self,
        id: &zed::LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<String> {
        // Check if the binary is already installed by manually checking the path
        if let Some(path) = worktree.which(BIN_NAME) {
            return Ok(path);
        }

        if let Some(path) = &self.cached_binary_path {
            if fs::metadata(path).map_or(false, |stat| stat.is_file()) {
                update_status(id, Status::None);
                return Ok(path.clone());
            }
        }
        let (platform) = zed::current_platform();

        if fs::metadata(BIN_NAME).map_or(false, |stat| stat.is_file()) {
            update_status(id, Status::None);
            return Ok(BIN_NAME.to_string());
        }

        update_status(id, Status::CheckingForUpdate);

        let release = zed::latest_github_release(
            GITHUB_REPO,
            zed::GithubReleaseOptions {
                require_assets: true,
                pre_release: true,
            },
        )?;

        let asset_name = format!(
            "spyglass-zed.{ext}",
            ext = match platform {
                zed::Os::Windows => "zip",
                _ => "tar.gz",
            }
        );

        let file_type = match platform {
            zed::Os::Windows => zed::DownloadedFileType::Zip,
            _ => zed::DownloadedFileType::GzipTar,
        };

        let asset = release
            .assets
            .iter()
            .find(|asset| asset.name == asset_name)
            .ok_or_else(|| format!("no asset found matching {:?}", asset_name))?;

        let version_dir = format!("spyglass-{}", release.version);
        let binary_path = format!("{version_dir}/{BIN_NAME}");

        if !fs::metadata(&binary_path).map_or(false, |stat| stat.is_file()) {
            update_status(id, Status::Downloading);
            zed::download_file(&asset.download_url, &version_dir, file_type)
                .map_err(|e| format!("failed to download file: {e}"))?;

            let entries =
                fs::read_dir(".").map_err(|e| format!("failed to list working directory {e}"))?;
            for entry in entries {
                let entry = entry.map_err(|e| format!("failed to load directory entry {e}"))?;
                if entry.file_name().to_str() != Some(&version_dir) {
                    fs::remove_dir_all(&entry.path()).ok();
                }
            }

            update_status(id, Status::None);
        }

        self.cached_binary_path = Some(binary_path.clone());
        Ok(binary_path)
    }
}

impl zed::Extension for SpyglassExtension {
    fn new() -> Self {
        Self {
            cached_binary_path: None,
        }
    }

    fn language_server_command(
        &mut self,
        id: &zed::LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        let command = self
            .language_server_binary_path(id, worktree)
            .map_err(|err| {
                update_status(id, Status::Failed(err.to_string()));
                err
            })?;

        Ok(zed::Command {
            command,
            args: vec!["server".to_string()],
            env: Default::default(),
        })
    }
}

zed::register_extension!(SpyglassExtension);
