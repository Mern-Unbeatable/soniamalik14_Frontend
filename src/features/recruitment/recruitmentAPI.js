
export async function fetchRecruitmentsJSON() {
  const res = await fetch('/data/recruitments.json');
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch recruitments: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export default {
  fetchRecruitmentsJSON,
};
