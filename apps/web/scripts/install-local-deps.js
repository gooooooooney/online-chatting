#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const localDeps = ["@daveyplate/better-auth-ui"];

const rootNodeModules = path.resolve(__dirname, "../../../node_modules");
const localNodeModules = path.resolve(__dirname, "../node_modules");

function ensureLocalDep(depName) {
	const depPath = depName.split("/");
	const sourcePath = path.join(rootNodeModules, ...depPath);
	const targetPath = path.join(localNodeModules, ...depPath);

	if (!fs.existsSync(sourcePath)) {
		console.log(`❌ Source not found: ${sourcePath}`);
		return;
	}

	// 创建目标目录
	const targetDir = path.dirname(targetPath);
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	// 删除现有目标（如果存在）
	if (fs.existsSync(targetPath)) {
		fs.rmSync(targetPath, { recursive: true, force: true });
	}

	// 复制依赖
	try {
		execSync(`cp -r "${sourcePath}" "${targetPath}"`);
		console.log(`✅ Installed ${depName} locally`);
	} catch (error) {
		console.error(`❌ Failed to install ${depName}:`, error.message);
	}
}

console.log("📦 Installing dependencies locally...");
localDeps.forEach(ensureLocalDep);
console.log("✨ Done!");
