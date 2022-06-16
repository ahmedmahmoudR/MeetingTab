import { find, sortBy } from "lodash";

const axios = require("axios");
const querystring = require("querystring");
const {
	TeamsActivityHandler,
	CardFactory,
	MessageFactory,
	MessagingExtensionAction,
	MessagingExtensionActionResponse,
	TurnContext,
	MessagingExtensionAttachment,
} = require("botbuilder");

class MessageExtensionBot extends TeamsActivityHandler {
	// Messaging extension Code
	// Action.

	// Search.
	async handleTeamsMessagingExtensionQuery(context, query) {
		const searchQuery = query.parameters[0].value;
		const response = await axios.get(
			`http://registry.npmjs.com/-/v1/search?${querystring.stringify({
				text: searchQuery,
				size: 8,
			})}`,
		);

		const attachments = [];
		response.data.objects.forEach((obj) => {
			const heroCard = CardFactory.heroCard(obj.package.name);
			const preview = CardFactory.heroCard(obj.package.name);
			preview.content.tap = {
				type: "invoke",
				value: {
					name: obj.package.name,
					description: obj.package.description,
				},
			};
			const attachment = { ...heroCard, preview };
			attachments.push(attachment);
		});

		return {
			composeExtension: {
				type: "result",
				attachmentLayout: "list",
				attachments: attachments,
			},
		};
	}

	async handleTeamsMessagingExtensionSelectItem(context, obj) {
		return {
			composeExtension: {
				type: "result",
				attachmentLayout: "list",
				attachments: [CardFactory.heroCard(obj.name, obj.description)],
			},
		};
	}

	// Link Unfurling.
	handleTeamsAppBasedLinkQuery(context, query) {
		const attachment = CardFactory.thumbnailCard(
			"Thumbnail Card",
			query.url,
			[query.url],
		);

		const result = {
			attachmentLayout: "list",
			type: "result",
			attachments: [attachment],
		};

		const response = {
			composeExtension: result,
		};
		return response;
	}

	async handleTeamsMessagingExtensionFetchTask(context, action) {
		const planets = require("./planets.json");
		const sortedPlanets = sortBy(planets, ["id"]).map((planet) => {
			return { value: planet.id, title: planet.name };
		});
		const adaptiveCardSource = require("./planetSelectorCard.json");
		const planetChoiceSet = find(adaptiveCardSource.body, {
			id: "planetSelector",
		});
		planetChoiceSet.choices = sortedPlanets;

		const adaptiveCard = CardFactory.adaptiveCard(adaptiveCardSource);

		const response = {
			task: {
				type: "continue",
				value: {
					card: adaptiveCard,
					title: "Planet Selector",
					height: 150,
					width: 500,
				},
			},
		};
		return Promise.resolve(response);
	}
	handleTeamsMessagingExtensionSubmitAction(context, action) {
		switch (action.commandId) {
			case "planetExpanderAction": {
				// load planets
				const planets = require("./planets.json");
				// get the selected planet
				const selectedPlanet = planets.filter(
					(planet) => planet.id === action.data.planetSelector,
				)[0];
				const adaptiveCard = this.getPlanetDetailCard(selectedPlanet);

				// generate the responses
				return Promise.resolve({
					composeExtension: {
						type: "result",
						attachmentLayout: "list",
						attachments: [adaptiveCard],
					},
				});
			}
			default:
				throw new Error("NotImplemented");
		}
	}
	getPlanetDetailCard(selectedPlanet) {
		// load display card
		const adaptiveCardSource = require("./planetDisplayCard.json");

		// update planet fields in display card
		adaptiveCardSource.actions[0].url = selectedPlanet.wikiLink;
		find(adaptiveCardSource.body, { id: "cardHeader" }).items[0].text =
			selectedPlanet.name;
		const cardBody = find(adaptiveCardSource.body, { id: "cardBody" });
		find(cardBody.items, { id: "planetSummary" }).text =
			selectedPlanet.summary;
		find(cardBody.items, { id: "imageAttribution" }).text =
			"*Image attribution: " + selectedPlanet.imageAlt + "*";
		const cardDetails = find(cardBody.items, { id: "planetDetails" });
		cardDetails.columns[0].items[0].url = selectedPlanet.imageLink;
		find(cardDetails.columns[1].items[0].facts, {
			id: "orderFromSun",
		}).value = selectedPlanet.id;
		find(cardDetails.columns[1].items[0].facts, {
			id: "planetNumSatellites",
		}).value = selectedPlanet.numSatellites;
		find(cardDetails.columns[1].items[0].facts, {
			id: "solarOrbitYears",
		}).value = selectedPlanet.solarOrbitYears;
		find(cardDetails.columns[1].items[0].facts, {
			id: "solarOrbitAvgDistanceKm",
		}).value = Number(
			selectedPlanet.solarOrbitAvgDistanceKm,
		).toLocaleString();

		// return the adaptive card
		return CardFactory.adaptiveCard(adaptiveCardSource);
	}
}

function createCardCommand(context, action) {
	// The user has chosen to create a card by choosing the 'Create Card' context menu command.
	const data = action.data;
	const heroCard = CardFactory.heroCard(data.title, data.text);
	heroCard.content.subtitle = data.subTitle;
	const attachment = {
		contentType: heroCard.contentType,
		content: heroCard.content,
		preview: heroCard,
	};

	return {
		composeExtension: {
			type: "result",
			attachmentLayout: "list",
			attachments: [attachment],
		},
	};
}

function createTask(context, action) {}

async function staticHtmlPage() {
	return {
		task: {
			type: "message",
			value: {
				width: 450,
				height: 125,
				title: "Task module Static HTML",
				url: "",
			},
		},
	};
}

function shareMessageCommand(context, action) {
	// The user has chosen to share a message by choosing the 'Share Message' context menu command.
	let userName = "unknown";
	if (
		action.messagePayload &&
		action.messagePayload.from &&
		action.messagePayload.from.user &&
		action.messagePayload.from.user.displayName
	) {
		userName = action.messagePayload.from.user.displayName;
	}

	// This Messaging Extension example allows the user to check a box to include an image with the
	// shared message.  This demonstrates sending custom parameters along with the message payload.
	let images = [];
	const includeImage = action.data.includeImage;
	if (includeImage === "true") {
		images = [
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtB3AwMUeNoq4gUBGe6Ocj8kyh3bXa9ZbV7u1fVKQoyKFHdkqU",
		];
	}
	const heroCard = CardFactory.heroCard(
		`${userName} originally sent this message:`,
		action.messagePayload.body.content,
		images,
	);

	if (
		action.messagePayload &&
		action.messagePayload.attachment &&
		action.messagePayload.attachments.length > 0
	) {
		// This sample does not add the MessagePayload Attachments.  This is left as an
		// exercise for the user.
		heroCard.content.subtitle = `(${action.messagePayload.attachments.length} Attachments not included)`;
	}

	const attachment = {
		contentType: heroCard.contentType,
		content: heroCard.content,
		preview: heroCard,
	};

	return {
		composeExtension: {
			type: "result",
			attachmentLayout: "list",
			attachments: [attachment],
		},
	};
}

module.exports.MessageExtensionBot = MessageExtensionBot;
