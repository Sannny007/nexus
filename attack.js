const url = "http://localhost:5000/api/auth/login";

const login = async (email, password) => {
  const t = performance.now();
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return Math.round(performance.now() - t);
};

await login("warmup@nexus.dev", "x"); // warm-up, result ignore

const avg = async (email) => {
  const times = [];
  for (let i = 0; i < 10; i++) times.push(await login(email, "wrongpass123"));
  return Math.round(times.reduce((a, b) => a + b) / times.length);
};

console.log("nonexistent avg ms:", await avg("nobody@nexus.dev"));
console.log("existing avg ms   :", await avg("sanny433dev+test1@gmail.com"));