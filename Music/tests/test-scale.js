const {Scale, Pitch, Key} = require('../Composition.js');

let scale = new Scale();
console.log(scale.toString());

let fMin = Scale.fromString('f minor');
console.log(fMin.toString());

fMin.transpose(-2);
console.log(fMin.toString());

console.log('\nEntire Eb minor family:')
console.log(fMin.family.toString()); 

console.log('\nTen random notes from Eb minor:');
console.log(fMin.randomPitches(10).toString());

console.log('\n24 random notes from Eb minor between Ab3 and F5:');
console.log(fMin.randomBetween('Ab3', 'F5', 24).toString());

let custom = new Scale({
	mode: 'custom', 
	members: 'A4 B4 C#5 D#5 F5 G#5'.split(' ').map(p => Pitch.fromString(p))
});
console.log('\nCustom scale:');
console.log(custom.members.toString());
console.log('\nRandoms from that scale:')
console.log(custom.randomMembers(24).toString());


