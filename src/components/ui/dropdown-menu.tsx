import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const dropdownMenuContentVariants = tv({
	base: [
		"z-50 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl",
		"data-[state=open]:animate-pop-in",
	],
	variants: {
		variant: {
			default: "bg-popover text-popover-foreground",
			outline: "bg-background text-foreground",
			secondary: "border-transparent bg-secondary text-secondary-foreground",
		},
		size: {
			sm: "p-1",
			md: "p-1.5",
			lg: "p-2",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const dropdownMenuItemVariants = tv({
	base: [
		"relative flex cursor-default items-center rounded-md transition-colors outline-none select-none",
		"focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
		"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		"data-[inset]:pl-8",
	],
	variants: {
		variant: {
			default: "text-foreground",
			secondary: "text-muted-foreground",
			destructive:
				"text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive",
		},
		size: {
			sm: "gap-1.5 px-2 py-1.5 text-xs",
			md: "gap-2 px-2.5 py-2 text-sm",
			lg: "gap-2.5 px-3 py-2.5 text-sm",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const dropdownMenuSeparatorVariants = tv({
	base: "-mx-1 my-1 h-px bg-border",
});

type DropdownMenuContentProps = ComponentPropsWithRef<
	typeof DropdownMenuPrimitive.Content
> &
	VariantProps<typeof dropdownMenuContentVariants>;

type DropdownMenuItemProps = ComponentPropsWithRef<
	typeof DropdownMenuPrimitive.Item
> &
	VariantProps<typeof dropdownMenuItemVariants> & {
		inset?: boolean;
	};

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

function DropdownMenuContent({
	className,
	sideOffset = 6,
	align = "end",
	variant,
	size,
	ref,
	...props
}: DropdownMenuContentProps) {
	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				ref={ref}
				sideOffset={sideOffset}
				align={align}
				className={cn(
					dropdownMenuContentVariants({ variant, size }),
					className,
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	);
}

function DropdownMenuItem({
	className,
	inset,
	variant,
	size,
	ref,
	...props
}: DropdownMenuItemProps) {
	return (
		<DropdownMenuPrimitive.Item
			ref={ref}
			className={cn(dropdownMenuItemVariants({ variant, size }), className)}
			data-inset={inset ? "" : undefined}
			{...props}
		/>
	);
}

function DropdownMenuSeparator({
	className,
	ref,
	...props
}: ComponentPropsWithRef<typeof DropdownMenuPrimitive.Separator>) {
	return (
		<DropdownMenuPrimitive.Separator
			ref={ref}
			className={cn(dropdownMenuSeparatorVariants(), className)}
			{...props}
		/>
	);
}

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
};
