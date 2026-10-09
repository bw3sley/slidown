import type { ButtonHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils";

const buttonVariants = tv({
	base: "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	variants: {
		variant: {
			default:
				"bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
			secondary:
				"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			outline:
				"border border-border bg-background text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
			ghost:
				"text-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
			destructive:
				"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			success:
				"bg-success text-success-foreground shadow-sm hover:bg-success/90",
			link: "h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline",
		},
		size: {
			sm: "h-8 px-3 text-xs",
			md: "h-9 px-4 py-2",
			lg: "h-10 px-6 text-base",
			icon: "size-9 p-0",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

function Button({
	className,
	variant,
	size,
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(buttonVariants({ variant, size }), className)}
			type={type}
			{...props}
		/>
	);
}

export { Button, buttonVariants, type ButtonProps, type ButtonVariants };
