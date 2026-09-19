local NORMAL_FADE_TIME = 3.5
local LONG_FADE_TIME = 25

local cleanProps = {'rightSide','leftSide','backBuilding'}
local messyProps = {'leftSideMad','rightSideMad','backBuildingMad'}


function onCreatePost()
    
    makeAnimatedLuaSprite('picoBubble', 'pico_bubble',0,0)
    addAnimationByPrefix('picoBubble', 'loop', 'loop', 24, true)
    addAnimationByPrefix('picoBubble', 'enter', 'bubble', 24, false)
    setProperty('picoBubble.visible', false)
    addLuaSprite('picoBubble', true)

    makeAnimatedLuaSprite('skyBubble', 'sky_bubble',0,0)
    addAnimationByPrefix('skyBubble', 'loop', 'loop', 24, true)
    addAnimationByPrefix('skyBubble', 'enter', 'bubble', 24, false)
    setProperty('skyBubble.visible', false)
    addLuaSprite('skyBubble', true)
    
    setProperty('picoBubble.x', getProperty('boyfriendGroup.x')+75)
    setProperty('picoBubble.y', getProperty('boyfriendGroup.y')-150)
    
    
    setProperty('skyBubble.x', getProperty('boyfriendGroup.x')+75)
    setProperty('skyBubble.y', getProperty('boyfriendGroup.y')-150)
end

function onBeatHit()
    if curBeat == 190 then
        messyBGFade(true)
       
    end

    if curBeat == 320 then
        messyBGFade(false)
    end

    if curBeat == 390 then
        dramaticFadeOut()
    end

    if curBeat == 392 then
        setProperty('picoBubble.visible', true)
        playAnim('picoBubble', 'enter', true)
        playAnim('gf', 'glare transition')
    end

    if curBeat == 414 then
        doTweenAlpha('picoBubbleFade', 'picoBubble', 0, 1.5, 'sineInOut')
    end

    if curBeat == 418 then
        setProperty('skyBubble.visible', true)
        playAnim('skyBubble', 'enter', true)
    end

    if curBeat == 455 then
        doTweenAlpha('skyBubbleFade', 'skyBubble', 0, 1.5, 'sineInOut')
    end
end

function messyBGFade(state)
    for i = 1, #cleanProps do
        doTweenAlpha('cleanFade'..i, cleanProps[i], state and 0 or 1, NORMAL_FADE_TIME, 'circInOut')
    end
    for i = 1, #messyProps do
        doTweenAlpha('messyFade'..i, messyProps[i], state and 1 or 0, NORMAL_FADE_TIME, 'circInOut')
    end
end


function dramaticFadeOut()
    for i = 1, #cleanProps do
        doTweenAlpha('dramaticFade'..i, cleanProps[i], 0, LONG_FADE_TIME, 'quadOut')
    end
end