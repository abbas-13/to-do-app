import requireLogin from "../middlewares/requireLogin.js";
import ToDo from "../models/toDo.js";
import ToDoList from "../models/toDoList.js";

const PRIORITIES = ["high", "medium", "low"];

const toDate = (value) => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const deadlineOf = (toDo) => {
  const base = toDate(toDo.date);
  if (!base) return null;
  if (!toDo.time) return base;

  const [hours, minutes] = String(toDo.time).split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return base;

  const deadline = new Date(base);
  deadline.setHours(hours, minutes, 0, 0);
  return deadline;
};

const average = (numbers) =>
  numbers.length
    ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length
    : null;

export default (app) => {
  app.get("/api/analytics", requireLogin, async (req, res) => {
    try {
      const { listId } = req.query;

      const query = { userId: req.user._id, deleted: false };
      if (listId) {
        query.list = listId;
      }

      const toDos = await ToDo.find(query).lean();

      const now = Date.now();

      const buckets = {};
      for (const priority of PRIORITIES) {
        buckets[priority] = { total: 0, completed: 0, durations: [] };
      }

      const allDurations = [];
      const completedPerDay = {};
      const listStats = new Map();
      let completed = 0;
      let overdue = 0;

      for (const toDo of toDos) {
        const priority = PRIORITIES.includes(toDo.priority)
          ? toDo.priority
          : "low";
        const bucket = buckets[priority];
        bucket.total += 1;

        const listKey = String(toDo.list || "");
        if (!listStats.has(listKey)) {
          listStats.set(listKey, { total: 0, completed: 0, overdue: 0 });
        }
        const listStat = listStats.get(listKey);
        listStat.total += 1;

        if (toDo.isChecked) {
          completed += 1;
          bucket.completed += 1;
          listStat.completed += 1;

          const created = toDate(toDo.dateCreated);
          const finishedAt = toDate(toDo.completedAt);

          if (created && finishedAt) {
            const duration = finishedAt.getTime() - created.getTime();
            if (duration >= 0) {
              bucket.durations.push(duration);
              allDurations.push(duration);
            }
          }

          if (finishedAt) {
            const day = finishedAt.toISOString().slice(0, 10);
            completedPerDay[day] = (completedPerDay[day] || 0) + 1;
          }
        } else {
          const deadline = deadlineOf(toDo);
          if (deadline && deadline.getTime() < now) {
            overdue += 1;
            listStat.overdue += 1;
          }
        }
      }

      const byPriority = {};
      for (const priority of PRIORITIES) {
        const bucket = buckets[priority];
        byPriority[priority] = {
          total: bucket.total,
          completed: bucket.completed,
          avgCompletionMs: average(bucket.durations),
        };
      }

      // Oldest -> newest, 7 entries.
      const completedLast7Days = [];
      for (let offset = 6; offset >= 0; offset -= 1) {
        const day = new Date(now - offset * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10);
        completedLast7Days.push({
          date: day,
          count: completedPerDay[day] || 0,
        });
      }

      // Per-list breakdown is only meaningful for the combined (no listId) view.
      let byList = [];
      if (!listId) {
        const lists = await ToDoList.find({
          userId: req.user._id,
          deleted: false,
        }).lean();

        byList = lists
          .map((list) => {
            const stat = listStats.get(String(list._id)) || {
              total: 0,
              completed: 0,
              overdue: 0,
            };
            return {
              listId: String(list._id),
              name: list.name || "",
              ...stat,
            };
          })
          .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
      }

      res.json({
        totals: {
          total: toDos.length,
          completed,
          active: toDos.length - completed,
          overdue,
          completionRate: toDos.length ? completed / toDos.length : 0,
        },
        byPriority,
        byList,
        avgCompletionMs: average(allDurations),
        completedLast7Days,
      });
    } catch (err) {
      console.error("analytics failed: ", err);
      res.status(500).json({ error: "Failed to compute analytics" });
    }
  });
};
