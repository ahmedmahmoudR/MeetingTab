import { useCallback } from "react";
import { useMyGraph } from "./useMyGraph";

function useMyPlanner() {
	const { data, error, loading, sendGraphRequest } = useMyGraph();
	const createTask = useCallback(
		(newTask) => {
			sendGraphRequest(
				async (graph) => {
					const task = await graph
						.api(`/planner/tasks`)
						.post(newTask);
					return { task };
				},
				{
					scope: [
						"User.Read",
						"Tasks.ReadWrite",
						"Tasks.Read",
						"Group.Read.All",
						"Group.ReadWrite.All",
					],
				},
			);
		},
		[sendGraphRequest],
	);
	const getPlanTasks = useCallback(
		(planId) => {
			sendGraphRequest(
				async (graph) => {
					const tasks = await graph
						.api(`/planner/plans/${planId}/tasks`)
						.get();
					return { tasks };
				},
				{
					scope: [
						"User.Read",
						"Tasks.ReadWrite",
						"Tasks.Read",
						"Group.Read.All",
						"Group.ReadWrite.All",
					],
				},
			);
		},
		[sendGraphRequest],
	);
	const updateTasks = useCallback(
		(newTask, id, eTag) => {
			sendGraphRequest(
				async (graph) => {
					const task = await graph
						.api(`/planner/tasks/${id}`)
						.header("If-Match", eTag)
						.update(newTask);
					return { task };
				},
				{
					scope: [
						"User.Read",
						"Tasks.ReadWrite",
						"Tasks.Read",
						"Group.Read.All",
						"Group.ReadWrite.All",
					],
				},
			);
		},
		[sendGraphRequest],
	);

	const getPlanBuckets = useCallback(
		(planId) => {
			sendGraphRequest(
				async (graph) => {
					const buckets = await graph
						.api(`/planner/plans/${planId}/buckets`)
						.get();
					return { buckets };
				},
				{
					scope: [
						"User.Read",
						"Tasks.ReadWrite",
						"Tasks.Read",
						"Group.Read.All",
						"Group.ReadWrite.All",
					],
				},
			);
		},
		[sendGraphRequest],
	);
	return {
		createTask,
		getPlanBuckets,
		updateTasks,
		getPlanTasks,
		data,
		error,
		loading,
	};
}
export default useMyPlanner;
