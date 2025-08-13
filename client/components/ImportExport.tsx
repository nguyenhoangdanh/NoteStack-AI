import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Upload,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  useCreateNote,
  useNotes,
  useDefaultWorkspace,
  useProcessNoteForRAG,
} from "../lib/query";
import {
  importMultipleFiles,
  exportAllNotes,
  exportSingleNote,
  type ImportedFile,
} from "../lib/fileUtils";
import { cn } from "../lib/utils";

interface ImportExportProps {
  className?: string;
}

export default function ImportExport({ className }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: ImportedFile[];
    failed: string[];
  } | null>(null);
  const [importProgress, setImportProgress] = useState(0);

  const defaultWorkspace = useDefaultWorkspace();
  const notes = useNotes(defaultWorkspace?._id);
  const createNote = useCreateNote();
  const processNoteForRAG = useProcessNoteForRAG();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !defaultWorkspace) return;

    setImporting(true);
    setImportProgress(0);
    setImportResults(null);

    try {
      // Parse files
      const importedFiles = await importMultipleFiles(files);
      setImportProgress(25);

      const results = {
        success: [] as ImportedFile[],
        failed: [] as string[],
      };

      // Create notes
      for (let i = 0; i < importedFiles.length; i++) {
        const file = importedFiles[i];
        try {
          const noteId = await createNote.mutateAsync({
            title: file.title,
            content: file.content,
            tags: file.tags,
            workspaceId: defaultWorkspace._id,
          });

          // Process for RAG in background
          processNoteForRAG.mutate(noteId);

          results.success.push(file);
        } catch (error) {
          console.error(`Failed to create note for ${file.title}:`, error);
          results.failed.push(file.title);
        }

        setImportProgress(25 + (75 * (i + 1)) / importedFiles.length);
      }

      setImportResults(results);
    } catch (error) {
      console.error("Import failed:", error);
      setImportResults({
        success: [],
        failed: ["Import failed"],
      });
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleExportAll = () => {
    if (notes && notes.length > 0) {
      exportAllNotes(notes);
    }
  };

  const handleExportSingle = (note: any) => {
    exportSingleNote(note);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Notes
          </CardTitle>
          <CardDescription>
            Import markdown (.md) or text (.txt) files to add them to your notes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleFileSelect}
              disabled={importing}
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? "Importing..." : "Select Files"}
            </Button>
            <div className="text-sm text-muted-foreground">
              Supports .md and .txt files
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".md,.txt,text/markdown,text/plain"
            onChange={handleImport}
            className="hidden"
          />

          {importing && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Importing files...</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

          {importResults && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Import Complete</span>
              </div>

              {importResults.success.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-green-600 mb-2">
                    Successfully imported ({importResults.success.length}):
                  </div>
                  <div className="space-y-1">
                    {importResults.success.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{file.title}</span>
                        {file.tags.length > 0 && (
                          <div className="flex gap-1">
                            {file.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importResults.failed.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-red-600 mb-2">
                    Failed to import ({importResults.failed.length}):
                  </div>
                  <div className="space-y-1">
                    {importResults.failed.map((filename, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-red-600"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>{filename}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Notes
          </CardTitle>
          <CardDescription>
            Download your notes as markdown files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleExportAll}
              disabled={!notes || notes.length === 0}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Notes
            </Button>
            <div className="text-sm text-muted-foreground">
              {notes ? `${notes.length} notes available` : "No notes to export"}
            </div>
          </div>

          {notes && notes.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">
                Or export individual notes:
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {notes.slice(0, 10).map((note) => (
                  <div
                    key={note._id}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {note.title || "Untitled"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {note.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {note.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{note.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleExportSingle(note)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {notes.length > 10 && (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    And {notes.length - 10} more notes...
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
