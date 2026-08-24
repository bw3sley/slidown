import { Slot } from "radix-ui";
import {
	createContext,
	useContext,
	useId,
	type ComponentPropsWithRef,
	type HTMLAttributes,
} from "react";
import {
	Controller,
	FormProvider,
	useFormContext,
	useFormState,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";
import { tv, type VariantProps } from "tailwind-variants";

import { Label, type LabelProps } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const formItemVariants = tv({
	base: "flex flex-col gap-1.5",
	variants: {
		variant: {
			default: "flex-col",
			inline: "flex-row flex-wrap items-center",
			ghost: "flex-col",
		},
		size: {
			sm: "gap-1",
			md: "gap-1.5",
			lg: "gap-2",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const formDescriptionVariants = tv({
	base: "text-muted-foreground leading-snug",
	variants: {
		variant: {
			default: "text-muted-foreground",
			muted: "text-muted-foreground/80",
			destructive: "text-destructive",
		},
		size: {
			sm: "text-xs",
			md: "text-sm",
			lg: "text-base",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const formMessageVariants = tv({
	base: "font-medium leading-snug",
	variants: {
		variant: {
			default: "text-destructive",
			muted: "text-muted-foreground",
			success: "text-success",
		},
		size: {
			sm: "text-xs",
			md: "text-sm",
			lg: "text-base",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type FormItemVariants = VariantProps<typeof formItemVariants>;
type FormDescriptionVariants = VariantProps<typeof formDescriptionVariants>;
type FormMessageVariants = VariantProps<typeof formMessageVariants>;

type FormFieldContextValue = {
	name: string;
};

type FormItemContextValue = {
	id: string;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);
const FormItemContext = createContext<FormItemContextValue | null>(null);

type FormItemProps = HTMLAttributes<HTMLDivElement> & FormItemVariants;

type FormLabelProps = LabelProps;

type FormControlProps = ComponentPropsWithRef<typeof Slot.Root>;

type FormDescriptionProps = HTMLAttributes<HTMLParagraphElement> &
	FormDescriptionVariants;

type FormMessageProps = HTMLAttributes<HTMLParagraphElement> &
	FormMessageVariants;

const Form = FormProvider;

function FormField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues = TFieldValues,
>(props: ControllerProps<TFieldValues, TName, TTransformedValues>) {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
}

function useFormField() {
	const fieldContext = useContext(FormFieldContext);
	const itemContext = useContext(FormItemContext);
	const formContext = useFormContext();
	const formState = useFormState({ name: fieldContext?.name });

	if (!fieldContext || !formContext) {
		throw new Error(
			"useFormField must be used inside a <FormField> rendered within a <Form>.",
		);
	}

	if (!itemContext) {
		throw new Error("useFormField must be used inside a <FormItem>.");
	}

	const { id } = itemContext;
	const fieldState = formContext.getFieldState(fieldContext.name, formState);

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
}

function FormItem({ className, variant, size, ...props }: FormItemProps) {
	const id = useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				className={cn(formItemVariants({ variant, size }), className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
}

function FormLabel({ className, ...props }: FormLabelProps) {
	const { error, formItemId } = useFormField();

	return (
		<Label
			htmlFor={formItemId}
			className={cn(error && "text-destructive", className)}
			{...props}
		/>
	);
}

function FormControl({ ref, ...props }: FormControlProps) {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField();

	return (
		<Slot.Root
			ref={ref}
			id={formItemId}
			aria-describedby={
				error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
}

function FormDescription({
	className,
	variant,
	size,
	...props
}: FormDescriptionProps) {
	const { formDescriptionId } = useFormField();

	return (
		<p
			id={formDescriptionId}
			className={cn(formDescriptionVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function FormMessage({
	className,
	children,
	variant,
	size,
	...props
}: FormMessageProps) {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error.message ?? "") : children;

	if (!body) {
		return null;
	}

	return (
		<p
			id={formMessageId}
			className={cn(formMessageVariants({ variant, size }), className)}
			{...props}
		>
			{body}
		</p>
	);
}

export {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	useFormField,
	formItemVariants,
	formDescriptionVariants,
	formMessageVariants,
	type FormItemProps,
	type FormLabelProps,
	type FormControlProps,
	type FormDescriptionProps,
	type FormMessageProps,
	type FormItemVariants,
	type FormDescriptionVariants,
	type FormMessageVariants,
};
