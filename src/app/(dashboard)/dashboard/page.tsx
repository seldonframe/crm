import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, contacts, deals } from "@/db/schema";
import { getOrgId } from "@/lib/auth/helpers";
import { getSoul } from "@/lib/soul/server";
import { OverviewStats } from "@/components/dashboard/widgets/overview-stats";
import { RecentActivityWidget } from "@/components/dashboard/widgets/recent-activity";
import { UpcomingTasksWidget } from "@/components/dashboard/widgets/upcoming-tasks";

export default async function DashboardPage() {
  const [orgId, soul] = await Promise.all([getOrgId(), getSoul()]);

  if (!orgId) {
    return null;
  }

  const [contactRows, dealRows, activityRows, taskRows] = await Promise.all([
    db.select().from(contacts).where(eq(contacts.orgId, orgId)),
    db.select().from(deals).where(eq(deals.orgId, orgId)),
    db.select().from(activities).where(eq(activities.orgId, orgId)).orderBy(desc(activities.createdAt)).limit(20),
    db
      .select()
      .from(activities)
      .where(and(eq(activities.orgId, orgId), eq(activities.type, "task")))
      .orderBy(desc(activities.createdAt))
      .limit(20),
  ]);

  const pipelineValue = dealRows.reduce((sum, row) => sum + Number(row.value), 0);
  const priority = soul?.priorities?.[0]?.toLowerCase() ?? "pipeline visibility";

  const firstWidget =
    priority.includes("acquisition") || priority.includes("pipeline") ? (
      <OverviewStats totalContacts={contactRows.length} totalDeals={dealRows.length} pipelineValue={pipelineValue} />
    ) : (
      <RecentActivityWidget
        items={activityRows.map((item) => ({ id: item.id, type: item.type, subject: item.subject, createdAt: item.createdAt }))}
      />
    );

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {firstWidget}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivityWidget
          items={activityRows.map((item) => ({ id: item.id, type: item.type, subject: item.subject, createdAt: item.createdAt }))}
        />
        <UpcomingTasksWidget
          tasks={taskRows.map((item) => ({ id: item.id, subject: item.subject, scheduledAt: item.scheduledAt }))}
        />
      </div>
    </section>
  );
}
