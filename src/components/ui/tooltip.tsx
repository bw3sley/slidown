import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const tooltipContentVariants = tv({
	slots: {
		content: [
			"z-50 max-w-xs rounded-md border border-border shadow-xl outline-none",
			"data-[state=delayed-open]:animate-pop-in data-[state=instant-open]:animate-pop-in",
		],
		arrow: "fill-popover",
	},
	variants: {
		variant: {
			default: {
				content: "bg-popover text-popover-foreground",
				arrow: "fill-popover",
			},
			inverse: {
				content: "border-foreground bg-foreground text-background",
				arrow: "fill-foreground",
			},
			accent: {
				content: "bg-accent text-accent-foreground",
				arrow: "fill-accent",
			},
		},
		size: {
			sm: { content: "px-2 py-1 text-xs" },
			md: { content: "px-2.5 py-1.5 text-xs" },
			lg: { content: "px-3 py-2 text-sm" },
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type TooltipContentProps = ComponentPropsWithRef<
	typeof TooltipPrimitive.Content
> &
	VariantProps<typeof tooltipContentVariants>;

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

function TooltipContent({
	className,
	children,
	sideOffset = 6,
	variant,
	size,
	ref,
	...props
}: TooltipContentProps) {
	const { content, arrow } = tooltipContentVariants({ variant, size });

	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				ref={ref}
				sideOffset={sideOffset}
				className={cn(content(), className)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className={arrow()} height={5} width={10} />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	tooltipContentVariants,
	type TooltipContentProps,
};
