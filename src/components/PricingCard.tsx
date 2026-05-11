import { Check } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function PricingCard({
  name,
  price,
  description,
  features,
  cta = "Get started",
  href = "/auth/signup",
  highlighted = false,
  children
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta?: string;
  href?: string;
  highlighted?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-6 shadow-sm",
        highlighted ? "border-brand-200 shadow-soft ring-2 ring-brand-100" : "border-slate-200"
      )}
    >
      <p className="text-sm font-bold uppercase tracking-wide text-brand-600">{name}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{price}</p>
      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{description}</p>
      <ul className="mt-6 space-y-3 text-sm text-slate-700">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {children ?? (
          <LinkButton href={href} className="w-full" variant={highlighted ? "primary" : "outline"}>
            {cta}
          </LinkButton>
        )}
      </div>
    </div>
  );
}
