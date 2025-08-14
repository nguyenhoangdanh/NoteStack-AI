import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Lightbulb,
  Wand2,
  FileText,
  RotateCcw,
  PlusCircle,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useApplySuggestion, useGenerateSuggestion } from "@/hooks";

interface AISuggestionPanelProps {
  noteId: string;
  content: string;
  selectedText?: string;
  onApplySuggestion: (newContent: string, type: 'replace' | 'append' | 'insert') => void;
  onClose: () => void;
}

export default function AISuggestionPanel({
  noteId,
  content,
  selectedText,
  onApplySuggestion,
  onClose,
}: AISuggestionPanelProps) {
  const [activeSuggestion, setActiveSuggestion] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>('improve');
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestion = useGenerateSuggestion();
  const applySuggestion = useApplySuggestion();

  const suggestionTypes = [
    { id: 'improve', label: '✨ Cải thiện văn phong', icon: Wand2 },
    { id: 'expand', label: '📝 Mở rộng nội dung', icon: PlusCircle },
    { id: 'summarize', label: '📋 Tóm tắt', icon: FileText },
    { id: 'grammar', label: '✅ Sửa lỗi', icon: CheckCircle },
    { id: 'restructure', label: '🔄 Sắp xếp lại', icon: RotateCcw },
    { id: 'translate', label: '🌐 Dịch sang EN', icon: Lightbulb },
  ];

  const handleSuggestion = async (type: string) => {
    if (!selectedText && !content) return;

    setIsLoading(true);
    setSelectedType(type);
    try {
      const response = await generateSuggestion.mutateAsync({
        content,
        selectedText,
        suggestionType: type as 'improve' | 'expand' | 'summarize' | 'restructure' | 'examples' | 'grammar' | 'translate',
      });
      
      // Set the active suggestion with the response
      setActiveSuggestion(response);
    } catch (error) {
      console.error('Error generating suggestion:', error);
      setActiveSuggestion(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (applyType: 'replace' | 'append' | 'insert') => {
    if (!activeSuggestion) return;

    try {
      const result = await applySuggestion.mutateAsync({
        noteId,
        originalContent: content,
        suggestion: activeSuggestion.suggestion,
        selectedText: activeSuggestion.originalText,
        applyType,
      });

      onApplySuggestion(result.newContent, applyType);
      onClose();
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <CardTitle>💡 AI Suggestions</CardTitle>
          {selectedText && (
            <Badge variant="outline" className="text-xs">
              Selected Text
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Suggestion Types */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {suggestionTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleSuggestion(type.id)}
                disabled={isLoading}
                className="flex items-center gap-2 h-auto p-3"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{type.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Đang tạo gợi ý AI...</span>
          </div>
        )}

        {/* Suggestion Result */}
        {activeSuggestion && !isLoading && (
          <div className="space-y-4">
            {/* Show warning if AI didn't understand */}
            {activeSuggestion.suggestion.includes('Tôi không tìm thấy thông tin') && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>⚠️ AI Hiểu Nhầm:</strong> AI đang xử lý như câu hỏi chat thay vì yêu cầu chỉnh sửa.
                  Hãy thử lại hoặc chọn loại gợi ý khác.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestion(selectedType)}
                  className="mt-2"
                >
                  Thử lại
                </Button>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Original Content */}
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  📄 Nội dung gốc
                  <Badge variant="secondary" className="text-xs">
                    {selectedText ? `${selectedText.length} ký tự được chọn` : 'Toàn bộ ghi chú'}
                  </Badge>
                </h3>
                <Card className="max-h-64 overflow-y-auto">
                  <CardContent className="p-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{activeSuggestion.originalText}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Suggestion */}
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  ✨ Kết quả AI
                  <Badge variant="default" className="text-xs">
                    {suggestionTypes.find(t => t.id === selectedType)?.label}
                  </Badge>
                </h3>
                <Card className="max-h-64 overflow-y-auto border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{activeSuggestion.suggestion}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                {/* Character count comparison */}
                <div className="mt-2 text-xs text-muted-foreground">
                  Gốc: {activeSuggestion.originalText.length} ký tự →
                  Mới: {activeSuggestion.suggestion.length} ký tự
                  {activeSuggestion.suggestion.length > activeSuggestion.originalText.length && (
                    <span className="text-green-600"> (+{activeSuggestion.suggestion.length - activeSuggestion.originalText.length})</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - only show if not an error response */}
            {!activeSuggestion.suggestion.includes('Tôi không tìm thấy thông tin') && (
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  onClick={() => handleApply('replace')}
                  disabled={applySuggestion.isPending}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  {selectedText ? 'Thay thế đoạn đã chọn' : 'Thay thế toàn bộ'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleApply('append')}
                  disabled={applySuggestion.isPending}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Thêm vào cuối
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleApply('insert')}
                  disabled={applySuggestion.isPending}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Chèn vào giữa
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {generateSuggestion.isError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>❌ Lỗi:</strong> Không thể tạo gợi ý AI. Vui lòng thử lại sau.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
