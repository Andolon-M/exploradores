import { promises as fs } from "fs";
import path from "path";

type FileNode = {
  name: string;
  relativePath: string;
};

type DirectoryNode = {
  name: string;
  relativePath: string;
  directories: DirectoryNode[];
  files: FileNode[];
};

type MapResult = {
  root: DirectoryNode;
  totals: {
    directories: number;
    leafDirectories: number;
    files: number;
  };
};

const projectRoot = process.cwd();
const args = process.argv.slice(2);

const inputDirArg = args[0] ?? "Manuales al 2.0 ER";
const outputFileArg = args[1] ?? "seeders/manuales-schema.json";

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

async function mapDirectory(
  absoluteDir: string,
  baseDir: string
): Promise<{ node: DirectoryNode; directories: number; leafDirectories: number; files: number }> {
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });

  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "es"));

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "es"));

  const relativeDir = toPosixPath(path.relative(baseDir, absoluteDir)) || ".";

  const node: DirectoryNode = {
    name: path.basename(absoluteDir),
    relativePath: relativeDir,
    directories: [],
    files: files.map((fileName) => ({
      name: fileName,
      relativePath: toPosixPath(path.relative(baseDir, path.join(absoluteDir, fileName))),
    })),
  };

  let totalDirectories = 1;
  let totalLeafDirectories = directories.length === 0 ? 1 : 0;
  let totalFiles = files.length;

  for (const directoryName of directories) {
    const childAbsoluteDir = path.join(absoluteDir, directoryName);
    const child = await mapDirectory(childAbsoluteDir, baseDir);

    node.directories.push(child.node);
    totalDirectories += child.directories;
    totalLeafDirectories += child.leafDirectories;
    totalFiles += child.files;
  }

  return {
    node,
    directories: totalDirectories,
    leafDirectories: totalLeafDirectories,
    files: totalFiles,
  };
}

async function run(): Promise<void> {
  const inputAbsolutePath = path.resolve(projectRoot, inputDirArg);
  const outputAbsolutePath = path.resolve(projectRoot, outputFileArg);

  const inputStats = await fs.stat(inputAbsolutePath).catch(() => null);

  if (!inputStats || !inputStats.isDirectory()) {
    throw new Error(`No existe la carpeta de entrada: ${inputAbsolutePath}`);
  }

  const mapped = await mapDirectory(inputAbsolutePath, projectRoot);

  const result: MapResult = {
    root: mapped.node,
    totals: {
      directories: mapped.directories,
      leafDirectories: mapped.leafDirectories,
      files: mapped.files,
    },
  };

  await fs.mkdir(path.dirname(outputAbsolutePath), { recursive: true });
  await fs.writeFile(outputAbsolutePath, JSON.stringify(result, null, 2), "utf-8");

  // Mensajes cortos para uso en terminal/CI.
  console.log(`Esquema generado en: ${toPosixPath(path.relative(projectRoot, outputAbsolutePath))}`);
  console.log(
    `Totales -> carpetas: ${result.totals.directories}, hojas: ${result.totals.leafDirectories}, archivos: ${result.totals.files}`
  );
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error no controlado";
  console.error(`No se pudo generar el esquema: ${message}`);
  process.exitCode = 1;
});
