import type { HTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const badgeVariants = tv({
	base: "inline-flex items-center rounded-md border font-medium whitespace-nowrap transition-colors",
	variants: {
		variant: {
			default: "border-transparent bg-primary text-primary-foreground",
			secondary: "border-transparent bg-secondary text-secondary-foreground",
			outline: "border-border bg-background text-foreground",
			destructive: "border-transparent bg-destructive/15 text-destructive",
			success: "border-transparent bg-success/15 text-success",
			muted: "border-transparent bg-muted text-muted-foreground",
		},
		size: {
			sm: "px-1.5 py-0.5 text-xxs",
			md: "px-2 py-0.5 text-xs",
			lg: "px-2.5 py-1 text-sm",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type BadgeVariants = VariantProps<typeof badgeVariants>;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, BadgeVariants {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
	return (
		<span
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants, type BadgeProps, type BadgeVariants };
