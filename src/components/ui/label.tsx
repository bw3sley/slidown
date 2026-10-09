import { Label as LabelPrimitive } from "radix-ui";
import type { ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const labelVariants = tv({
	base: "inline-flex items-center gap-1 leading-none font-medium text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
	variants: {
		variant: {
			default: "text-foreground",
			muted: "text-muted-foreground",
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

type LabelVariants = VariantProps<typeof labelVariants>;

interface LabelProps
	extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, LabelVariants {}

function Label({ className, variant, size, ...props }: LabelProps) {
	return (
		<LabelPrimitive.Root
			className={cn(labelVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Label, labelVariants, type LabelProps, type LabelVariants };
