

"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
 
} from "@/components/ui/form";
import qs from "query-string";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";


// This is the schema for the form
const formSchema = z.object({
  fileUrl: z.string().url({
    message: "Attachment is required",
  }),
});

const MessageFileModal = () => {
    
const {isOpen , onClose, type , data} = useModal();
    const router = useRouter();
    const {apiUrl, query} = data;
    const isModalOpen = isOpen && type === "messageFile";
    
  

  // This is the form value and validation from react-hook-form and zod
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  }

  // This is the loading state for the form
  const isLoading = form.formState.isSubmitting;

  // This is the submit function for the form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    try {
        const url = qs.stringifyUrl({
          url: apiUrl || "",
          query,
        })
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      }
    );

      // Reset the form after submission
      form.reset();

      // Refresh the page after submission
      router.refresh();
      handleClose();
    
    } catch (error) {
      // Handle error
      console.error("Error creating server:", error);
    }
  };


  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className="overflow-hidden bg-white p-0 text-black">
          <DialogHeader className="px-6 pt-8">
            <DialogTitle className="text-center text-2xl font-bold">
              Add an attachment
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Send a file as a message
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        
                      </FormItem>
                    )}
                  />
                </div>
                
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button disabled={isLoading}
                 variant={"primary"}
                 >
                  Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageFileModal;