import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const scrollAreaVariants = tv({
	slots: {
		root: "relative overflow-hidden",
		viewport:
			"size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
		scrollbar:
			"flex touch-none p-px transition-colors select-none data-[orientation=horizontal]:flex-col",
		thumb:
			"relative flex-1 rounded-full bg-muted-foreground/40 transition-colors hover:bg-muted-foreground/60",
	},
	variants: {
		variant: {
			default: { scrollbar: "bg-border/40" },
			overlay: { scrollbar: "bg-transparent" },
		},
		size: {
			sm: {
				scrollbar:
					"data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5",
			},
			md: {
				scrollbar:
					"data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5",
			},
			lg: {
				scrollbar:
					"data-[orientation=horizontal]:h-3.5 data-[orientation=vertical]:w-3.5",
			},
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type ScrollAreaVariants = VariantProps<typeof scrollAreaVariants>;

type ScrollAreaProps = ComponentPropsWithRef<typeof ScrollAreaPrimitive.Root> &
	ScrollAreaVariants & {
		orientation?: "vertical" | "horizontal" | "both";
		viewportClassName?: string;
	};

type ScrollBarProps = ComponentPropsWithRef<
	typeof ScrollAreaPrimitive.Scrollbar
> &
	ScrollAreaVariants;

function ScrollArea({
	className,
	children,
	orientation = "vertical",
	variant,
	size,
	viewportClassName,
	ref,
	...props
}: ScrollAreaProps) {
	const { root, viewport } = scrollAreaVariants({ variant, size });

	return (
		<ScrollAreaPrimitive.Root
			ref={ref}
			className={cn(root(), className)}
			{...props}
		>
			<ScrollAreaPrimitive.Viewport
				className={cn(viewport(), viewportClassName)}
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			{orientation !== "horizontal" ? (
				<ScrollBar orientation="vertical" size={size} variant={variant} />
			) : null}
			{orientation !== "vertical" ? (
				<ScrollBar orientation="horizontal" size={size} variant={variant} />
			) : null}
			<ScrollAreaPrimitive.Corner className="bg-transparent" />
		</ScrollAreaPrimitive.Root>
	);
}

function ScrollBar({
	className,
	orientation = "vertical",
	variant,
	size,
	ref,
	...props
}: ScrollBarProps) {
	const { scrollbar, thumb } = scrollAreaVariants({ variant, size });

	return (
		<ScrollAreaPrimitive.Scrollbar
			ref={ref}
			orientation={orientation}
			className={cn(scrollbar(), className)}
			{...props}
		>
			<ScrollAreaPrimitive.Thumb className={thumb()} />
		</ScrollAreaPrimitive.Scrollbar>
	);
}

export {
	ScrollArea,
	ScrollBar,
	scrollAreaVariants,
	type ScrollAreaProps,
	type ScrollBarProps,
	type ScrollAreaVariants,
};
