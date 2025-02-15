"use client"

import { useState } from "react"
import { api } from "@/trpc/react"

export function LatestPosts() {
  const [latestPosts] = api.post.getAllPosts.useSuspenseQuery()

  const utils = api.useUtils()
  const [name, setName] = useState("")
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate()
      setName("")
    },
  })

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4 overflow-x-auto snap-x snap-mandatory flex space-x-4 pb-4 no-scrollbar">
        {latestPosts && latestPosts.length > 0 ? (
          latestPosts.map((post) => (
            <div key={post.id} className="px-2 flex-shrink-0 w-64 snap-start scroll-ms-5 bg-white/10 rounded-lg p-4 shadow-lg no-scrollbar">
              <h3 className="text-lg font-semibold mb-2 truncate">{post.name}</h3>
              <p className="text-sm text-gray-400">Post ID: {post.id}</p>
            </div>
          ))
        ) : (
          <p className="text-center w-full">You have no posts yet.</p>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          createPost.mutate({ name })
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black outline-none ring-2 ring-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  )
}

