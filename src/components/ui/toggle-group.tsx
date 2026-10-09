import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { createContext, useContext, type ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const toggleGroupVariants = tv({
	slots: {
		root: "inline-flex items-center",
		item: [
			"inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors outline-none",
			"focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"disabled:pointer-events-none disabled:opacity-50",
			"[&_svg]:pointer-events-none [&_svg]:shrink-0",
		],
	},
	variants: {
		variant: {
			default: {
				root: "overflow-hidden rounded-lg border border-border bg-background shadow-xs",
				item: [
					"rounded-none border-r border-border text-muted-foreground last:border-r-0",
					"hover:bg-accent/50 hover:text-foreground",
					"data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
				],
			},
			pill: {
				root: "gap-2 bg-transparent",
				item: [
					"rounded-full border-[1.5px] border-border bg-transparent font-semibold text-muted-foreground",
					"hover:bg-accent/40 hover:text-foreground",
					"data-[state=on]:border-primary data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
				],
			},
			ghost: {
				root: "gap-1 bg-transparent",
				item: [
					"rounded-md border border-transparent bg-transparent text-muted-foreground",
					"hover:bg-accent/50 hover:text-foreground",
					"data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
				],
			},
		},
		size: {
			sm: { item: "h-8 px-3 text-xs" },
			md: { item: "h-9 px-4 text-sm" },
			lg: { item: "h-10 px-5 text-base" },
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type ToggleGroupVariants = VariantProps<typeof toggleGroupVariants>;

type ToggleGroupContextValue = Required<ToggleGroupVariants>;

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
	variant: "default",
	size: "md",
});

type ToggleGroupProps = ComponentPropsWithRef<
	typeof ToggleGroupPrimitive.Root
> &
	ToggleGroupVariants;

type ToggleGroupItemProps = ComponentPropsWithRef<
	typeof ToggleGroupPrimitive.Item
> &
	ToggleGroupVariants;

function ToggleGroup({
	className,
	children,
	variant = "default",
	size = "md",
	ref,
	...props
}: ToggleGroupProps) {
	const { root } = toggleGroupVariants({ variant, size });

	return (
		<ToggleGroupContext.Provider value={{ variant, size }}>
			<ToggleGroupPrimitive.Root
				ref={ref}
				className={cn(root(), className)}
				{...props}
			>
				{children}
			</ToggleGroupPrimitive.Root>
		</ToggleGroupContext.Provider>
	);
}

function ToggleGroupItem({
	className,
	children,
	variant,
	size,
	ref,
	...props
}: ToggleGroupItemProps) {
	const context = useContext(ToggleGroupContext);
	const { item } = toggleGroupVariants({
		variant: variant ?? context.variant,
		size: size ?? context.size,
	});

	return (
		<ToggleGroupPrimitive.Item
			ref={ref}
			className={cn(item(), className)}
			{...props}
		>
			{children}
		</ToggleGroupPrimitive.Item>
	);
}

export {
	ToggleGroup,
	ToggleGroupItem,
	toggleGroupVariants,
	type ToggleGroupProps,
	type ToggleGroupItemProps,
	type ToggleGroupVariants,
};
