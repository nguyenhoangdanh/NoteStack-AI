import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Save, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/hooks/useWorkspaces";
import { toast } from "react-hot-toast";
import type { Workspace } from "@/types";

const workspaceFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
});

type WorkspaceFormData = z.infer<typeof workspaceFormSchema>;

interface WorkspaceEditorProps {
  workspace?: Workspace | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceEditor({
  workspace,
  isOpen,
  onClose,
}: WorkspaceEditorProps) {
  const createWorkspace = useCreateWorkspace();
  
  const isEditing = !!workspace;
  const isLoading = createWorkspace.isPending;

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (workspace) {
        form.reset({
          name: workspace.name,
        });
      } else {
        form.reset({
          name: "",
        });
      }
    }
  }, [workspace, isOpen, form]);

  const onSubmit = async (data: WorkspaceFormData) => {
    try {
      if (isEditing) {
        // Note: Update functionality would need to be implemented in hooks
        toast.error("Update functionality not yet implemented");
        return;
      } else {
        await createWorkspace.mutateAsync({
          name: data.name,
        });
        toast.success("Workspace created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update workspace" : "Failed to create workspace",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEditing ? "Edit Workspace" : "Create New Workspace"}
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter workspace name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isEditing ? "Update Workspace" : "Create Workspace"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
