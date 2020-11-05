export default (fetch) => {
  return async (query, variables) => {
    return await fetch("/graphql", {
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  };
};