import { promises as fs } from "fs";
import path from "path";
import { prisma } from "../src/config/database/db";

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

type ManualSchema = {
  root: DirectoryNode;
};

const args = process.argv.slice(2);
const inputFileArg = args[0] ?? "seeders/manuales-schema.json";
const baseUrlArg = args[1] ?? process.env.MANUALES_BASE_URL ?? "";

const TERM_DIRECTORY_REGEX = /^A(\d{2})\.([^.]+)\.trimestre(\d{2})$/i;

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildFileUrl(baseUrl: string, relativePath: string): string {
  const encodedPath = relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  if (!baseUrl) {
    return encodedPath;
  }

  return `${baseUrl.replace(/\/+$/, "")}/${encodedPath}`;
}

function hashString(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function parseGroup(directoryName: string): { code: number; name: string; isExplorer: boolean } {
  const match = /^(\d{2})\.(.+)$/.exec(directoryName);
  if (!match) {
    throw new Error(`Invalid group name: ${directoryName}`);
  }

  const code = Number(match[1]);
  const name = match[2].trim();
  const isExplorer = normalizeText(name) === "exploradores";
  return { code, name, isExplorer };
}

function collectDirectoriesByPattern(node: DirectoryNode, regex: RegExp): DirectoryNode[] {
  const matches: DirectoryNode[] = [];
  const stack: DirectoryNode[] = [...node.directories];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    if (regex.test(current.name)) {
      matches.push(current);
    }

    for (const child of current.directories) {
      stack.push(child);
    }
  }

  return matches;
}

function collectFilesRecursively(node: DirectoryNode): FileNode[] {
  const files: FileNode[] = [...node.files];
  const stack: DirectoryNode[] = [...node.directories];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    files.push(...current.files);
    for (const child of current.directories) {
      stack.push(child);
    }
  }

  return files.filter((file) => path.extname(file.name).toLowerCase() === ".pdf");
}

function extractRegularLessonNumber(fileName: string): number | null {
  const sessionMatch = /S\s*(\d+)/i.exec(fileName);
  return sessionMatch ? Number(sessionMatch[1]) : null;
}

function extractExplorerLessonNumber(fileName: string): number | null {
  const patterns = [
    /(?:LECCI[ÓO]N|ART[IÍ]CULO)\s*-?\s*(\d+)/i,
    /^(\d{1,3})\b/,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(fileName);
    if (match) {
      return Number(match[1]);
    }
  }
  return null;
}

function assignLessonNumbers(
  files: FileNode[],
  extractor: (fileName: string) => number | null
): Array<{ file: FileNode; lessonNumber: number }> {
  const used = new Set<number>();
  const ordered = [...files].sort((a, b) =>
    a.name.localeCompare(b.name, "es", { numeric: true, sensitivity: "base" })
  );

  return ordered.map((file, index) => {
    const extracted = extractor(file.name);
    let lessonNumber = extracted ?? index + 1;

    while (lessonNumber <= 0 || used.has(lessonNumber)) {
      lessonNumber += 1;
    }
    used.add(lessonNumber);

    return { file, lessonNumber };
  });
}

async function processRegularGroup(groupNode: DirectoryNode, groupId: bigint, groupCode: number, now: Date): Promise<void> {
  const termDirectories = collectDirectoriesByPattern(groupNode, TERM_DIRECTORY_REGEX);

  for (const termDirectory of termDirectories) {
    const match = TERM_DIRECTORY_REGEX.exec(termDirectory.name);
    if (!match) {
      continue;
    }

    const stage = Number(match[1]);
    const pathCode = `A${match[1]}`;
    const pathName = match[2].trim();
    const term = Number(match[3]);
    const year = stage;

    if (year < 1 || year > 3) {
      throw new Error(`Invalid year (${year}) parsed from ${termDirectory.name}`);
    }
    if (term < 1 || term > 4) {
      throw new Error(`Invalid term (${term}) parsed from ${termDirectory.name}`);
    }

    const pathRecord = await prisma.paths.upsert({
      where: { code: pathCode },
      update: {
        name: pathName.slice(0, 255),
        updated_at: now,
        deleted_at: null,
      },
      create: {
        code: pathCode,
        name: pathName.slice(0, 255),
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    });

    const lessons = assignLessonNumbers(collectFilesRecursively(termDirectory), extractRegularLessonNumber);
    for (const lessonData of lessons) {
      const lessonCode = `G${String(groupCode).padStart(2, "0")}-${pathCode}-T${String(term).padStart(2, "0")}-L${String(
        lessonData.lessonNumber
      ).padStart(2, "0")}`;
      const lessonName = path.parse(lessonData.file.name).name.slice(0, 255);

      await prisma.lessons.upsert({
        where: { code: lessonCode },
        update: {
          name: lessonName,
          year,
          term,
          path_id: pathRecord.id,
          group_id: groupId,
          file_url: buildFileUrl(baseUrlArg, toPosix(lessonData.file.relativePath)),
          source_file_name: lessonData.file.name,
          source_relative_path: lessonData.file.relativePath,
          updated_at: now,
          deleted_at: null,
        },
        create: {
          code: lessonCode,
          name: lessonName,
          year,
          term,
          path_id: pathRecord.id,
          group_id: groupId,
          file_url: buildFileUrl(baseUrlArg, toPosix(lessonData.file.relativePath)),
          source_file_name: lessonData.file.name,
          source_relative_path: lessonData.file.relativePath,
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      });
    }
  }
}

async function processExplorerGroup(groupNode: DirectoryNode, groupId: bigint, groupCode: number, now: Date): Promise<void> {
  const lessons = assignLessonNumbers(collectFilesRecursively(groupNode), extractExplorerLessonNumber);

  for (const lessonData of lessons) {
    const sourcePath = toPosix(lessonData.file.relativePath);
    const lessonCode = `G${String(groupCode).padStart(2, "0")}-EXP-${hashString(sourcePath)}`;
    const lessonName = path.parse(lessonData.file.name).name.slice(0, 255);

    await prisma.lessons.upsert({
      where: { code: lessonCode },
      update: {
        name: lessonName,
        year: null,
        term: null,
        path_id: null,
        group_id: groupId,
        file_url: buildFileUrl(baseUrlArg, sourcePath),
        source_file_name: lessonData.file.name,
        source_relative_path: sourcePath,
        updated_at: now,
        deleted_at: null,
      },
      create: {
        code: lessonCode,
        name: lessonName,
        year: null,
        term: null,
        path_id: null,
        group_id: groupId,
        file_url: buildFileUrl(baseUrlArg, sourcePath),
        source_file_name: lessonData.file.name,
        source_relative_path: sourcePath,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    });
  }
}

async function main(): Promise<void> {
  const now = new Date();
  const schemaAbsolutePath = path.resolve(process.cwd(), inputFileArg);
  const schemaContent = await fs.readFile(schemaAbsolutePath, "utf-8");
  const schema = JSON.parse(schemaContent) as ManualSchema;

  if (!schema.root.directories.length) {
    throw new Error("No group directories found in manuals schema.");
  }

  for (const groupNode of schema.root.directories) {
    const parsedGroup = parseGroup(groupNode.name);

    const groupRecord = await prisma.groups.upsert({
      where: { code: parsedGroup.code },
      update: {
        name: parsedGroup.name,
        is_explorer: parsedGroup.isExplorer,
        updated_at: now,
        deleted_at: null,
      },
      create: {
        code: parsedGroup.code,
        name: parsedGroup.name,
        is_explorer: parsedGroup.isExplorer,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    });

    if (parsedGroup.isExplorer) {
      await processExplorerGroup(groupNode, groupRecord.id, parsedGroup.code, now);
      continue;
    }

    await processRegularGroup(groupNode, groupRecord.id, parsedGroup.code, now);
  }

  console.log("Manuals import completed.");
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unhandled error";
    console.error(`Failed to import manuals: ${message}`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
