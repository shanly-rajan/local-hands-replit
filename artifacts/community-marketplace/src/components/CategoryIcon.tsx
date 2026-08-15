import { icons, Wrench, type LucideProps } from "lucide-react";

function toPascalCase(name: string): string {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

interface CategoryIconProps extends LucideProps {
  name: string;
}

export function CategoryIcon({ name, ...props }: CategoryIconProps) {
  const Icon = icons[toPascalCase(name) as keyof typeof icons] ?? Wrench;
  return <Icon {...props} />;
}
