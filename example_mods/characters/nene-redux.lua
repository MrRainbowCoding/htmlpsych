function onCreatePost()
makeLuaSprite('post', nil)

makeLuaSprite('backSpeaker', 'characters/NENE/aBotQt/stereoBG', 0, 0)
addLuaSprite('backSpeaker', false)

makeLuaSprite("whiteEye", nil, 0, 0)
makeGraphic("whiteEye", 100, 100, "0xFFFFFFFF")
addLuaSprite("whiteEye", false)

makeFlxAnimateSprite('speakerEyes', 0, 0, 'characters/NENE/aBotQt/systemEyes')
addLuaSprite('speakerEyes', false) 
addAnimationBySymbol('speakerEyes', 'staticLeft', 'a bot eyes lookin0018', 0, true)
addAnimationBySymbol('speakerEyes', 'staticRight', 'a bot eyes lookin0000', 0, true)
addAnimationBySymbolIndices('speakerEyes', 'left', 'a bot eyes lookin', '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18', 24, false)
addAnimationBySymbolIndices('speakerEyes', 'right', 'a bot eyes lookin', '18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0', 24, false)
addAnimationBySymbolIndices('speakerEyes', 'left2', 'a bot eyes lookin', '0', 24, false)
addAnimationBySymbolIndices('speakerEyes', 'right2', 'a bot eyes lookin', '18', 24, false)
playAnim('speakerEyes', 'right2')

for i = 1,7 do
makeAnimatedLuaSprite('viz'..i, 'characters/NENE/aBotQt/aBotViz', 0, 0)
addLuaSprite('viz'..i, false)
addAnimationByIndices('viz'..i, '2', 'viz'..i..'', '2,3,4,5', 24, false)
addAnimationByIndices('viz'..i, '3', 'viz'..i..'', '3,4,5', 24, false)
addAnimationByIndices('viz'..i, '4', 'viz'..i..'', '4,5', 24, false)
addAnimationByPrefix('viz'..i, '5', 'viz'..i..'', 24, false)
addAnimationByPrefix('viz'..i, '6', 'viz'..i..'0005', 24, false)
scaleObject('viz'..i, 0.9, 0.9)
end

makeFlxAnimateSprite('speaker', 0, 0, 'characters/NENE/aBotQt/abotSystem')
addLuaSprite('speaker', false) 
addAnimationBySymbol('speaker', 'i', 'Abot System', 24, true)
end

function speakerMove(omg)
if omg == 'dad' then
playAnim('speakerEyes', 'right2')
end
if omg == 'bf' then
playAnim('speakerEyes', 'left2')
end
end

function onSectionHit()
speakerMove(mustHitSection and 'bf' or 'dad')
end

function onBeatHit()
playAnim('viz5', getRandomInt(2, 5))
playAnim('viz4', getRandomInt(2, 5))
if curBeat % 2 == 0 then
playAnim('viz3', getRandomInt(2, 5))
playAnim('viz6', getRandomInt(2, 5))
end
if curBeat % 3 == 0 then
playAnim('viz2', getRandomInt(2, 5))
playAnim('viz7', getRandomInt(2, 5))
end
if curBeat % 1 == 0 then
playAnim('viz1', getRandomInt(2, 5))
end
end

function onUpdatePost()
setProperty('post.y', getProperty('gfGroup.y') + 340)
setProperty('post.x', getProperty('gfGroup.x') - 250)

local pX = getProperty('post.x')
local pY = getProperty('post.y')

callMethod('speaker.setPosition', {pX, pY})
setProperty('backSpeaker.y', pY + 45)
setProperty('backSpeaker.x', pX + 170)
for i = 1,7 do
setProperty('viz'..i..'.y', pY + 90)
setProperty('viz'..i..'.x', pX + 135 + i * 60)
end
setProperty('speakerEyes.y', pY + 240)
setProperty('speakerEyes.x', pX + 60)
setProperty('whiteEye.y', pY + 200)
setProperty('whiteEye.x', pX + 50)
end