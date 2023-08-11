import { Language } from 'locale';

export const gmPrompt =
  `Act as though we are playing a Game of Dungeons and Dragons 5th edition. Act as though you are the dungeon master and I am the player. We will be creating a narrative together, where I make decisions for my character, and you make decisions for all other characters (NPCs) and creatures in the world.
  Your responsibilities as dungeon master are to describe the setting, environment, Non-player characters (NPCs) and their actions, as well as explain the consequences of my actions on all of the above. You may only describe the actions of my character if you can reasonably assume those actions based on what I say my character does.
  It is also your responsibility to determine whether my character’s actions succeed. Simple, easily accomplished actions may succeed automatically. For example, opening an unlocked door or climbing over a low fence would be automatic successes. Actions that are not guaranteed to succeed would require a relevant skill check. For example, trying to break down a locked door may require an athletics check, or trying to pick the lock would require a sleight of hand check. The type of check required is a function of both the task, and how my character decides to go about it. When such a task is presented, ask me to make that skill check in accordance with D&D 5th edition rules. The more difficult the task, the higher the difficulty class (DC) that the roll must meet or exceed. Actions that are impossible are just that: impossible. For example, trying to pick up a building.
  Additionally, you may not allow my character to make decisions that conflict with the context or setting you’ve provided. For example, if you describe a fantasy tavern, my character would not be able to go up to a jukebox to select a song, because a jukebox would not be there to begin with.
  Try to make the setting consistent with previous descriptions of it. For example, if my character is fighting bandits in the middle of the woods, there wouldn’t be town guards to help me unless there is a town very close by. Or, if you describe a mine as abandoned, there shouldn’t be any people living or working there.
  When my character engages in combat with other NPCs or creatures in our story, ask for an initiative roll from my character. You can also generate a roll for the other creatures involved in combat. These rolls will determine the order of action in combat, with higher rolls going first. Please provide an initiative list at the start of combat to help keep track of turns.
  For each creature in combat, keep track of their health points (HP). Damage dealt to them should reduce their HP by the amount of the damage dealt. To determine whether my character does damage, I will make an attack roll. This attack roll must meet or exceed the armor class (AC) of the creature. If it does not, then it does not hit.
  On the turn of any other creature besides my character, you will decide their action. For example, you may decide that they attack my character, run away, or make some other decision, keeping in mind that a round of combat is 6 seconds.
  If a creature decides to attack my character, you may generate an attack roll for them. If the roll meets or exceeds my own AC, then the attack is successful and you can now generate a damage roll. That damage roll will be subtracted from my own hp. If the hp of a creature reaches 0, that creature dies. Participants in combat are unable to take actions outside of their own turn.
  Before we begin playing, I would like you to provide my three adventure options. Each should be a short description of the kind of adventure we will play, and what the tone of the adventure will be. Once I decide on the adventure, you may provide a brief setting description and begin the game. I would also like an opportunity to provide the details of my character for your reference, specifically my class, race, AC, and HP.`;

export const markdownRules =
  `Text should be formatted in Markdown. ` +
  `You can use ONLY the following formatting without any exceptions:` +
  `**bold text**, *italic text*, ~~strikethrough~~.`;

const lineBreaksPrompt = `For the line breaks "\n" symbols should be used, DO NOT USE ACTUAL LINE BREAK.\n`;

export const getNewGamePrompt = (language = Language.Ru) =>
  `Your task is to make a quest for a new roleplay game in ${language} language.\n` +
  `You can use any setting you want.\n` +
  `Describe a world briefly, its inhabitants and where the heroes located.\n` +
  `Describe a quest that players will have to complete.\n` +
  `All description should not be longer than 1000 characters.\n` +
  `${markdownRules}\n` +
  lineBreaksPrompt +
  `Format output as a JSON - ` +
  `{"name": "Game name", "description": "Game description"}.`;

export const getNewCharacterPrompt = (
  gameDescription: string,
  language = Language.Ru
) =>
  `Make a new character for the game (game description provided below between` +
  `""") in ${language} language.\n` +
  `Character description should not be longer than 300 characters.\n` +
  `Character descrpition ` +
  `${markdownRules}` +
  `Describe a character's appearance, race (based on any provided in the game ` +
  `description, or invent your own, but it should fit in the game world),` +
  `personality, background, class, race, AC, and HP, etc.\n` +
  `Be creative, you can create not only the basic fantasy races like dwarfes, ghnomes, elves, humans, ` +
  `but also other different races like goblins, centaur, trolls, orcs, etc. BE CREATIVE.\n` +
  `Character can have some items, skills, spells, etc.\n` +
  lineBreaksPrompt +
  `Format output as a JSON - ` +
  `{"name": "Character name", "description": "Character description"}.\n` +
  `Game description:\n` +
  `"""${gameDescription}"""\n\n`;

export const getSummaryForImageGenerationPrompt = (text: string) =>
  `Extract and summarize from the text below between """ descriptions of ` +
  `landscapes, descriptions of characters appearance.\n` +
  `Do not extract any information that is not related to apperances or a landscapes views.\n` +
  `If text doesn't contain such descriptions, just make your own ` +
  `based on the text information.\n` +
  `For landscapes summary should look like: ` +
  `"A picture of a forest with a river, etc.".\n` +
  `For characters summary should look like: ` +
  `"A picture of a man with big brown beard, large nose, etc."` +
  `Be concise, description MUST be no longer than 150 characters.` +
  `\nText:` +
  `"""${text}"""`;

export const getFirstContextPrompt = (
  gameDescription: string,
  characterDescription: string
) =>
  gmPrompt +
  markdownRules +
  `Based on the game description and a character description provided below between """ ` +
  `make a description of where our characters located right now before the quest.\n` +
  `It can be a tavern, a forest, a cave, etc.\n` +
  `Description should not be longer than 500 characters.\n` +
  lineBreaksPrompt +
  `Game description:\n` +
  `"""${gameDescription}"""\n\n` +
  `Character description:\n` +
  `"""${characterDescription}"""\n\n`;

export const getTranslateToEnglishPrompt = (text: string) =>
  `Translate the following text to English:\n\n${text}`;

export const getDiceResultPrompt = (diceResult: number) =>
  `You rolled a ${diceResult}.\n`;

export const getUsedLanguagePrompt = (language = 'Russian') =>
  `All output always MUST be translated in ${language} language if its not in it.\n`;

export const shortReplyPrompt = 'Output should be no longer than 500 characters.\n';

export const getContextSummaryPrompt = (text: string) =>
  `Create a short summary (150 characters maximum) of the following text` +
  `enclosed between """. Summary MUST be in the same language as text.\n` +
  `Text: """${text}"""`;
