import React, { useState, useEffect, useCallback } from "react";
import {
	Button,
	Flex,
	Card,
	Layout,
	Box,
	Input,
	Dropdown,
	Datepicker,
	DayOfWeek,
} from "@fluentui/react-northstar";

import {
	CalendarIcon,
	AddIcon,
	GalleryNewLargeIcon,
	ParticipantAddIcon,
} from "@fluentui/react-icons-northstar";

import useGroups from "../../hooks/useGroups";
import { useMyGraph } from "../../hooks/useMyGraph";

const TaskCard = ({
	status,
	handleSubmitTask,
	buckets,
	bucketsLoading,
	bucketsError,
	columnId,
}) => {
	const groupId = "002524f7-633d-4eac-a4dd-55b433a98db2";
	const {
		loading: groupLoading,
		error: groupError,
		data: groupData,
	} = useGroups(groupId, "get");
	const { loading, data, error, sendGraphRequest } = useMyGraph();

	const [groupMembers, setGroupMembers] = useState([]);
	const [bucketsList, setBucketsList] = useState([]);
	const [selectedAssignees, setSelectedAssignees] = useState([]);

	const getMembersPhotos = useCallback(() => {
		if (!groupLoading && groupData) {
			const members = groupData.members.value;
			const memberItems = members.map((member) => {
				sendGraphRequest(
					async (graph) => {
						let photoUrl = "";
						try {
							const photo = await graph
								.api(`/users/${member.id}/photo/$value`)
								.get();
							photoUrl = URL.createObjectURL(photo);
						} catch (error) {
							console.log(error);
						}

						return { photoUrl };
					},
					{
						scope: ["User.Read"],
					},
				);

				return {
					header: member.displayName,
					content: member.jobTitle,
					id: member.id,
					image: data,
				};
			});
			setGroupMembers(memberItems);
		}
	}, [groupLoading, sendGraphRequest]);

	useEffect(() => {
		getMembersPhotos();

		if (!bucketsLoading) {
			const newBucketsList = buckets.value.map(
				(bucket) => ({ header: bucket.name, content: bucket.id }),
				// Id: bucket.id,
			);
			setBucketsList(newBucketsList);
		}
	}, [getMembersPhotos, buckets, bucketsLoading]);

	const [taskData, setTaskData] = useState({
		title: "",
		bucketId: "",
		percentComplete: 0,
		dueDateTime: "",
		planId: "",
		assignments: {},
	});

	const getA11ySelectionMessage = {
		onAdd: (item) =>
			`${item.header} selected. Press left or right arrow keys to navigate selected items.`,
		onRemove: (item) => `${item.header} has been removed.`,
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setTaskData({
			...taskData,
			[name]: value,
		});
	};
	const handleDateChange = (e, { value }) => {
		setTaskData({
			...taskData,
			dueDateTime: value,
		});
	};
	const handleAssigneeChange = (e, { value }) => {
		let obj = {};

		setSelectedAssignees(value);
		value.forEach((assignee) => {
			obj[assignee.id] = {
				"@odata.type": "#microsoft.graph.plannerAssignment",
				orderHint: " !",
			};
		});
		setTaskData({
			...taskData,
			assignments: { ...taskData.assignments, ...obj },
		});
	};
	return (
		<Card
			fluid
			styles={{ padding: 0 }}
			aria-roledescription='card with avatar, image and action buttons'
		>
			<Card.Header styles={{ padding: "15px", width: "100%" }}>
				<Flex gap='gap.small' column styles={{ width: "100%" }}>
					<Input
						value={taskData.title}
						name='title'
						onChange={handleChange}
						fluid
						placeholder='Enter a task name'
					/>
					<Flex
						vAlign='center'
						gap='gap.small'
						styles={{ width: "100%" }}
						wrap
					>
						<Flex.Item grow={1}>
							<GalleryNewLargeIcon outline />
						</Flex.Item>
						<Flex.Item grow={11}>
							<Dropdown
								loading={bucketsLoading}
								items={bucketsList}
								fluid
							/>
						</Flex.Item>
					</Flex>
					<Flex
						vAlign='center'
						gap='gap.small'
						styles={{ width: "100%" }}
						wrap
					>
						<Flex.Item grow={1}>
							<CalendarIcon outline />
						</Flex.Item>
						<Flex.Item grow={11}>
							<Datepicker
								firstDayOfWeek={DayOfWeek.Sunday}
								inputOnly
								name='dueDateTime'
								value={taskData.dueDateTime}
								onDateChange={handleDateChange}
							/>
						</Flex.Item>
					</Flex>
					<Flex
						vAlign='center'
						gap='gap.small'
						styles={{ width: "100%" }}
						wrap
					>
						<Flex.Item grow={1}>
							<ParticipantAddIcon outline />
						</Flex.Item>
						<Flex.Item grow={11}>
							<Dropdown
								multiple
								fluid
								search
								items={!loading && data && groupMembers}
								value={selectedAssignees}
								name='assignments'
								error={groupError || error}
								loading={groupLoading || loading}
								loadingMessage='Loading...'
								placeholder='Assign to..'
								getA11ySelectionMessage={
									getA11ySelectionMessage
								}
								getA11yStatusMessage={({
									resultCount,
									previousResultCount,
								}) => {
									if (loading) {
										return "loading results";
									}

									if (!resultCount) {
										return "No results are available.";
									}

									if (resultCount !== previousResultCount) {
										return `${resultCount} result${
											resultCount === 1 ? " is" : "s are"
										} available, use up and down arrow keys to navigate. Press Enter key to select.`;
									}

									return "";
								}}
								noResultsMessage="We couldn't find any matches."
								a11ySelectedItemsMessage='Press Delete or Backspace to remove'
								onChange={handleAssigneeChange}
							/>
						</Flex.Item>
					</Flex>
				</Flex>
			</Card.Header>
			<Button
				iconPosition='before'
				icon={<AddIcon />}
				content='Add task'
				fluid
				onClick={() => handleSubmitTask(taskData, columnId)}
				styles={{
					backgroundColor: "#5b5fc7",
					color: "white",
					height: "40px",
				}}
			/>
		</Card>
	);
};

const CreateTask = ({
	buckets,
	bucketsLoading,
	bucketsError,
	columnId,
	handleSubmitTask,
	loading,
	error,
}) => {
	return (
		<Box style={{ cursor: "pointer" }}>
			<Layout
				styles={{
					maxWidth: "400px",
				}}
				renderMainArea={() => (
					<TaskCard
						buckets={buckets}
						bucketsLoading={bucketsLoading}
						bucketsError={bucketsError}
						columnId={columnId}
						handleSubmitTask={handleSubmitTask}
					/>
				)}
			/>
		</Box>
	);
};

export default CreateTask;
