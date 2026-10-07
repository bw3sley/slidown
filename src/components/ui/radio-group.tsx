import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const radioGroupVariants = tv({
	base: "grid",
	variants: {
		variant: {
			default: "grid-cols-1",
			cards: "grid-cols-2",
			inline: "flex flex-wrap items-center",
		},
		size: {
			sm: "gap-1.5",
			md: "gap-2",
			lg: "gap-3",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const radioGroupItemVariants = tv({
	slots: {
		root: [
			"shrink-0 cursor-pointer transition-colors outline-none",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"disabled:pointer-events-none disabled:opacity-50",
			"aria-invalid:border-destructive",
		],
		indicator: "block rounded-full",
	},
	variants: {
		variant: {
			default: {
				root: [
					"inline-flex aspect-square items-center justify-center rounded-full border border-input bg-background shadow-xs",
					"hover:border-primary/60",
					"data-[state=checked]:border-primary",
				],
				indicator: "bg-primary",
			},
			card: {
				root: [
					"relative flex w-full flex-col items-start gap-1 rounded-lg border border-border bg-card text-left text-foreground shadow-xs",
					"hover:border-primary/40 hover:bg-accent/40",
					"data-[state=checked]:border-2 data-[state=checked]:border-primary data-[state=checked]:ring-[3px] data-[state=checked]:ring-accent",
				],
				indicator: "hidden",
			},
			swatch: {
				root: [
					"inline-flex items-center justify-center rounded-full border border-border",
					"hover:border-foreground/40",
					"data-[state=checked]:border-[2.5px] data-[state=checked]:border-foreground",
				],
				indicator: "hidden",
			},
		},
		size: {
			sm: {},
			md: {},
			lg: {},
		},
	},
	compoundVariants: [
		{
			variant: "default",
			size: "sm",
			class: { root: "size-3.5", indicator: "size-1.5" },
		},
		{
			variant: "default",
			size: "md",
			class: { root: "size-4", indicator: "size-2" },
		},
		{
			variant: "default",
			size: "lg",
			class: { root: "size-5", indicator: "size-2.5" },
		},
		{ variant: "card", size: "sm", class: { root: "p-2 text-xs" } },
		{ variant: "card", size: "md", class: { root: "p-3 text-sm" } },
		{ variant: "card", size: "lg", class: { root: "p-4 text-base" } },
		{ variant: "swatch", size: "sm", class: { root: "size-[18px]" } },
		{ variant: "swatch", size: "md", class: { root: "size-[22px]" } },
		{ variant: "swatch", size: "lg", class: { root: "size-[26px]" } },
	],
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
type RadioGroupItemVariants = VariantProps<typeof radioGroupItemVariants>;

type RadioGroupProps = ComponentPropsWithRef<typeof RadioGroupPrimitive.Root> &
	RadioGroupVariants;

type RadioGroupItemProps = ComponentPropsWithRef<
	typeof RadioGroupPrimitive.Item
> &
	RadioGroupItemVariants;

function RadioGroup({
	className,
	variant,
	size,
	ref,
	...props
}: RadioGroupProps) {
	return (
		<RadioGroupPrimitive.Root
			ref={ref}
			className={cn(radioGroupVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function RadioGroupItem({
	className,
	children,
	variant,
	size,
	ref,
	...props
}: RadioGroupItemProps) {
	const { root, indicator } = radioGroupItemVariants({ variant, size });

	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(root(), className)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className={indicator()} />
			{children}
		</RadioGroupPrimitive.Item>
	);
}

export {
	RadioGroup,
	RadioGroupItem,
	radioGroupVariants,
	radioGroupItemVariants,
	type RadioGroupProps,
	type RadioGroupItemProps,
	type RadioGroupVariants,
	type RadioGroupItemVariants,
};
