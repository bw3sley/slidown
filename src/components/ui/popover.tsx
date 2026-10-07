import { Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const popoverContentVariants = tv({
	base: [
		"z-50 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl outline-none",
		"data-[state=open]:animate-pop-in",
	],
	variants: {
		variant: {
			default: "bg-popover text-popover-foreground",
			outline: "bg-background text-foreground",
			secondary: "border-transparent bg-secondary text-secondary-foreground",
		},
		size: {
			sm: "w-56 p-3",
			md: "w-72 p-4",
			lg: "w-80 p-5",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type PopoverContentProps = ComponentPropsWithRef<
	typeof PopoverPrimitive.Content
> &
	VariantProps<typeof popoverContentVariants>;

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

function PopoverContent({
	className,
	align = "center",
	sideOffset = 8,
	variant,
	size,
	ref,
	...props
}: PopoverContentProps) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				ref={ref}
				align={align}
				sideOffset={sideOffset}
				className={cn(popoverContentVariants({ variant, size }), className)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	);
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
