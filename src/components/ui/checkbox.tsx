import { Check, Minus } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const checkboxVariants = tv({
	slots: {
		root: [
			"peer inline-flex shrink-0 cursor-pointer items-center justify-center border shadow-xs transition-colors outline-none",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"disabled:pointer-events-none disabled:opacity-50",
			"aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
		],
		indicator: "group flex items-center justify-center text-current",
	},
	variants: {
		variant: {
			default: {
				root: [
					"border-input bg-background",
					"data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
					"data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
				],
			},
			outline: {
				root: [
					"border-border bg-transparent",
					"data-[state=checked]:border-primary data-[state=checked]:text-primary",
					"data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary",
				],
			},
			destructive: {
				root: [
					"border-destructive bg-background",
					"data-[state=checked]:border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
					"data-[state=indeterminate]:border-destructive data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:text-destructive-foreground",
				],
			},
		},
		size: {
			sm: {
				root: "size-3.5 rounded-sm",
				indicator: "[&_svg]:size-2.5",
			},
			md: {
				root: "size-4 rounded-sm",
				indicator: "[&_svg]:size-3",
			},
			lg: {
				root: "size-5 rounded-md",
				indicator: "[&_svg]:size-3.5",
			},
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type CheckboxVariants = VariantProps<typeof checkboxVariants>;

type CheckboxProps = ComponentPropsWithRef<typeof CheckboxPrimitive.Root> &
	CheckboxVariants;

function Checkbox({ className, variant, size, ref, ...props }: CheckboxProps) {
	const { root, indicator } = checkboxVariants({ variant, size });

	return (
		<CheckboxPrimitive.Root
			ref={ref}
			className={cn(root(), className)}
			{...props}
		>
			<CheckboxPrimitive.Indicator className={indicator()}>
				<Check
					aria-hidden="true"
					className="hidden shrink-0 group-data-[state=checked]:block"
				/>
				<Minus
					aria-hidden="true"
					className="hidden shrink-0 group-data-[state=indeterminate]:block"
				/>
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export {
	Checkbox,
	checkboxVariants,
	type CheckboxProps,
	type CheckboxVariants,
};
