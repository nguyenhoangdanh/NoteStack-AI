import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save, Loader2, Palette, Hash } from "lucide-react";
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { toast } from "react-hot-toast";
import type { Category } from "@/types";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  description: z.string().max(200, "Description too long"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
  keywords: z.string(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

const colorOptions = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EF4444", label: "Red" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#84CC16", label: "Lime" },
  { value: "#F97316", label: "Orange" },
];

const iconOptions = [
  { value: "📁", label: "Folder" },
  { value: "📝", label: "Document" },
  { value: "💼", label: "Briefcase" },
  { value: "🔬", label: "Science" },
  { value: "💡", label: "Idea" },
  { value: "🎯", label: "Target" },
  { value: "🏠", label: "Home" },
  { value: "📚", label: "Books" },
];

interface CategoryEditorProps {
  category?: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryEditor({
  category,
  isOpen,
  onClose,
}: CategoryEditorProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const isEditing = !!category;
  const isLoading = createCategory.isPending || updateCategory.isPending;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      icon: "📁",
      keywords: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset({
          name: category.name,
          description: category.description || "",
          color: category.color || "#3B82F6",
          icon: category.icon || "📁",
          keywords: category.keywords.join(", "),
        });
      } else {
        form.reset({
          name: "",
          description: "",
          color: "#3B82F6",
          icon: "📁",
          keywords: "",
        });
      }
    }
  }, [category, isOpen, form]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const keywords = data.keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0);

      if (isEditing && category) {
        await updateCategory.mutateAsync({
          id: category.id,
          name: data.name,
          description: data.description,
          color: data.color,
          icon: data.icon,
          keywords,
        });
        toast.success("Category updated successfully");
      } else {
        await createCategory.mutateAsync({
          name: data.name,
          description: data.description,
          color: data.color,
          icon: data.icon,
          keywords,
        });
        toast.success("Category created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update category" : "Failed to create category",
      );
    }
  };

  const parseKeywords = (keywordsString: string) => {
    return keywordsString
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);
  };

  const currentKeywords = parseKeywords(form.watch("keywords") || "");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? "Edit Category" : "Create New Category"}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name..." {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this category..."
                      className="min-h-[80px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: field.value }}
                              />
                              <span>
                                {
                                  colorOptions.find(
                                    (c) => c.value === field.value,
                                  )?.label
                                }
                              </span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: color.value }}
                              />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Icon */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon">
                            <div className="flex items-center gap-2">
                              <span>{field.value}</span>
                              <span>
                                {
                                  iconOptions.find(
                                    (i) => i.value === field.value,
                                  )?.label
                                }
                              </span>
                            </div>
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <span>{icon.value}</span>
                              {icon.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Keywords */}
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter keywords separated by commas..."
                      {...field}
                    />
                  </FormControl>
                  {currentKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {currentKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          <Hash className="h-3 w-3 mr-1" />
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-gradient"
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
