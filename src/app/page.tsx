import Link from "next/link"

import { LatestPosts } from "@/app/_components/post"
import { auth } from "@/server/auth"
import { api, HydrateClient } from "@/trpc/server"

export default async function Home() {
  const hello = await api.post.hello({ text: "world" })
  const session = await auth()

  if (session?.user) {
    void api.post.getAllPosts.prefetch()
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-blue-600">tRPC</span> App
          </h1>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-black">{hello ? hello.greeting : "Loading tRPC query..."}</p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-black">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-blue-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-blue-700"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {session?.user && <LatestPosts />}
        </div>
      </main>
    </HydrateClient>
  )
}

