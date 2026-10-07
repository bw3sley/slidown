import type { HTMLAttributes, InputHTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const inputControlVariants = tv({
	base: "flex w-full rounded-lg border border-input bg-background text-sm text-foreground shadow-xs transition-[color,box-shadow,border-color] outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
	variants: {
		variant: {
			default: "",
			outline: "bg-transparent",
		},
		size: {
			sm: "h-8 px-3 text-xs",
			md: "h-9 px-3 py-2",
			lg: "h-10 px-4 text-base",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type InputControlVariants = VariantProps<typeof inputControlVariants>;

type InputRootProps = HTMLAttributes<HTMLDivElement>;

type InputDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
type InputErrorProps = HTMLAttributes<HTMLParagraphElement>;

interface InputControlProps
	extends
		Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
		InputControlVariants {
	ref?: Ref<HTMLInputElement>;
}

function InputRoot({ className, ...props }: InputRootProps) {
	return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function InputControl({
	className,
	variant,
	size,
	ref,
	...props
}: InputControlProps) {
	return (
		<input
			ref={ref}
			className={cn(inputControlVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function InputDescription({ className, ...props }: InputDescriptionProps) {
	return (
		<p className={cn("text-sm text-muted-foreground", className)} {...props} />
	);
}

function InputError({ className, ...props }: InputErrorProps) {
	return (
		<p
			className={cn("text-sm font-medium text-destructive", className)}
			{...props}
		/>
	);
}

export {
	InputRoot,
	InputControl,
	InputDescription,
	InputError,
	inputControlVariants,
	type InputRootProps,
	type InputControlProps,
	type InputDescriptionProps,
	type InputErrorProps,
	type InputControlVariants,
};
