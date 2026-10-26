export default function FormDivider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-gray-100 ${className}`} />;
}
