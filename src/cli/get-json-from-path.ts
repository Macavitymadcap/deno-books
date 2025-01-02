export const getJSONFromPath = () => {
  const newDataPath = Deno.args[0];
  if (!newDataPath) {
    console.error("Please provide a path to the new data");
    Deno.exit(1);
  }

  const info = JSON.parse(
    Deno.readTextFileSync(newDataPath),
  );

  return info;
};
