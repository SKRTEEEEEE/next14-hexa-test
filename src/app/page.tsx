import { ToastTest } from "@/components/oth/toast-test";
import Link from "next/link";

export default function Home() {
  return (
  <main  className="container h-dvh mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col gap-8">
      <h1 className="text-center">This is the home page</h1> <br />
      {/* <Link href={"/dashboard/config"}>Ir al dashboard config</Link> */}
      <Link href={"/admin/users"}>Ir a admin users</Link>
      <Link href={"/academia"}>Ir a academia</Link>
      <Link href={"/ceo"}>Ir a sobre mi</Link>
      <ToastTest/>
    </div>
  </main>
  );
}
