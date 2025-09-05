"use client"
import { z } from "zod"; 

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { insertTransactionSchema } from "@/db/schema";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { TransactionForm } from "@/features/transactions/components/transaction-form"


import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { Loader2 } from "lucide-react";
;

const formSchema = insertTransactionSchema.omit({
    id: true
});

type FormValues = z.input<typeof formSchema>;

//in order to render the sheet, we will do this using a new provider, sheet-provider.tsx in providers folder
export const NewTransactionSheet = () => {

const {isOpen, onClose} = useNewTransaction();

const createMutation = useCreateTransaction();

const categoryQuery = useGetCategories();
const categoryMutation = useCreateCategory();
const onCreateCategory = (name: string) => categoryMutation.mutate({
    name
})
const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id
}))

const accountQuery = useGetAccounts();
const accountMutation = useCreateAccount();
const onCreateAccount = (name: string) => accountMutation.mutate({
    name
})
const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id
}))

const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

const isLoading = 
    categoryQuery.isLoading ||
    accountQuery.isLoading;


const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
        onSuccess: () => {
            onClose();
        }
    }

    );
}

    return (
        <Sheet open ={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Account
                    </SheetTitle>
                    <SheetDescription>
                       Add a new transaction.
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading ? (   
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (
                        <TransactionForm 
                            onSubmit={onSubmit}
                            disabled = {isPending}
                            categoryOptions={categoryOptions}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            onCreateAccount={onCreateAccount}
                        />
                    )
                }
            </SheetContent>
        </Sheet>
    )
}