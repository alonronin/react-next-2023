import Link from "next/link";

export default async function Posts() {
  const posts = await fetch("https://jsonplaceholder.typicode.com/posts", {
    next: {},
  }).then((r) => r.json());

  return (
    <>
      <h1 className="font-bold text-2xl">Posts</h1>

      <ul className="flex flex-col gap-4">
        {posts.map((post: { id: number; title: string }) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
