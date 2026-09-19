local displayedScore = 0
local lerpSpeed = 5 


function onCreatePost()
    makeAnimatedLuaSprite('gfStereo', 'stereo', 0,0)
    addAnimationByPrefix('gfStereo', 'idle', 'stereo boom', 24, true)
    objectPlayAnimation('gfStereo', 'idle', true)
    setScrollFactor('gfStereo', 1, 1)
    scaleObject('gfStereo', 1, 1)
    addLuaSprite('gfStereo', false)
    
    setProperty('gfStereo.x', getProperty('gfGroup.x')-150)
    setProperty('gfStereo.y', getProperty('gfGroup.y')+410)
    
    if gfName == 'gf-cruc-redux' then
    setProperty('gfStereo.visible', false)
    end
    if gfName == 'nene-redux' then
    setProperty('gfStereo.visible', false)
    end
    
    makeLuaSprite('healthBarBG_1', 'ui/hud/normal/Healthbar')
    setObjectCamera('healthBarBG_1', 'camHUD')
    addLuaSprite('healthBarBG_1', false)
    setProperty('healthBarBG_1.x', getProperty('healthBar.x')-41)
    setProperty('healthBarBG_1.y', getProperty('healthBar.y')-39)
    setObjectOrder('healthBarBG_1', getObjectOrder('healthBar')+1)
    scaleObject('healthBarBG_1',0.5, 0.5);
    
    
    setObjectOrder('healthBar', 15)
    setObjectOrder('healthBarBG_1', 35)
    setObjectOrder('iconP1', 36)
    setObjectOrder('iconP2', 37)
    setObjectOrder('scoreTxt', 40)
    setProperty('healthBar.scale.y', 2.5)
    setProperty('healthBar.scale.x', 1.02)
    
    makeLuaSprite('timerBackdrop', 'ui/hud/normal/TimerBackdrop')
    setObjectCamera('timerBackdrop', 'camHUD')
    addLuaSprite('timerBackdrop', false)
    
    screenCenter('timerBackdrop')
   setProperty('timerBackdrop.x', 555)
    setProperty('timerBackdrop.y', downscroll and 660 or 5)
    scaleObject('timerBackdrop',0.5, 0.5);
    setObjectCamera('timerBackdrop','camHUD')
    setTextBorder('timeTxt', 0, '002eaf')
    setTextColor('timeTxt', '002eaf')

if songName == 'Manifest' then
    makeLuaSprite('healthBarBG_1', 'ui/hud/manifest/MF_Healthbar')
    setObjectCamera('healthBarBG_1', 'camHUD')
    addLuaSprite('healthBarBG_1', false)
    setProperty('healthBarBG_1.x', getProperty('healthBar.x')-40)
    setProperty('healthBarBG_1.y', getProperty('healthBar.y')-28)
    setObjectOrder('healthBarBG_1', getObjectOrder('healthBar')+1)
    scaleObject('healthBarBG_1',0.5, 0.5);
  
  setObjectOrder('healthBar', 15)
    setObjectOrder('healthBarBG_1', 35)
    setObjectOrder('iconP1', 36)
    setObjectOrder('iconP2', 37)
    setObjectOrder('scoreTxt', 40)
    setProperty('healthBar.scale.y', 2.5)
    setProperty('healthBar.scale.x', 1.02)
    
    
    makeLuaSprite('timerBackdrop', 'ui/hud/manifest/MF_TimerBackdrop')
    setObjectCamera('timerBackdrop', 'camHUD')
    addLuaSprite('timerBackdrop', false)
    
    screenCenter('timerBackdrop')
   setProperty('timerBackdrop.x', 555)
    setProperty('timerBackdrop.y', downscroll and 660 or 5)
    scaleObject('timerBackdrop',0.5, 0.5);
    setObjectCamera('timerBackdrop','camHUD')
    setTextBorder('timeTxt', 0, '002eaf')
    setTextColor('timeTxt', 'FFFFFF')
   end 
    
    
    
    setObjectOrder('noteGroup', getObjectOrder('uiGroup') + 10)
    setTextFont('timeTxt','Planet-Joy.ttf')
    setTextSize('timeTxt', 35)
    
    setProperty('timeBar.visible', false)
    setProperty('timeBarBG.visible', false)
    setProperty('healthBar.bg.visible', false)
    
    setPropertyFromClass('lime.app.Application', 'current.window.title', "Friday Night Funkin'")
    posY = downscroll and 115 or 685
end

function onCreate()

addLuaScript('characters/Characters/MOBILEHUD1')
addLuaScript('characters/Characters/MOBILEHUD2')
addLuaScript('characters/Characters/MOBILEHUD3')
addHScript('characters/Characters/MOBILEHUD4')

    makeLuaText("ScorCount", "Score: 0", 0, 750, 675)
    setTextSize("ScorCount", 16)
    setTextFont('ScorCount','Planet-Joy.ttf')
    
    setTextBorder('ScorCount', 1, '002faf')
    
    setObjectCamera("ScorCount", 'camHUD')
    setTextColor('ScorCount', 'ffffff')
    addLuaText("ScorCount", true)
    
    if songName == 'Manifest' then
    setTextBorder('ScorCount', 1, 'FF0008')
    end
end

function onUpdate(elapsed)

    for i = 0, getProperty('notes.length') - 1 do
        if getSongPosition() > getPropertyFromGroup('notes', i, 'strumTime') + 40 and getPropertyFromGroup('notes', i, 'mustPress') == true then
            local noteData = getPropertyFromGroup('notes', i, 'noteData')
            setPropertyFromGroup('notes', i, 'color', getColorFromHex('404040')) 
        end
end
    setObjectOrder('ScorCount', getObjectOrder('iconP1') + 15)
    setProperty('ScorCount.y', posY)
    
    setProperty('scoreTxt.visible', false)
    setProperty('ScorCount.alpha', getProperty('scoreTxt.alpha'))
    setProperty('timerBackdrop.alpha', getProperty('timeTxt.alpha'))
    displayedScore = lerp(displayedScore, score, lerpSpeed * elapsed)
    setTextString('ScorCount', 'Score: ' .. formatNumber(math.floor(displayedScore)))
    
    
    setHealthBarColors('FF0000', '66FF33')
    
    if songName == 'Manifest' then
    setHealthBarColors('FF0000', 'FFFFFF')
    end
end

function lerp(a, b, t)
    return a + (b - a) * t
end

function getColorFromHex(hex)
    hex = hex:gsub("#", "")
    return tonumber(hex, 16)
end

function formatNumber(n)
    local formatted = tostring(n)
    local k
    while true do
        formatted, k = formatted:gsub("^(-?%d+)(%d%d%d)", '%1,%2')
        if k == 0 then
            break
        end
    end
    return formatted
end

function onUpdateScore(miss)
    if miss then
       playSound('missnote'..getRandomInt(1, 3), 0.45)
    end
end

