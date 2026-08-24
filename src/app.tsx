import { zodResolver } from "@hookform/resolvers/zod";
import {
	Download,
	FileDown,
	FilePlus,
	Link2,
	Moon,
	Palette,
	Presentation,
	Share2,
	Sparkles,
	Sun,
	Trash2,
	TriangleAlert,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardRoot,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	EmptyState,
	EmptyStateAction,
	EmptyStateDescription,
	EmptyStateIcon,
	EmptyStateTitle,
} from "@/components/ui/empty-state";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputControl,
	InputDescription,
	InputError,
	InputRoot,
} from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, useToast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const DECK_THEMES = [
	{ accent: "#C1592F", bg: "#F6F1E7", label: "Paper", value: "paper" },
	{ accent: "#6FC3D6", bg: "#0F3A52", label: "Ocean", value: "ocean" },
	{ accent: "#8FD3A8", bg: "#16352C", label: "Forest", value: "forest" },
	{ accent: "#D79BE8", bg: "#2E1B36", label: "Plum", value: "plum" },
];

const ACCENTS = ["#C1592F", "#3A6EA5", "#8FD3A8", "#D79BE8", "#F0B429"];

const PROVIDERS = ["claude", "openai", "gemini"];

const demoSchema = z.object({
	accent: z.string().min(1, "Pick an accent."),
	autosave: z.boolean(),
	email: z
		.string()
		.min(1, "Email is required.")
		.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Enter a valid email address."),
	prompt: z.string().min(10, "Describe the deck in at least 10 characters."),
	provider: z.string().min(1, "Pick a provider."),
	terms: z.boolean().refine(function isAccepted(value) {
		return value;
	}, "You must accept before generating."),
	theme: z.string().min(1, "Pick a slide theme."),
});

type DemoValues = z.infer<typeof demoSchema>;

export function App() {
	const [isDark, setIsDark] = useState(false);

	useEffect(
		function syncTheme() {
			document.documentElement.classList.toggle("dark", isDark);
		},
		[isDark],
	);

	return (
		<TooltipProvider>
			<main className="min-h-screen bg-background text-foreground">
				<div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
					<PageHeader isDark={isDark} onToggleTheme={setIsDark} />
					<ButtonSection />
					<BadgeSection />
					<FieldSection />
					<SelectionSection />
					<FloatingSection />
					<FeedbackSection />
					<SurfaceSection />
					<ValidatedFormSection />
				</div>
			</main>
			<Toaster />
		</TooltipProvider>
	);
}

/* -------------------------------------------------------------------------- */

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: ReactNode;
}) {
	return (
		<section className="rounded-lg border border-border bg-card p-6 shadow-sm">
			<div className="mb-5 space-y-1">
				<h2 className="text-lg font-semibold tracking-tight">{title}</h2>
				{description ? (
					<p className="text-sm text-muted-foreground">{description}</p>
				) : null}
			</div>
			<div className="flex flex-col gap-6">{children}</div>
		</section>
	);
}

function Row({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-[10px] font-bold tracking-[0.06em] text-muted-foreground uppercase">
				{label}
			</span>
			<div className="flex flex-wrap items-center gap-3">{children}</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */

function PageHeader({
	isDark,
	onToggleTheme,
}: {
	isDark: boolean;
	onToggleTheme: (next: boolean) => void;
}) {
	return (
		<header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
			<div className="flex items-center gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
					<Presentation className="size-5" />
				</div>
				<div>
					<h1 className="text-2xl font-semibold tracking-tight">
						Slidown UI primitives
					</h1>
					<p className="text-sm text-muted-foreground">
						20 components in <code className="font-mono">src/components/ui</code>
					</p>
				</div>
			</div>

			<Button
				data-testid="theme-toggle"
				onClick={function toggle() {
					onToggleTheme(!isDark);
				}}
				size="icon"
				variant="outline"
			>
				{isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
			</Button>
		</header>
	);
}

function ButtonSection() {
	return (
		<Section
			description="variant x size, plus the icon size used by the header controls."
			title="Button"
		>
			<Row label="variant">
				<Button>Default</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="destructive">Destructive</Button>
				<Button variant="success">Success</Button>
				<Button variant="link">Link</Button>
			</Row>
			<Row label="size">
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
				<Button aria-label="Sparkles" size="icon">
					<Sparkles className="size-4" />
				</Button>
			</Row>
			<Row label="state">
				<Button disabled>Disabled</Button>
				<Button disabled variant="outline">
					Disabled outline
				</Button>
				<Button
					aria-label="Ask AI"
					className="rounded-full shadow-xl"
					size="icon"
				>
					<Sparkles className="size-5" />
				</Button>
			</Row>
		</Section>
	);
}

function BadgeSection() {
	return (
		<Section description="variant x size, and the separator." title="Badge">
			<Row label="variant">
				<Badge>Default</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="outline">Outline</Badge>
				<Badge variant="muted">Muted</Badge>
				<Badge variant="destructive">Destructive</Badge>
				<Badge variant="success">Success</Badge>
			</Row>
			<Row label="size">
				<Badge size="sm">Small</Badge>
				<Badge size="md">Medium</Badge>
				<Badge size="lg">Large</Badge>
			</Row>
			<Row label="separator">
				<div className="flex h-8 w-full items-center gap-4">
					<span className="text-sm">Left</span>
					<Separator className="h-full" orientation="vertical" />
					<span className="text-sm">Right</span>
					<Separator className="flex-1" />
				</div>
			</Row>
		</Section>
	);
}

function FieldSection() {
	return (
		<Section
			description="Label, input and textarea, including the aria-invalid treatment."
			title="Fields"
		>
			<div className="grid gap-5 md:grid-cols-2">
				<InputRoot>
					<Label htmlFor="field-email">Email</Label>
					<InputControl id="field-email" placeholder="you@example.com" />
					<InputDescription>We never share your email.</InputDescription>
				</InputRoot>

				<InputRoot>
					<Label htmlFor="field-invalid">Invalid input</Label>
					<InputControl
						aria-invalid
						defaultValue="broken@example"
						id="field-invalid"
					/>
					<InputError>That address is not valid.</InputError>
				</InputRoot>

				<InputRoot>
					<Label htmlFor="field-prompt">Prompt</Label>
					<Textarea id="field-prompt" placeholder="Describe the deck..." />
				</InputRoot>

				<InputRoot>
					<Label htmlFor="field-prompt-invalid">Invalid textarea</Label>
					<Textarea
						aria-invalid
						defaultValue="Too vague"
						id="field-prompt-invalid"
					/>
					<InputError>Add more detail.</InputError>
				</InputRoot>
			</div>

			<Row label="input sizes">
				<InputControl className="w-40" placeholder="sm" size="sm" />
				<InputControl className="w-40" placeholder="md" size="md" />
				<InputControl className="w-40" placeholder="lg" size="lg" />
				<InputControl className="w-40" placeholder="outline" variant="outline" />
			</Row>

			<Row label="label sizes">
				<Label size="sm">Small</Label>
				<Label size="md">Medium</Label>
				<Label size="lg">Large</Label>
				<Label variant="muted">Muted</Label>
			</Row>
		</Section>
	);
}

function SelectionSection() {
	const [theme, setTheme] = useState("paper");
	const [accent, setAccent] = useState(ACCENTS[0]);
	const [provider, setProvider] = useState("claude");

	return (
		<Section
			description="Checkbox, switch, radio-group (default / card / swatch) and toggle-group."
			title="Selection"
		>
			<div className="grid gap-6 md:grid-cols-2">
				<Row label="checkbox">
					<div className="flex items-center gap-2">
						<Checkbox defaultChecked id="cb-default" />
						<Label htmlFor="cb-default">Default</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox defaultChecked id="cb-outline" variant="outline" />
						<Label htmlFor="cb-outline">Outline</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							defaultChecked
							id="cb-destructive"
							variant="destructive"
						/>
						<Label htmlFor="cb-destructive">Destructive</Label>
					</div>
					<Checkbox aria-label="Small" defaultChecked size="sm" />
					<Checkbox aria-label="Medium" defaultChecked size="md" />
					<Checkbox aria-label="Large" defaultChecked size="lg" />
					<Checkbox aria-label="Disabled" disabled />
				</Row>

				<Row label="switch">
					<Switch aria-label="Default" defaultChecked />
					<Switch aria-label="Success" defaultChecked variant="success" />
					<Switch
						aria-label="Destructive"
						defaultChecked
						variant="destructive"
					/>
					<Switch aria-label="Small" defaultChecked size="sm" />
					<Switch aria-label="Medium" defaultChecked size="md" />
					<Switch aria-label="Large" defaultChecked size="lg" />
					<Switch aria-label="Disabled" disabled />
				</Row>
			</div>

			<Row label="toggle-group - pill (the AI provider row)">
				<ToggleGroup
					onValueChange={function onChange(next: string) {
						if (next) {
							setProvider(next);
						}
					}}
					size="sm"
					type="single"
					value={provider}
					variant="pill"
				>
					{PROVIDERS.map(function renderProvider(name) {
						return (
							<ToggleGroupItem key={name} value={name}>
								{name}
							</ToggleGroupItem>
						);
					})}
				</ToggleGroup>

				<ToggleGroup defaultValue="a" type="single" variant="default">
					<ToggleGroupItem value="a">Left</ToggleGroupItem>
					<ToggleGroupItem value="b">Middle</ToggleGroupItem>
					<ToggleGroupItem value="c">Right</ToggleGroupItem>
				</ToggleGroup>

				<ToggleGroup defaultValue="a" type="single" variant="ghost">
					<ToggleGroupItem value="a">Ghost</ToggleGroupItem>
					<ToggleGroupItem value="b">Group</ToggleGroupItem>
				</ToggleGroup>
			</Row>

			<Row label="radio-group - card (the slide theme tiles)">
				<RadioGroup
					className="w-full max-w-md"
					onValueChange={setTheme}
					value={theme}
					variant="cards"
				>
					{DECK_THEMES.map(function renderTheme(item) {
						return (
							<RadioGroupItem key={item.value} value={item.value} variant="card">
								<span
									className="block h-9 w-full rounded-md border border-border"
									style={{ background: item.bg }}
								>
									<span
										className="mt-6 ml-2 block h-1 w-4 rounded-full"
										style={{ background: item.accent }}
									/>
								</span>
								<span className="mt-1.5 block text-center text-[11px] font-semibold">
									{item.label}
								</span>
							</RadioGroupItem>
						);
					})}
				</RadioGroup>
			</Row>

			<Row label="radio-group - swatch (the accent dots) and default">
				<RadioGroup onValueChange={setAccent} value={accent} variant="inline">
					{ACCENTS.map(function renderAccent(hex) {
						return (
							<RadioGroupItem
								aria-label={hex}
								key={hex}
								style={{ background: hex }}
								value={hex}
								variant="swatch"
							/>
						);
					})}
				</RadioGroup>

				<RadioGroup defaultValue="one">
					<div className="flex items-center gap-2">
						<RadioGroupItem id="r-one" value="one" />
						<Label htmlFor="r-one">Option one</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem id="r-two" value="two" />
						<Label htmlFor="r-two">Option two</Label>
					</div>
				</RadioGroup>
			</Row>
		</Section>
	);
}

function FloatingSection() {
	return (
		<Section
			description="Select, dropdown-menu, popover and tooltip - rounded-xl, shadow-xl, animate-pop-in."
			title="Floating surfaces"
		>
			<Row label="select">
				<Select>
					<SelectTrigger className="w-48" data-testid="theme-select">
						<SelectValue placeholder="Pick a theme" />
					</SelectTrigger>
					<SelectContent>
						{DECK_THEMES.map(function renderItem(item) {
							return (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>

				<Select>
					<SelectTrigger aria-invalid className="w-48">
						<SelectValue placeholder="Invalid select" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="a">One</SelectItem>
					</SelectContent>
				</Select>
			</Row>

			<Row label="dropdown-menu (the Share menu)">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button data-testid="share-menu-trigger">
							<Share2 className="size-4" />
							Share
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem disabled>
							<Link2 className="size-4" />
							<span className="flex-1">Copy link</span>
							<Badge size="sm" variant="muted">
								soon
							</Badge>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<FileDown className="size-4" />
							<span className="flex-1">Export as PDF</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="destructive">
							<Trash2 className="size-4" />
							<span className="flex-1">Delete deck</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</Row>

			<Row label="popover + tooltip">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline">
							<Palette className="size-4" />
							Slide theme
						</Button>
					</PopoverTrigger>
					<PopoverContent size="sm">
						<p className="text-sm font-semibold">Theme settings</p>
						<p className="mt-1 text-sm text-muted-foreground">
							A tokenized floating surface with Radix focus management.
						</p>
					</PopoverContent>
				</Popover>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button aria-label="Ask AI" size="icon" variant="ghost">
							<Sparkles className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Ask AI</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button aria-label="Download skill" size="icon" variant="ghost">
							<Download className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent variant="inverse">Download skill</TooltipContent>
				</Tooltip>
			</Row>
		</Section>
	);
}

function FeedbackSection() {
	const { toast } = useToast();

	return (
		<Section
			description="Alert variants, the toast store, and the empty state."
			title="Feedback"
		>
			<div className="grid gap-3">
				<Alert>
					<AlertTitle>Heads up</AlertTitle>
					<AlertDescription>The default alert surface.</AlertDescription>
				</Alert>
				<Alert variant="destructive">
					<TriangleAlert />
					<AlertTitle>Generation failed</AlertTitle>
					<AlertDescription>
						The API key was rejected. Check it and try again.
					</AlertDescription>
				</Alert>
				<Alert variant="success">
					<AlertTitle>Deck generated</AlertTitle>
					<AlertDescription>
						7 slides were written to the editor.
					</AlertDescription>
				</Alert>
				<Alert variant="accent">
					<AlertDescription className="whitespace-pre-wrap">
						The accent alert backs the AI feedback block.
					</AlertDescription>
				</Alert>
				<Alert variant="muted">
					<AlertDescription>Muted, for low-priority notes.</AlertDescription>
				</Alert>
			</div>

			<Row label="toast">
				<Button
					data-testid="fire-toast"
					onClick={function fire() {
						toast({
							description: "slidown-slides/SKILL.md",
							title: "Skill file downloaded",
						});
					}}
					variant="outline"
				>
					Fire a toast
				</Button>
				<Button
					onClick={function fire() {
						toast({
							description: "The API key was rejected.",
							title: "Could not generate",
							variant: "destructive",
						});
					}}
					variant="outline"
				>
					Destructive toast
				</Button>
			</Row>

			<Row label="empty-state">
				<EmptyState className="w-full">
					<EmptyStateIcon>
						<FilePlus />
					</EmptyStateIcon>
					<EmptyStateTitle>Nothing to show yet</EmptyStateTitle>
					<EmptyStateDescription>
						Start typing markdown on the left. Slides split on a line of ---.
					</EmptyStateDescription>
					<EmptyStateAction>
						<Button>Insert starter deck</Button>
					</EmptyStateAction>
				</EmptyState>
			</Row>
		</Section>
	);
}

function SurfaceSection() {
	return (
		<Section description="Card variants and the scroll area." title="Surfaces">
			<div className="grid gap-4 md:grid-cols-3">
				<CardRoot>
					<CardHeader>
						<CardTitle>Default</CardTitle>
						<CardDescription>bg-card, border, shadow-sm.</CardDescription>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						The standard in-page panel.
					</CardContent>
					<CardFooter>
						<Button size="sm" variant="outline">
							Action
						</Button>
					</CardFooter>
				</CardRoot>

				<CardRoot variant="outline">
					<CardHeader>
						<CardTitle>Outline</CardTitle>
						<CardDescription>Border only, transparent fill.</CardDescription>
					</CardHeader>
				</CardRoot>

				<CardRoot variant="muted">
					<CardHeader>
						<CardTitle>Muted</CardTitle>
						<CardDescription>Quiet background.</CardDescription>
					</CardHeader>
				</CardRoot>

				<CardRoot interactive size="sm" variant="accent">
					<CardContent className="flex items-center gap-3">
						<div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<Presentation className="size-4" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-[12.5px] font-bold">Get the slidown skill</p>
							<p className="text-[11.5px] text-muted-foreground">
								Best practices for any AI tool
							</p>
						</div>
						<Download className="size-4 shrink-0 opacity-60" />
					</CardContent>
				</CardRoot>

				<CardRoot interactive size="sm">
					<CardContent className="text-sm">
						<span className="text-xs font-bold opacity-50">1</span>
						<p className="mt-1 font-medium">Welcome to slidown</p>
					</CardContent>
				</CardRoot>

				<CardRoot size="sm" variant="interactive">
					<CardContent className="text-sm">
						variant=&quot;interactive&quot;
					</CardContent>
				</CardRoot>
			</div>

			<Row label="scroll-area">
				<ScrollArea className="h-40 w-full rounded-lg border border-border">
					<div className="flex flex-col gap-2 p-4">
						{Array.from({ length: 14 }, function makeRow(_, index) {
							return (
								<p className="text-sm" key={index}>
									Slide {index + 1} - scrollable content inside a Radix scroll
									area.
								</p>
							);
						})}
					</div>
				</ScrollArea>
			</Row>
		</Section>
	);
}

function ValidatedFormSection() {
	const { toast } = useToast();
	const form = useForm<DemoValues>({
		defaultValues: {
			accent: "",
			autosave: false,
			email: "",
			prompt: "",
			provider: "",
			terms: false,
			theme: "",
		},
		resolver: zodResolver(demoSchema),
	});

	return (
		<Section
			description="A live zod schema through zodResolver. Native controls spread the field directly; Radix controls go through FormField and FormControl. Submit empty to surface every error."
			title="Form - react-hook-form + zod"
		>
			<Form {...form}>
				<form
					className="grid gap-5"
					onSubmit={form.handleSubmit(function onValid(values) {
						toast({
							description: `${values.provider} / ${values.theme}`,
							title: "Form submitted",
							variant: "success",
						});
					})}
				>
					<div className="grid gap-5 md:grid-cols-2">
						<FormField
							control={form.control}
							name="email"
							render={function renderEmail({ field }) {
								return (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<InputControl placeholder="you@example.com" {...field} />
										</FormControl>
										<FormDescription>
											Spread straight onto the native control.
										</FormDescription>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="theme"
							render={function renderTheme({ field }) {
								return (
									<FormItem>
										<FormLabel>Slide theme</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger data-testid="form-theme">
													<SelectValue placeholder="Pick a theme" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{DECK_THEMES.map(function renderItem(item) {
													return (
														<SelectItem key={item.value} value={item.value}>
															{item.label}
														</SelectItem>
													);
												})}
											</SelectContent>
										</Select>
										<FormDescription>
											Radix control, driven through Controller.
										</FormDescription>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</div>

					<FormField
						control={form.control}
						name="prompt"
						render={function renderPrompt({ field }) {
							return (
								<FormItem>
									<FormLabel>Prompt</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe the deck you want..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>

					<div className="grid gap-5 md:grid-cols-2">
						<FormField
							control={form.control}
							name="provider"
							render={function renderProvider({ field }) {
								return (
									<FormItem>
										<FormLabel>Provider</FormLabel>
										<FormControl>
											<ToggleGroup
												onValueChange={field.onChange}
												size="sm"
												type="single"
												value={field.value}
												variant="pill"
											>
												{PROVIDERS.map(function renderItem(name) {
													return (
														<ToggleGroupItem key={name} value={name}>
															{name}
														</ToggleGroupItem>
													);
												})}
											</ToggleGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="accent"
							render={function renderAccent({ field }) {
								return (
									<FormItem>
										<FormLabel>Accent</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												value={field.value}
												variant="inline"
											>
												{ACCENTS.map(function renderItem(hex) {
													return (
														<RadioGroupItem
															aria-label={hex}
															key={hex}
															style={{ background: hex }}
															value={hex}
															variant="swatch"
														/>
													);
												})}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="autosave"
							render={function renderAutosave({ field }) {
								return (
									<FormItem variant="inline">
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>Autosave this deck</FormLabel>
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="terms"
							render={function renderTerms({ field }) {
								return (
									<FormItem variant="inline">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="flex flex-col gap-1">
											<FormLabel>Accept the terms</FormLabel>
											<FormMessage />
										</div>
									</FormItem>
								);
							}}
						/>
					</div>

					<div className="flex gap-3">
						<Button data-testid="form-submit" type="submit">
							Generate deck
						</Button>
						<Button
							onClick={function reset() {
								form.reset();
							}}
							type="button"
							variant="ghost"
						>
							Reset
						</Button>
					</div>
				</form>
			</Form>
		</Section>
	);
}
