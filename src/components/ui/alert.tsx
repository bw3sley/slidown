import type { HTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const alertVariants = tv({
	base: "relative grid w-full grid-cols-[0_1fr] items-start rounded-lg border text-sm has-[>svg]:grid-cols-[auto_1fr] [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:text-current",
	variants: {
		variant: {
			default: "border-border bg-card text-card-foreground",
			destructive: "border-destructive/30 bg-destructive/10 text-destructive",
			success: "border-success/30 bg-success/10 text-success",
			accent: "border-border bg-accent text-accent-foreground",
			muted: "border-transparent bg-muted text-muted-foreground",
		},
		size: {
			sm: "gap-y-0.5 p-2.5 text-xs has-[>svg]:gap-x-2 [&>svg]:size-3.5 [&>svg]:translate-y-px",
			md: "gap-y-1 px-3.5 py-3 has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5",
			lg: "gap-y-1.5 p-5 text-base has-[>svg]:gap-x-3.5 [&>svg]:size-5 [&>svg]:translate-y-0.5",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type AlertVariants = VariantProps<typeof alertVariants>;

interface AlertProps extends HTMLAttributes<HTMLDivElement>, AlertVariants {
	ref?: Ref<HTMLDivElement>;
}

interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	ref?: Ref<HTMLHeadingElement>;
}

interface AlertDescriptionProps extends HTMLAttributes<HTMLDivElement> {
	ref?: Ref<HTMLDivElement>;
}

function Alert({ className, variant, size, ref, ...props }: AlertProps) {
	return (
		<div
			ref={ref}
			role="alert"
			className={cn(alertVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ref, ...props }: AlertTitleProps) {
	return (
		<h5
			ref={ref}
			className={cn(
				"col-start-2 font-medium leading-none tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDescription({ className, ref, ...props }: AlertDescriptionProps) {
	return (
		<div
			ref={ref}
			className={cn("col-start-2 leading-relaxed", className)}
			{...props}
		/>
	);
}

export {
	Alert,
	AlertTitle,
	AlertDescription,
	alertVariants,
	type AlertProps,
	type AlertTitleProps,
	type AlertDescriptionProps,
	type AlertVariants,
};
