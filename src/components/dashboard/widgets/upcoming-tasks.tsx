export function UpcomingTasksWidget({
  tasks,
}: {
  tasks: Array<{ id: string; subject: string | null; scheduledAt: Date | null }>;
}) {
  return (
    <article className="crm-card p-4">
      <h3 className="mb-3 text-lg font-semibold">Upcoming Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-[hsl(var(--color-text-secondary))]">No tasks scheduled.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.slice(0, 6).map((task) => (
            <li key={task.id} className="text-sm">
              {task.subject ?? "Untitled task"} {task.scheduledAt ? `· ${new Date(task.scheduledAt).toLocaleDateString()}` : ""}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
