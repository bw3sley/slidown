import type { Ref, TextareaHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const textareaVariants = tv({
	base: "flex min-h-24 w-full rounded-lg border border-input bg-background text-sm text-foreground shadow-xs transition-[color,box-shadow,border-color] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
	variants: {
		variant: {
			default: "",
			outline: "bg-transparent",
		},
		size: {
			sm: "px-3 py-2 text-xs",
			md: "px-3 py-2",
			lg: "px-4 py-3 text-base",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type TextareaVariants = VariantProps<typeof textareaVariants>;

interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement>, TextareaVariants {
	ref?: Ref<HTMLTextAreaElement>;
}

function Textarea({ className, variant, size, ref, ...props }: TextareaProps) {
	return (
		<textarea
			ref={ref}
			className={cn(textareaVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export {
	Textarea,
	textareaVariants,
	type TextareaProps,
	type TextareaVariants,
};
