import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentPropsWithRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const selectTriggerVariants = tv({
	base: [
		"flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background text-left text-sm text-foreground shadow-xs transition-colors outline-none",
		"placeholder:text-muted-foreground data-[placeholder]:text-muted-foreground",
		"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
		"disabled:cursor-not-allowed disabled:opacity-50",
		"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
		"data-[state=open]:border-ring data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
		"[&_span]:line-clamp-1",
	],
	variants: {
		variant: {
			default: "border-input bg-background hover:bg-accent/30",
			outline: "border-border bg-transparent hover:bg-accent/20",
			secondary: "border-transparent bg-secondary hover:bg-accent/60",
		},
		size: {
			sm: "h-8 px-3 text-xs",
			md: "h-9 px-3 text-sm",
			lg: "h-10 px-4 text-sm",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const selectContentVariants = tv({
	base: [
		"relative z-50 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl",
		"data-[state=open]:animate-pop-in",
	],
	variants: {
		variant: {
			default: "bg-popover text-popover-foreground",
			outline: "border-border bg-background text-foreground",
			secondary: "border-transparent bg-secondary text-secondary-foreground",
		},
		size: {
			sm: "min-w-[7rem]",
			md: "min-w-[8rem]",
			lg: "min-w-[10rem]",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const selectItemVariants = tv({
	base: [
		"relative flex w-full cursor-default items-center rounded-md py-2 pr-8 pl-8 text-sm transition-colors outline-none select-none",
		"focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
		"data-[state=checked]:bg-primary/10 data-[state=checked]:text-foreground",
		"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
	],
});

type SelectTriggerProps = ComponentPropsWithRef<
	typeof SelectPrimitive.Trigger
> &
	VariantProps<typeof selectTriggerVariants>;

type SelectContentProps = ComponentPropsWithRef<
	typeof SelectPrimitive.Content
> &
	VariantProps<typeof selectContentVariants>;

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

function SelectTrigger({
	className,
	children,
	variant,
	size,
	ref,
	...props
}: SelectTriggerProps) {
	return (
		<SelectPrimitive.Trigger
			ref={ref}
			className={cn(selectTriggerVariants({ variant, size }), className)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDown
					aria-hidden="true"
					className="size-3.5 shrink-0 text-muted-foreground"
				/>
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	);
}

function SelectContent({
	className,
	children,
	position = "popper",
	sideOffset = 4,
	variant,
	size,
	ref,
	...props
}: SelectContentProps) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				className={cn(selectContentVariants({ variant, size }), className)}
				position={position}
				sideOffset={sideOffset}
				{...props}
			>
				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							"h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)",
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}

function SelectItem({
	className,
	children,
	ref,
	...props
}: ComponentPropsWithRef<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			ref={ref}
			className={cn(selectItemVariants(), className)}
			{...props}
		>
			<span className="absolute left-2 flex size-4 items-center justify-center text-primary">
				<SelectPrimitive.ItemIndicator>
					<Check aria-hidden="true" className="size-3.5" />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	);
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
