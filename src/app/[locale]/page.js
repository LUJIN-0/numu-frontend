import { useLocale } from "next-intl";
import { redirect } from "next/navigation";

export default function Home() {
  const locale = useLocale();
  console.log('Redirecting from locale:', locale);
  
  redirect(`/${locale}/dashboard`);
}
