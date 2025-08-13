export interface ImportedFile {
  title: string;
  content: string;
  tags: string[];
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType = "text/markdown",
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file as text"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function parseMarkdownFile(
  content: string,
  filename: string,
): ImportedFile {
  // Extract title from first H1 or use filename
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch
    ? titleMatch[1].trim()
    : filename.replace(/\.[^/.]+$/, "");

  // Extract tags from front matter or inline tags
  const tags: string[] = [];

  // Check for front matter tags
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontMatterMatch) {
    const frontMatter = frontMatterMatch[1];
    const tagsMatch = frontMatter.match(/tags:\s*\[([^\]]+)\]/);
    if (tagsMatch) {
      const tagString = tagsMatch[1];
      tags.push(
        ...tagString.split(",").map((tag) => tag.trim().replace(/['"]/g, "")),
      );
    }
    // Remove front matter from content
    content = content.replace(/^---\n[\s\S]*?\n---\n/, "");
  }

  // Look for inline tags (e.g., #tag)
  const inlineTags: string[] = content.match(/#[\w-]+/g) || [];
  inlineTags.forEach((tag) => {
    const cleanTag = tag.substring(1); // Remove #
    if (!tags.includes(cleanTag)) {
      tags.push(cleanTag);
    }
  });

  return {
    title,
    content: content.trim(),
    tags,
  };
}

export function convertNoteToMarkdown(note: {
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}): string {
  let markdown = "";

  // Add front matter with metadata
  markdown += "---\n";
  markdown += `title: "${note.title}"\n`;
  if (note.tags.length > 0) {
    markdown += `tags: [${note.tags.map((tag) => `"${tag}"`).join(", ")}]\n`;
  }
  markdown += `created: ${new Date(note.createdAt).toISOString()}\n`;
  markdown += `updated: ${new Date(note.updatedAt).toISOString()}\n`;
  markdown += "---\n\n";

  // Add title as H1 if not already present
  if (!note.content.startsWith("#")) {
    markdown += `# ${note.title}\n\n`;
  }

  // Add content (convert HTML to markdown if needed)
  let content = note.content;

  // Basic HTML to Markdown conversion
  content = content
    .replace(/<h([1-6])>/g, (_, level) => "#".repeat(parseInt(level)) + " ")
    .replace(/<\/h[1-6]>/g, "\n\n")
    .replace(/<strong>/g, "**")
    .replace(/<\/strong>/g, "**")
    .replace(/<em>/g, "*")
    .replace(/<\/em>/g, "*")
    .replace(/<code>/g, "`")
    .replace(/<\/code>/g, "`")
    .replace(/<blockquote>/g, "> ")
    .replace(/<\/blockquote>/g, "\n\n")
    .replace(/<ul>/g, "")
    .replace(/<\/ul>/g, "\n")
    .replace(/<ol>/g, "")
    .replace(/<\/ol>/g, "\n")
    .replace(/<li>/g, "- ")
    .replace(/<\/li>/g, "\n")
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  markdown += content;

  return markdown;
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_\-\.]/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export async function importMultipleFiles(
  files: FileList,
): Promise<ImportedFile[]> {
  const importedFiles: ImportedFile[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Only process text files
    if (
      file.type.startsWith("text/") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".txt")
    ) {
      try {
        const content = await readFileAsText(file);
        const imported = parseMarkdownFile(content, file.name);
        importedFiles.push(imported);
      } catch (error) {
        console.error(`Failed to import ${file.name}:`, error);
      }
    }
  }

  return importedFiles;
}

export function exportAllNotes(
  notes: Array<{
    title: string;
    content: string;
    tags: string[];
    createdAt: number;
    updatedAt: number;
  }>,
) {
  const timestamp = new Date().toISOString().split("T")[0];

  // Create a zip-like structure by combining all notes
  let combinedMarkdown = `# AI Notes Export - ${timestamp}\n\n`;
  combinedMarkdown += `Exported ${notes.length} notes on ${new Date().toLocaleDateString()}\n\n`;
  combinedMarkdown += "---\n\n";

  notes.forEach((note, index) => {
    combinedMarkdown += convertNoteToMarkdown(note);
    if (index < notes.length - 1) {
      combinedMarkdown += "\n\n---\n\n";
    }
  });

  downloadFile(
    combinedMarkdown,
    `ai-notes-export-${timestamp}.md`,
    "text/markdown",
  );
}

export function exportSingleNote(note: {
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}) {
  const markdown = convertNoteToMarkdown(note);
  const filename = sanitizeFilename(note.title) + ".md";
  downloadFile(markdown, filename, "text/markdown");
}
