import React, { useEffect, useState, useCallback } from "react";

import {
	Grid,
	Flex,
	Text,
	Loader,
	Button,
	AddIcon,
} from "@fluentui/react-northstar";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import useMyPlanner from "../hooks/useMyPlanner";
import CreateTask from "./create-task/create-task.component";
import Task from "./task/task.component";
import columnsFromBackend from "./utils/columnsFromBackend";

const PlannerTasks = () => {
	const { data, loading, error, getPlanTasks } = useMyPlanner();
	const {
		data: updateData,
		loading: updateLoading,
		error: updateError,
		updateTasks,
	} = useMyPlanner();

	const {
		data: bucketsData,
		loading: bucketsLoading,
		error: bucketsError,
		getPlanBuckets,
	} = useMyPlanner();
	const [planTasks, setPlanTasks] = useState([]);
	const { createTask } = useMyPlanner();
	const planId = "poLNKmZno0a1Y736cz4t3mUAATv6";
	const [tasksColumns, setTasksColumns] = useState(columnsFromBackend);

	const handleAddTask = useCallback(
		(columnId) => {
			const selectedColumn = tasksColumns[columnId];
			setTasksColumns({
				...tasksColumns,
				[columnId]: {
					...selectedColumn,
					isAdding: !selectedColumn.isAdding,
				},
			});
		},
		[tasksColumns],
	);

	const handleSubmitTask = (taskData, columnId) => {
		createTask({
			title: taskData.title,
			dueDateTime: taskData.dueDateTime,
			assignments: taskData.assignments,
			planId: "poLNKmZno0a1Y736cz4t3mUAATv6",
		});
		tasksColumns[columnId].isAdding = false;
	};

	const onDragEnd = useCallback(
		(result, columns) => {
			if (!result.destination) return;
			const { source, destination } = result;
			if (source.droppableId !== destination.droppableId) {
				const sourceColumn = columns[source.droppableId];
				const destColumn = columns[destination.droppableId];
				const sourceItems = [...sourceColumn.items];
				const destItems = [...destColumn.items];
				const [removed] = sourceItems.splice(source.index, 1);

				destItems.splice(destination.index, 0, removed);
				setTasksColumns({
					...columns,
					[source.droppableId]: {
						...sourceColumn,
						items: sourceItems,
					},
					[destination.droppableId]: {
						...destColumn,
						items: destItems,
					},
				});
				let taskUpdate;
				switch (destColumn.name) {
					case "Not Started":
						taskUpdate = { percentComplete: 0 };
						break;
					case "In Progress":
						taskUpdate = { percentComplete: 50 };
						break;
					case "Closed":
						taskUpdate = { percentComplete: 100 };
						break;
					default:
						return;
				}
				updateTasks(taskUpdate, removed.id, removed["@odata.etag"]);
			} else {
				const column = columns[source.droppableId];
				const copiedItems = [...column.items];
				const [removed] = copiedItems.splice(source.index, 1);
				copiedItems.splice(destination.index, 0, removed);
				setTasksColumns({
					...columns,
					[source.droppableId]: {
						...column,
						items: copiedItems,
					},
				});
			}
		},
		[updateTasks],
	);

	useEffect(() => {
		getPlanTasks(planId);
		getPlanBuckets(planId);
	}, [getPlanTasks, getPlanBuckets]);
	useEffect(() => {
		if (!loading && data) {
			const colOne = data.tasks.value.filter(
				(task) => task.percentComplete === 0,
			);
			const colTwo = data.tasks.value.filter(
				(task) =>
					100 > task.percentComplete && task.percentComplete >= 50,
			);
			const colThree = data.tasks.value.filter(
				(task) => task.percentComplete === 100,
			);
			setTasksColumns({
				1: { name: "Not Started", items: colOne, isAdding: false },
				2: { name: "In Progress", items: colTwo, isAdding: false },
				3: { name: "Closed", items: colThree, isAdding: false },
			});
		}
	}, [data, loading, bucketsData]);
	return (
		<>
			{loading && <Loader />}

			{!loading && error && (
				<div className='error'>
					Unable to read Tasks. <br /> Details: {error.toString()}
				</div>
			)}

			{!loading && !error && (
				<Grid
					columns='repeat(3, 1fr)'
					rows='555px'
					styles={{ gridColumn: "span 3" }}
				>
					<DragDropContext
						onDragEnd={(result) => onDragEnd(result, tasksColumns)}
					>
						{Object.entries(tasksColumns).map(([id, column]) => {
							return (
								<Flex
									key={id}
									column
									hAlign='center'
									style={{
										maxHeight: "87vh",
										overflow: "auto",
									}}
								>
									<Text
										size='medium'
										weight='bold'
										content={column.name}
										style={{ marginTop: "10px" }}
									/>

									<div
										style={{
											minWidth: "100%",
											height: "100%",
											borderStyle: "solid",
											borderColor: "#DDD",
											borderWidth: "0 1px 0 1px",
										}}
									>
										<Droppable droppableId={id} key={id}>
											{(provided, snapshot) => {
												return (
													<div
														{...provided.droppableProps}
														ref={provided.innerRef}
														style={{
															backgroundColor:
																"none",
															padding: "20px",
															boxShadow:
																"0 0 0px 0",
														}}
													>
														<Button
															fluid
															styles={{
																marginBottom:
																	"10px",
															}}
															onClick={() => {
																handleAddTask(
																	id,
																);
															}}
															icon={<AddIcon />}
														/>
														{tasksColumns[id]
															.isAdding && (
															<CreateTask
																buckets={
																	bucketsData.buckets
																}
																bucketsLoading={
																	bucketsLoading
																}
																bucketsError={
																	bucketsError
																}
																columnId={id}
																handleSubmitTask={
																	handleSubmitTask
																}
																planId={planId}
															/>
														)}
														{column.items.map(
															(item, index) => {
																return (
																	<Draggable
																		key={
																			item.id
																		}
																		draggableId={
																			item.id
																		}
																		index={
																			index
																		}
																	>
																		{(
																			provided,
																			snapshot,
																		) => {
																			return (
																				<div
																					ref={
																						provided.innerRef
																					}
																					{...provided.draggableProps}
																					{...provided.dragHandleProps}
																					style={{
																						userSelect:
																							"none",
																						padding: 4,

																						color: "white",
																						...provided
																							.draggableProps
																							.style,
																					}}
																				>
																					<Task
																						key={
																							item.id
																						}
																						assignments={
																							item.assignments
																						}
																						{...item}
																					/>
																				</div>
																			);
																		}}
																	</Draggable>
																);
															},
														)}
														{provided.placeholder}
													</div>
												);
											}}
										</Droppable>
									</div>
								</Flex>
							);
						})}
					</DragDropContext>
				</Grid>
			)}
		</>
	);
};

export default PlannerTasks;
