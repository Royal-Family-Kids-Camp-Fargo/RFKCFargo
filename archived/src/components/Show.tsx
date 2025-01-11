import { Route } from "@react-router/dev/routes";

export default function Show({ loaderData }: Route.ComponentProps) {
  const { show, isLiked } = loaderData;
  return (
    <div>
      <h1>{show.name}</h1>
      <p>{show.description}</p>

      <form method="post">
        <button type="submit" name="liked" value={isLiked ? 0 : 1}>
          {isLiked ? "Remove" : "Save"}
        </button>
      </form>
    </div>
  );
}
