import fs from "fs";
import path from "path";
import { program } from "commander";
import download from "download";
import handlebars from "handlebars";

import pkgbuildTemplate from "./data/nuclear-player-bin/PKGBUILD.template";
import srcinfoTemplate from "./data/nuclear-player-bin/.SRCINFO.template";
import hasha from "hasha";

const packageUrlTemplate = "https://github.com/nukeop/nuclear/releases/download/{{tag}}/nuclear-{{tag}}-amd64.deb";
const packageFilenameTemplate = "nuclear-{{tag}}-amd64.deb";

program
  .option(
    "--tag <url>",
    "tag of the latest release",
    "nightly"
  )
  .option("--temp-dir <dir>", "Temporary directory name", "temp")
  .option(
    "--aur-repo-path <path>",
    "AUR package repository path",
    "/tmp/nuclear-player-bin"
  );
program.parse();
const options = program.opts();

(async () => {
  const packageUrl = handlebars.compile(packageUrlTemplate)({ tag: options.tag });
  const packageFilename = handlebars.compile(packageFilenameTemplate)({ tag: options.tag });
  const localDebPath = path.join(options.tempDir, packageFilename);

  try {
    await fs.promises.access(options.tempDir);
  } catch (e) {
    await fs.promises.mkdir(options.tempDir);
  }

  try {
    await fs.promises.access(localDebPath, fs.constants.F_OK);
    console.log("Debian package already exists");
  } catch (e) {
    console.log(`Downloading ${packageUrl}`);
    await download(packageUrl, options.tempDir);
    console.log("Downloaded");
  }
  
  const debHash = await hasha.fromFile(localDebPath, { algorithm: "sha256" });

  const pkgver = `${options.tag.replace('v', '')}`;
  console.log(`Setting pkgver: ${pkgver}`);
  console.log(`Debian package hash: ${debHash}`);
  const pkgbuild = handlebars.compile(pkgbuildTemplate)({
    pkgver,
    deburl: packageUrl,
    debsha256: debHash
  });

  const srcinfo = handlebars.compile(srcinfoTemplate)({
    pkgver,
    deburl: packageUrl,
    debsha256: debHash,
  });

  try {
    await fs.promises.writeFile(
      path.join(options.aurRepoPath, "PKGBUILD"),
      pkgbuild
    );
    await fs.promises.writeFile(
      path.join(options.aurRepoPath, ".SRCINFO"),
      srcinfo
    );
  } catch (e) {
    console.error("Error writing files", e);
  }
})();
