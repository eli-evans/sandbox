const {Event, Note, Rest} = require('./Note.js');
const Articulation = require('./Articulation.js');
const Duration = require('./Duration.js');
const Dynamics = require('./Dynamics.js');
const Key = require('./Key.js');
const Pitch = require('./Pitch.js');
const Row = require('./Row.js');
const Scale = require('./Scale.js');
const Score = require('./Score.js');
const Sequence = require('./Sequence.js');
const Util = require('./Util.js');
const Voice = require('./Voice.js');

module.exports = {
	Articulation, Duration, Dynamics, Event, Key, Note, Pitch, 
	Rest, Row, Scale, Score, Sequence, Util, Voice, 
};