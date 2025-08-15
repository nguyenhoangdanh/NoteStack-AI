import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save, Loader2, Eye, Globe, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/useTemplates";
import { toast } from "react-hot-toast";
import type { Template } from "@/types";

const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Description too long"),
  content: z.string().min(1, "Content is required"),
  tags: z.string(),
  isPublic: z.boolean(),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

interface TemplateEditorProps {
  template?: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateEditor({
  template,
  isOpen,
  onClose,
}: TemplateEditorProps) {
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const isEditing = !!template;
  const isLoading = createTemplate.isPending || updateTemplate.isPending;

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      content: "",
      tags: "",
      isPublic: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (template) {
        form.reset({
          name: template.name,
          description: template.description,
          content: template.content,
          tags: template.tags.join(", "),
          isPublic: template.isPublic,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          content: "",
          tags: "",
          isPublic: false,
        });
      }
    }
  }, [template, isOpen, form]);

  const onSubmit = async (data: TemplateFormData) => {
    try {
      const tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      if (isEditing && template) {
        await updateTemplate.mutateAsync({
          id: template.id,
          name: data.name,
          description: data.description,
          content: data.content,
          tags,
          isPublic: data.isPublic,
        });
        toast.success("Template updated successfully");
      } else {
        await createTemplate.mutateAsync({
          name: data.name,
          description: data.description,
          content: data.content,
          tags,
          isPublic: data.isPublic,
        });
        toast.success("Template created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update template" : "Failed to create template",
      );
    }
  };

  const parseTags = (tagsString: string) => {
    return tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  };

  const currentTags = parseTags(form.watch("tags") || "");
  const contentValue = form.watch("content") || "";

  // Extract variables from content (simple pattern matching for {{variable}})
  const variables = [
    ...new Set(
      contentValue
        .match(/\{\{(\w+)\}\}/g)
        ?.map((match) => match.slice(2, -2)) || [],
    ),
  ];

  const handlePreview = () => {
    // TODO: Implement preview functionality
    toast.info("Preview functionality coming soon");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? "Edit Template" : "Create New Template"}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter template name..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this template is for..."
                          className="min-h-[100px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags separated by commas..."
                          {...field}
                        />
                      </FormControl>
                      {currentTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {currentTags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Public/Private */}
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          {field.value ? (
                            <>
                              <Globe className="h-4 w-4" />
                              Public Template
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" />
                              Private Template
                            </>
                          )}
                        </FormLabel>
                        <FormDescription>
                          {field.value
                            ? "Anyone can view and use this template"
                            : "Only you can view and use this template"}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Variables Info */}
                {variables.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Detected Variables
                    </Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">
                        Variables will be replaced when template is used:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {variables.map((variable, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Content */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your template content here...

Use {{variable}} to create dynamic placeholders.
Examples:
- {{title}} - Will be replaced with a title input
- {{date}} - Will be replaced with a date picker
- {{description}} - Will be replaced with a description field"
                          className="min-h-[400px] resize-y font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use double curly braces to create variables:{" "}
                        {`{{variableName}}`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-gradient"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
