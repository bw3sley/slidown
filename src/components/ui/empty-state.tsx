import type { HTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const emptyStateVariants = tv({
	base: "flex w-full flex-col items-center justify-center text-center",
	variants: {
		variant: {
			default: "text-foreground",
			muted: "text-muted-foreground",
			destructive: "text-destructive",
		},
		size: {
			sm: "gap-2 px-4 py-6",
			md: "gap-3 px-6 py-10",
			lg: "gap-4 px-8 py-16",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type EmptyStateVariants = VariantProps<typeof emptyStateVariants>;

interface EmptyStateProps
	extends HTMLAttributes<HTMLDivElement>,
		EmptyStateVariants {
	ref?: Ref<HTMLDivElement>;
}

interface EmptyStateIconProps extends HTMLAttributes<HTMLDivElement> {
	ref?: Ref<HTMLDivElement>;
}

interface EmptyStateTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	ref?: Ref<HTMLHeadingElement>;
}

interface EmptyStateDescriptionProps
	extends HTMLAttributes<HTMLParagraphElement> {
	ref?: Ref<HTMLParagraphElement>;
}

interface EmptyStateActionProps extends HTMLAttributes<HTMLDivElement> {
	ref?: Ref<HTMLDivElement>;
}

function EmptyState({
	className,
	variant,
	size,
	ref,
	...props
}: EmptyStateProps) {
	return (
		<div
			ref={ref}
			className={cn(emptyStateVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function EmptyStateIcon({ className, ref, ...props }: EmptyStateIconProps) {
	return (
		<div
			ref={ref}
			aria-hidden="true"
			className={cn(
				"flex size-16 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-current opacity-40 [&_svg]:pointer-events-none [&_svg]:size-7",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyStateTitle({ className, ref, ...props }: EmptyStateTitleProps) {
	return (
		<h3
			ref={ref}
			className={cn("text-base font-semibold tracking-tight", className)}
			{...props}
		/>
	);
}

function EmptyStateDescription({
	className,
	ref,
	...props
}: EmptyStateDescriptionProps) {
	return (
		<p
			ref={ref}
			className={cn(
				"max-w-sm text-sm text-muted-foreground text-balance",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyStateAction({ className, ref, ...props }: EmptyStateActionProps) {
	return (
		<div
			ref={ref}
			className={cn("mt-1 flex items-center justify-center gap-2", className)}
			{...props}
		/>
	);
}

export {
	EmptyState,
	EmptyStateIcon,
	EmptyStateTitle,
	EmptyStateDescription,
	EmptyStateAction,
	emptyStateVariants,
	type EmptyStateProps,
	type EmptyStateIconProps,
	type EmptyStateTitleProps,
	type EmptyStateDescriptionProps,
	type EmptyStateActionProps,
	type EmptyStateVariants,
};
