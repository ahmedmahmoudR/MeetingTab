import { useGraph } from "./useMyGraph";
export default function usePhoto(userId) {
	const { getCurrentData } = useGraph({
		scope: ["User.Read"],
	});
	const getPhoto = (userId, graph)=>
	async  {
		let photoUrl = "";
		try {
			const photo = await graph
				.api(`/users/${userId}/photo/$value`)
				.get();
			photoUrl = URL.createObjectURL(photo);
		} catch (error) {}
	}
	getCurrentData(async (graph) => {
		getPhoto(userId);

		return { photoUrl };
	});
	return { usePhoto, getPhoto };
}
