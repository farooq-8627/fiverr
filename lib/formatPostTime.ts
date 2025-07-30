export function formatPostTime(date: Date | string) {
  const postDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  // Just now - less than 1 minute
  if (diffInSeconds < 60) {
    return "Just now";
  }

  // Minutes ago - less than 1 hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "min" : "mins"} ago`;
  }

  // Hours ago - less than 24 hours
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hr" : "hrs"} ago`;
  }

  // Check if yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    postDate.getDate() === yesterday.getDate() &&
    postDate.getMonth() === yesterday.getMonth() &&
    postDate.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  // Format date based on year
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (postDate.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }

  return postDate.toLocaleDateString("en-US", options);
}
