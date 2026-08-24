import { Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const switchVariants = tv({
	slots: {
		root: [
			"peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent shadow-xs transition-colors outline-none",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"disabled:pointer-events-none disabled:opacity-50",
			"data-[state=unchecked]:bg-secondary",
		],
		thumb:
			"pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform data-[state=unchecked]:translate-x-0",
	},
	variants: {
		variant: {
			default: { root: "data-[state=checked]:bg-primary" },
			success: { root: "data-[state=checked]:bg-success" },
			destructive: { root: "data-[state=checked]:bg-destructive" },
		},
		size: {
			sm: {
				root: "h-4 w-7 p-0.5",
				thumb: "size-3 data-[state=checked]:translate-x-3",
			},
			md: {
				root: "h-5 w-9 p-0.5",
				thumb: "size-4 data-[state=checked]:translate-x-4",
			},
			lg: {
				root: "h-6 w-11 p-0.5",
				thumb: "size-5 data-[state=checked]:translate-x-5",
			},
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type SwitchVariants = VariantProps<typeof switchVariants>;

type SwitchProps = ComponentPropsWithRef<typeof SwitchPrimitive.Root> &
	SwitchVariants;

function Switch({ className, variant, size, ref, ...props }: SwitchProps) {
	const { root, thumb } = switchVariants({ variant, size });

	return (
		<SwitchPrimitive.Root ref={ref} className={cn(root(), className)} {...props}>
			<SwitchPrimitive.Thumb className={thumb()} />
		</SwitchPrimitive.Root>
	);
}

export { Switch, switchVariants, type SwitchProps, type SwitchVariants };
