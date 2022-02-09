import fs from "fs";
import path from "path";
import { program } from "commander";
import { Md5 } from "ts-md5/dist/md5";
import download from "download";
import md5File from "md5-file";
import handlebars from "handlebars";

import desktopTemplate from "./data/nuclear-player-bin/nuclear.desktop.template";
import pkgbuildTemplate from "./data/nuclear-player-bin/PKGBUILD.template";
import srcinfoTemplate from "./data/nuclear-player-bin/.SRCINFO.template";

const packageUrlTemplate = "https://github.com/nukeop/nuclear/releases/download/{{tag}}/nuclear-{{tag}}.deb";
const packageFilenameTemplate = "nuclear-{{tag}}.deb";

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

  const debHash = await md5File(localDebPath);
  const desktopHash = await Md5.hashStr(desktopTemplate);

  const now = new Date();
  const pkgver = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${debHash}`;
  console.log(`Setting pkgver: ${pkgver}`);
  console.log(`Debian package hash: ${debHash}`);
  console.log(`Desktop hash: ${desktopHash}`);
  const pkgbuild = handlebars.compile(pkgbuildTemplate)({
    pkgver,
    epoch: now.valueOf(),
    deburl: packageUrl,
    debmd5: debHash,
    desktopmd5: desktopHash,
  });

  const srcinfo = handlebars.compile(srcinfoTemplate)({
    pkgver,
    deburl: packageUrl,
    debmd5: debHash,
    desktopmd5: desktopHash,
  });

  try {
    await fs.promises.writeFile(
      path.join(options.aurRepoPath, "PKGBUILD"),
      pkgbuild
    );
    await fs.promises.writeFile(
      path.join(options.aurRepoPath, "nuclear.desktop"),
      desktopTemplate
    );
    await fs.promises.writeFile(
      path.join(options.aurRepoPath, ".SRCINFO"),
      srcinfo
    );
  } catch (e) {
    console.error("Error writing files", e);
  }
})();
