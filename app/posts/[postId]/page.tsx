import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const likes = new Map();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getComments = async (postId: string) => {
  await delay(3000);

  return await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
    {
      next: {},
    }
  ).then((r) => r.json());
};

const Comments = async ({ postId }: { postId: string }) => {
  const comments = await getComments(postId);

  return (
    <>
      <ul className="flex flex-col gap-4">
        {comments.map((comment: { id: number; name: string; body: string }) => (
          <li key={comment.id}>
            <details>
              <summary className="font-bold text-gray-500 cursor-pointer hover:text-gray-700">
                {comment.name}
              </summary>
              <p className="p-4 border border-gray-800 bg-gray-100 text-gray-800">
                {comment.body}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </>
  );
};

export default async function Posts({
  params,
  searchParams,
}: {
  params: { postId: string };
  searchParams: { showComments: string };
}) {
  const showComments: boolean = searchParams.showComments === "true";

  const post = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.postId}`,
    {
      next: {},
    }
  ).then((r) => r.json());

  async function likePost() {
    "use server";

    likes.set(params.postId, (likes.get(params.postId) || 0) + 1);
    revalidatePath("/posts/[postId]");
  }

  return (
    <>
      <h1 className="font-bold text-2xl flex items-center gap-2">
        {post.title}
        <div className="flex items-center font-normal text-base gap-2">
          <form action={likePost}>
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-red-500 cursor-pointer hover:text-red-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </form>

          <span>{likes.get(params.postId) || 0} likes</span>
        </div>
      </h1>

      <p>{post.body}</p>

      <h2 className="font-bold text-xl">Comments</h2>

      <Link
        href={{
          query: {
            showComments: !showComments,
          },
        }}
      >
        {showComments ? `Hide Comments` : `Show Comments`}
      </Link>

      {showComments && (
        <Suspense fallback="Loading...">
          <Comments postId={params.postId} />
        </Suspense>
      )}
    </>
  );
}
