export function calcEngagementRate(post, followers) {
  return (((post.likes + post.comments + post.shares) / followers) * 100).toFixed(2);
}

export function avgEngagementRate(posts, followers) {
  const total = posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0);
  return ((total / posts.length / followers) * 100).toFixed(2);
}

export function postingFrequency(posts) {
  // posts per week (assuming date range spans ~2 weeks in mock data)
  const days = 14;
  return ((posts.length / days) * 7).toFixed(1);
}

export function contentDistribution(posts) {
  const counts = {};
  posts.forEach((p) => {
    counts[p.type] = (counts[p.type] || 0) + 1;
  });
  return Object.entries(counts).map(([type, count]) => ({
    name: type,
    value: count,
  }));
}

export function bestContentType(posts, followers) {
  const dist = {};
  posts.forEach((p) => {
    if (!dist[p.type]) dist[p.type] = { total: 0, count: 0 };
    dist[p.type].total += p.likes + p.comments + p.shares;
    dist[p.type].count += 1;
  });
  let best = null;
  let bestRate = -1;
  for (const type in dist) {
    const rate = dist[type].total / dist[type].count / followers;
    if (rate > bestRate) {
      bestRate = rate;
      best = type;
    }
  }
  return best;
}
export function calendarPattern(posts, followers) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayData = days.map((day) => ({ day, total: 0, count: 0 }));

  posts.forEach((p) => {
    const dayIndex = new Date(p.date).getDay();
    const engagement = (p.likes + p.comments + p.shares) / followers;
    dayData[dayIndex].total += engagement;
    dayData[dayIndex].count += 1;
  });

  return dayData.map((d) => ({
    day: d.day,
    engagement: d.count > 0 ? parseFloat(((d.total / d.count) * 100).toFixed(2)) : 0,
  }));
}