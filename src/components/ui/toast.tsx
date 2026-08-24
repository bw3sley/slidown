import { X } from "lucide-react";
import { Toast as ToastPrimitive } from "radix-ui";
import {
	type ComponentPropsWithRef,
	type ReactNode,
	useEffect,
	useState,
} from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cn } from "@/lib/utils";

const toastVariants = tv({
	base: [
		"pointer-events-auto flex w-auto items-center gap-3 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl outline-none",
		"data-[state=open]:animate-pop-in",
	],
	variants: {
		variant: {
			default: "bg-popover text-popover-foreground",
			destructive:
				"border-destructive/30 bg-destructive text-destructive-foreground",
			success: "border-success/30 bg-success text-success-foreground",
			muted: "border-border bg-muted text-muted-foreground",
		},
		size: {
			sm: "px-3 py-2 text-xs",
			md: "px-4 py-3 text-sm",
			lg: "px-5 py-4 text-base",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const toastViewportVariants = tv({
	base: "pointer-events-none fixed bottom-0 z-[100] flex max-h-screen w-full flex-col-reverse outline-none",
	variants: {
		variant: {
			default: "left-1/2 -translate-x-1/2 items-center",
			start: "left-0 items-start",
			end: "right-0 items-end",
		},
		size: {
			sm: "max-w-sm gap-1.5 p-3",
			md: "max-w-md gap-2 p-4",
			lg: "max-w-lg gap-2.5 p-6",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const toastCloseVariants = tv({
	base: "-mr-1 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md p-1 text-current opacity-60 transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
});

const toastActionVariants = tv({
	base: "inline-flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-current/30 px-2.5 text-xs font-medium whitespace-nowrap transition-colors outline-none hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
});

type ToastProps = ComponentPropsWithRef<typeof ToastPrimitive.Root> &
	VariantProps<typeof toastVariants>;

type ToastViewportProps = ComponentPropsWithRef<
	typeof ToastPrimitive.Viewport
> &
	VariantProps<typeof toastViewportVariants>;

type ToasterProps = VariantProps<typeof toastVariants> & {
	className?: string;
	duration?: number;
	swipeDirection?: "up" | "down" | "left" | "right";
};

/* ---------------------------------------------------------------------------
 * Store -- a module-level reducer + listener list (the shadcn/ui pattern), so
 * `toast()` can be called from anywhere without threading a provider through.
 * ------------------------------------------------------------------------- */

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 4000;

type ToasterToast = Omit<ToastProps, "id" | "title"> & {
	id: string;
	title?: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
};

type ToastOptions = Omit<ToasterToast, "id">;

interface ToastState {
	toasts: ToasterToast[];
}

type ToastStoreAction =
	| { type: "ADD_TOAST"; toast: ToasterToast }
	| { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
	| { type: "DISMISS_TOAST"; toastId?: string }
	| { type: "REMOVE_TOAST"; toastId?: string };

const listeners: Array<(state: ToastState) => void> = [];
const removeTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

let memoryState: ToastState = { toasts: [] };
let idCounter = 0;

function createToastId() {
	idCounter = (idCounter + 1) % Number.MAX_SAFE_INTEGER;
	return `toast-${idCounter}`;
}

function queueRemoval(toastId: string) {
	if (removeTimeouts.has(toastId)) {
		return;
	}

	removeTimeouts.set(
		toastId,
		setTimeout(function removeAfterDelay() {
			removeTimeouts.delete(toastId);
			dispatch({ type: "REMOVE_TOAST", toastId });
		}, TOAST_REMOVE_DELAY),
	);
}

function toastReducer(state: ToastState, action: ToastStoreAction): ToastState {
	switch (action.type) {
		case "ADD_TOAST":
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};
		case "UPDATE_TOAST":
			return {
				...state,
				toasts: state.toasts.map((item) =>
					item.id === action.toast.id ? { ...item, ...action.toast } : item,
				),
			};
		case "DISMISS_TOAST": {
			const { toastId } = action;

			if (toastId === undefined) {
				state.toasts.forEach((item) => queueRemoval(item.id));
			} else {
				queueRemoval(toastId);
			}

			return {
				...state,
				toasts: state.toasts.map((item) =>
					toastId === undefined || item.id === toastId
						? { ...item, open: false }
						: item,
				),
			};
		}
		case "REMOVE_TOAST":
			return {
				...state,
				toasts:
					action.toastId === undefined
						? []
						: state.toasts.filter((item) => item.id !== action.toastId),
			};
	}
}

function dispatch(action: ToastStoreAction) {
	memoryState = toastReducer(memoryState, action);
	listeners.forEach((listener) => listener(memoryState));
}

function createToast(options: ToastOptions) {
	const id = createToastId();

	function update(next: Partial<ToastOptions>) {
		dispatch({ type: "UPDATE_TOAST", toast: { ...next, id } });
	}

	function dismiss() {
		dispatch({ type: "DISMISS_TOAST", toastId: id });
	}

	dispatch({
		type: "ADD_TOAST",
		toast: {
			...options,
			id,
			open: true,
			onOpenChange(open: boolean) {
				if (!open) {
					dismiss();
				}
			},
		},
	});

	return { id, dismiss, update };
}

function dismissToast(toastId?: string) {
	dispatch({ type: "DISMISS_TOAST", toastId });
}

function useToast() {
	const [state, setState] = useState<ToastState>(memoryState);

	useEffect(function subscribeToStore() {
		listeners.push(setState);

		return function unsubscribeFromStore() {
			const index = listeners.indexOf(setState);

			if (index > -1) {
				listeners.splice(index, 1);
			}
		};
	}, []);

	return { toasts: state.toasts, toast: createToast, dismiss: dismissToast };
}

/* ---------------------------------------------------------------------------
 * Components
 * ------------------------------------------------------------------------- */

const ToastProvider = ToastPrimitive.Provider;

function ToastViewport({
	className,
	variant,
	size,
	ref,
	...props
}: ToastViewportProps) {
	return (
		<ToastPrimitive.Viewport
			ref={ref}
			className={cn(toastViewportVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function Toast({ className, variant, size, ref, ...props }: ToastProps) {
	return (
		<ToastPrimitive.Root
			ref={ref}
			className={cn(toastVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function ToastTitle({
	className,
	ref,
	...props
}: ComponentPropsWithRef<typeof ToastPrimitive.Title>) {
	return (
		<ToastPrimitive.Title
			ref={ref}
			className={cn("font-medium leading-none tracking-tight", className)}
			{...props}
		/>
	);
}

function ToastDescription({
	className,
	ref,
	...props
}: ComponentPropsWithRef<typeof ToastPrimitive.Description>) {
	return (
		<ToastPrimitive.Description
			ref={ref}
			className={cn("opacity-90", className)}
			{...props}
		/>
	);
}

function ToastAction({
	className,
	ref,
	...props
}: ComponentPropsWithRef<typeof ToastPrimitive.Action>) {
	return (
		<ToastPrimitive.Action
			ref={ref}
			className={cn(toastActionVariants(), className)}
			{...props}
		/>
	);
}

function ToastClose({
	className,
	ref,
	...props
}: ComponentPropsWithRef<typeof ToastPrimitive.Close>) {
	return (
		<ToastPrimitive.Close
			ref={ref}
			aria-label="Close"
			className={cn(toastCloseVariants(), className)}
			{...props}
		>
			<X aria-hidden="true" className="size-3.5" />
		</ToastPrimitive.Close>
	);
}

function Toaster({
	className,
	variant,
	size,
	duration = 4000,
	swipeDirection = "down",
}: ToasterProps) {
	const { toasts } = useToast();

	return (
		<ToastProvider duration={duration} swipeDirection={swipeDirection}>
			{toasts.map(function renderToast({
				id,
				title,
				description,
				action,
				...toastProps
			}) {
				return (
					<Toast key={id} size={size} variant={variant} {...toastProps}>
						<div className="flex min-w-0 flex-1 flex-col gap-1">
							{title ? <ToastTitle>{title}</ToastTitle> : null}
							{description ? (
								<ToastDescription>{description}</ToastDescription>
							) : null}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport className={className} />
		</ToastProvider>
	);
}

export {
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastAction,
	ToastClose,
	Toaster,
	useToast,
	toastVariants,
	toastViewportVariants,
	type ToastProps,
	type ToastViewportProps,
	type ToasterProps,
	type ToasterToast,
	type ToastOptions,
};
