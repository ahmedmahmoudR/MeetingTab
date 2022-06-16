import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { TextArea, Loader } from "@fluentui/react-northstar";
import { useMyGraph } from "../hooks/useMyGraph";

const Notes = ({ groupId }) => {
	const { data, error, loading, sendGraphRequest } = useMyGraph();
	const {
		data: updateResponse,
		error: updateError,
		loading: updateLoading,
		sendGraphRequest: updatePage,
	} = useMyGraph();
	const [value, setValue] = useState("");
	const pageId =
		"1-222a38de521b438d87b7b37223e144a8!14-ccc8fd83-6a7c-4fea-95c8-40b7e8717117";
	const updateOneNotePage = (e) => {
		const { value } = e?.target;
		setValue(value);
		updatePage(async (graph) => {
			await graph
				.api(
					`groups/${groupId}/onenote/pages/${pageId}/content?includeIDs=true`,
				)
				.patch([
					{
						target: data.pageContent.body.childNodes[1]
							.childNodes[1].id,
						action: "replace",
						position: "after",
						content: value,
					},
				]);
		});
	};
	useEffect(() => {
		sendGraphRequest(
			async (graph) => {
				const pageContent = await graph
					.api(
						`/groups/${groupId}/onenote/pages/${pageId}/content?includeIDs=true`,
					)
					.get();
				return { pageContent };
			},
			{
				scope: [
					"User.Read",
					"Notes.Read",
					"Notes.Read.All",
					"Notes.ReadWrite",
					"Notes.ReadWrite.All",
					"Group.ReadWrite.All",
					"GroupMember.ReadWrite.All",
					"GroupMember.ReadWrite.All",
				],
			},
		);
	}, [sendGraphRequest, groupId]);
	useEffect(() => {
		if (!loading && data) {
			setValue(
				data.pageContent.body.childNodes[1].childNodes[1].innerHTML,
			);
		}
	}, [loading, data]);
	return (
		<>
			{loading && <Loader />}
			{!loading && error && <div>{error.toString()}</div>}
			{!loading && data && (
				<TextArea
					fluid
					onChange={updateOneNotePage}
					value={value}
					placeholder='Everyone in this team can add notes'
					styles={{
						borderRadius: "5px",
						margin: "10px 0",
						height: "60%",
					}}
				/>
			)}
			{/* (
				<div dangerouslySetInnerHTML={data.pageContent.all}></div> 
			)} */}
		</>
	);
};

export default Notes;
