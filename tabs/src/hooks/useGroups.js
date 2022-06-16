import { useGraph } from "./useGraph";

export default function useGroups(groupId, method, data) {
	return useGraph(
		async (graph) => {
			let members;
			switch (method) {
				case "get" || "GET":
					members = await graph
						.api(`/groups/${groupId}/members?$count=true`)
						.get();
					break;
				// case "post" || "POST":
				// 	tasks = await graph
				// 		.api(`/planner/plans/${planId}/tasks`)
				// 		.post(data);
				// 	break;
				default:
					break;
			}

			return { members };
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
