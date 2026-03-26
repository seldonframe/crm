"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { useMemo, useTransition } from "react";
import { moveDealStageAction } from "@/lib/deals/actions";
import { isDemoBlockedError, isDemoReadonlyClient } from "@/lib/demo/client";
import { useDemoToast } from "@/components/shared/demo-toast-provider";

type Stage = { name: string; color: string; probability: number };
type Deal = { id: string; title: string; stage: string; value: string };

export function KanbanBoard({ stages, deals }: { stages: Stage[]; deals: Deal[] }) {
  const [pending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));
  const { showDemoToast } = useDemoToast();

  const grouped = useMemo(() => {
    return stages.map((stage) => ({
      stage,
      deals: deals.filter((deal) => deal.stage === stage.name),
    }));
  }, [deals, stages]);

  const handleDragEnd = (event: DragEndEvent) => {
    const dealId = String(event.active.id);
    const overId = event.over?.id;

    if (!overId) {
      return;
    }

    const stageName = String(overId);
    const target = stages.find((stage) => stage.name === stageName);

    if (!target) {
      return;
    }

    startTransition(async () => {
      try {
        if (isDemoReadonlyClient) {
          showDemoToast();
          return;
        }

        await moveDealStageAction(dealId, target.name, target.probability);
        window.location.reload();
      } catch (error) {
        if (isDemoBlockedError(error)) {
          showDemoToast();
          return;
        }

        throw error;
      }
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {grouped.map(({ stage, deals: stageDeals }) => (
          <div key={stage.name} className="crm-card p-3" id={stage.name}>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
              <h3 className="text-sm font-semibold">{stage.name}</h3>
            </div>

            <SortableContext items={stageDeals.map((deal) => deal.id)}>
              <div className="space-y-2 min-h-20">
                {stageDeals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    layout
                    whileHover={{ y: -2, boxShadow: "var(--shadow-dropdown)" }}
                    className="rounded-md border bg-[hsl(var(--color-surface))] p-3"
                    id={deal.id}
                  >
                    <p className="text-sm font-medium">{deal.title}</p>
                    <p className="mt-1 text-xs text-[hsl(var(--color-text-secondary))]">${Number(deal.value).toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
      {pending ? <p className="mt-2 text-xs text-[hsl(var(--color-text-secondary))]">Updating stage...</p> : null}
    </DndContext>
  );
}
