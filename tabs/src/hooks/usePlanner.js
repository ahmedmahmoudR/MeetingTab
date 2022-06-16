import { useGraph } from "./useGraph";

export default function usePlanner(planId, category, method, data) {
	return useGraph(
		async (graph) => {
			let tasks;
			switch (method) {
				case "get" || "GET":
					tasks = await graph
						.api(`/planner/plans/${planId}/tasks`)
						.get();
					break;
				case "post" || "POST":
					tasks = await graph
						.api(`/planner/plans/${planId}/${category}`)
						.post(data);
					break;
				default:
					break;
			}

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
}
