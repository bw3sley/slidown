import type { HTMLAttributes, Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const cardVariants = tv({
	base: "flex flex-col rounded-lg text-card-foreground",
	variants: {
		variant: {
			default: "border border-border bg-card shadow-sm",
			outline: "border border-border bg-transparent",
			muted: "border border-transparent bg-muted",
			accent: "border border-border bg-accent text-accent-foreground",
			interactive:
				"cursor-pointer border border-border bg-card shadow-sm transition-colors hover:border-primary/60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		},
		size: {
			sm: "gap-2 p-3",
			md: "gap-3 p-4",
			lg: "gap-4 p-6",
		},
		interactive: {
			true: "cursor-pointer transition-colors hover:border-primary/60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			false: "",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
		interactive: false,
	},
});

type CardVariants = VariantProps<typeof cardVariants>;

interface CardRootProps extends HTMLAttributes<HTMLDivElement>, CardVariants {
	ref?: Ref<HTMLDivElement>;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	ref?: Ref<HTMLDivElement>;
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
	ref?: Ref<HTMLHeadingElement>;
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
	ref?: Ref<HTMLParagraphElement>;
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
	ref?: Ref<HTMLDivElement>;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	ref?: Ref<HTMLDivElement>;
}

function CardRoot({
	className,
	variant,
	size,
	interactive,
	ref,
	...props
}: CardRootProps) {
	return (
		<div
			ref={ref}
			className={cn(cardVariants({ variant, size, interactive }), className)}
			{...props}
		/>
	);
}

function CardHeader({ className, ref, ...props }: CardHeaderProps) {
	return (
		<div
			ref={ref}
			className={cn("flex flex-col gap-1", className)}
			{...props}
		/>
	);
}

function CardTitle({ className, ref, ...props }: CardTitleProps) {
	return (
		<h3
			ref={ref}
			className={cn(
				"text-base font-semibold leading-none tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ref, ...props }: CardDescriptionProps) {
	return (
		<p
			ref={ref}
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function CardContent({ className, ref, ...props }: CardContentProps) {
	return (
		<div ref={ref} className={cn("flex-1 text-sm", className)} {...props} />
	);
}

function CardFooter({ className, ref, ...props }: CardFooterProps) {
	return (
		<div
			ref={ref}
			className={cn("flex items-center gap-2", className)}
			{...props}
		/>
	);
}

export {
	CardRoot,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	cardVariants,
	type CardRootProps,
	type CardHeaderProps,
	type CardTitleProps,
	type CardDescriptionProps,
	type CardContentProps,
	type CardFooterProps,
	type CardVariants,
};
