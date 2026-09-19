local phase2Assets = {}
local phase1Assets = {}
local errorSprites = {'error1', 'error2', 'error3'}
local errorPositions = {}
local stageTime = 0


function onCreate()
    
    makeLuaSprite('shiftWall', 'stages/MANIFEST/1/Wall', -748, -500)
    setScrollFactor('shiftWall', 1, 1)
    scaleObject('shiftWall', 2.4, 2.4)
    setProperty('shiftWall.alpha', 1)
    addLuaSprite('shiftWall', false) 
    
    makeLuaSprite('shiftWallCode', 'stages/MANIFEST/1/Wall_error (Add)', -748, -503)
    setScrollFactor('shiftWallCode', 1, 1)
    scaleObject('shiftWallCode', 2.4, 2.4)
    setProperty('shiftWallCode.alpha', 1)
    setProperty('shiftWallCode.angle', 0)
    setBlendMode('shiftWallCode', 'add')
    addLuaSprite('shiftWallCode', false)

addHaxeLibrary('FlxTypedGroup', 'flixel.group')
createInstance('coderain', 'flixel.addons.display.FlxBackdrop', {nil, 0x10, 1})
    loadGraphic('coderain', 'stages/MANIFEST/1/coderain')
    callMethod('coderain.velocity.set', {0, 200})
    setProperty('coderain.x',-550)
    setProperty('coderain.y',200)
    scaleObject('coderain', 1.8, 1.8, false)
    setProperty('coderain.blend',0)
    addInstance('coderain')
 
    
    makeLuaSprite('shiftGround', 'stages/MANIFEST/1/Ground', -747, 668)
    setScrollFactor('shiftGround', 1, 1)
    scaleObject('shiftGround', 2.4, 2.4)
    setProperty('shiftGround.alpha', 1)
    setProperty('shiftGround.angle', 0)
    addLuaSprite('shiftGround', false) 
    
    makeLuaSprite('shiftGroundCode', 'stages/MANIFEST/1/Ground_Error (Add)', -750, 649)
    setScrollFactor('shiftGroundCode', 1, 1)
    scaleObject('shiftGroundCode', 2.4, 2.4)
    setProperty('shiftGroundCode.alpha', 1)
    setProperty('shiftGroundCode.angle', 0)
    setBlendMode('shiftGroundCode', 'add')
    addLuaSprite('shiftGroundCode', false) 
    
    makeLuaSprite('lighting', 'stages/MANIFEST/1/Lighting', -295, 632)
    setScrollFactor('lighting', 1, 1)
    scaleObject('lighting', 2.4, 2.4)
    setProperty('lighting.alpha', 1)
    setProperty('lighting.angle', 0)
    setBlendMode('lighting', 'add')
    addLuaSprite('lighting', true) 
    
    makeLuaSprite('crack1', 'stages/MANIFEST/1/Frame1Crack', 215, -298)
    setScrollFactor('crack1', 1, 1)
    scaleObject('crack1', 2, 2)
    setProperty('crack1.alpha', 1)
    setProperty('crack1.angle', 0)
    addLuaSprite('crack1', true) 
    
    makeLuaSprite('crack2', 'stages/MANIFEST/1/Frame2Crack', 55, -260)
    setScrollFactor('crack2', 1, 1)
    scaleObject('crack2', 2, 2)
    setProperty('crack2.alpha', 1)
    setProperty('crack2.angle', 0)
    addLuaSprite('crack2', true) 
    
    makeLuaSprite('spikes1', 'stages/MANIFEST/1/Frame1Spikes', -728, 902)
    setScrollFactor('spikes1', 1, 1)
    scaleObject('spikes1', 2, 2)
    setProperty('spikes1.alpha', 1)
    setProperty('spikes1.angle', 0)
    addLuaSprite('spikes1', false) 
    
    makeLuaSprite('spikes2', 'stages/MANIFEST/1/Frame2Spikes', -525, 901)
    setScrollFactor('spikes2', 1, 1)
    scaleObject('spikes2', 2, 2)
    setProperty('spikes2.alpha', 1)
    setProperty('spikes2.angle', 0)
    addLuaSprite('spikes2', false) 
    
    setProperty('spikes1.visible',false)
    setProperty('spikes2.visible',false)
   setProperty('crack2.visible',false)
   setProperty('crack1.visible',false)
    

    makeLuaSprite('redBG', 'stages/MANIFEST/2/Red Screen', -1037, -666)
    setScrollFactor('redBG', 0.4, 1)
    scaleObject('redBG', 3, 3)
    setProperty('redBG.alpha', 1)
    addLuaSprite('redBG', false)
    
    makeLuaSprite('crackedWall', 'stages/MANIFEST/2/CrackedWall', -1037, -666)
    setScrollFactor('crackedWall', 0.4, 1)
    scaleObject('crackedWall', 3, 3)
    setProperty('crackedWall.alpha', 1)
    addLuaSprite('crackedWall', false)
    
    makeLuaSprite('crackedWallCode', 'stages/MANIFEST/2/CrackedWall_error (Add)', -1044, -647)
    setScrollFactor('crackedWallCode', 0.4, 1)
    scaleObject('crackedWallCode', 3, 3)
    setProperty('crackedWallCode.alpha', 1)
    setBlendMode('crackedWallCode', 'add')
    addLuaSprite('crackedWallCode', false)
    
    makeLuaSprite('error1', 'stages/MANIFEST/2/Error_1', 1529, -200)
    setScrollFactor('error1', 0.6, 0.6)
    scaleObject('error1', 1.8, 1.8)
    setProperty('error1.alpha', 1)
    addLuaSprite('error1', false)
    
    makeLuaSprite('error2', 'stages/MANIFEST/2/Error_2', 1134, -100)
    setScrollFactor('error2', 0.9, 0.9)
    scaleObject('error2', 1.05, 1.05)
    setProperty('error2.alpha', 1)
    addLuaSprite('error2', false)
    
    makeLuaSprite('error3', 'stages/MANIFEST/2/Error_3', -444, -300)
    setScrollFactor('error3', 0.8, 0.8)
    scaleObject('error3', 1, 1)
    setProperty('error3.alpha', 1)
    addLuaSprite('error3', false)
    
    makeLuaSprite('bg spikes', 'stages/MANIFEST/2/Bg_spikes', -578, 0)
    setScrollFactor('bg spikes', 0.7, 1)
    scaleObject('bg spikes', 2.2, 2.2)
    setProperty('bg spikes.alpha', 1)
    addLuaSprite('bg spikes', false)
    
    makeLuaSprite('ground', 'stages/MANIFEST/2/Ground', -720, -200)
    setScrollFactor('ground', 1, 1)
    scaleObject('ground', 2.4, 2.4)
    setProperty('ground.alpha', 1)
    addLuaSprite('ground', false)
    
    makeLuaSprite('groundGlow', 'stages/MANIFEST/2/Glow (Add)', -100, 700)
    setScrollFactor('groundGlow', 1, 1)
    scaleObject('groundGlow', 2.4, 2.4)
    setProperty('groundGlow.alpha', 1)
    setBlendMode('groundGlow', 'add')
    addLuaSprite('groundGlow', true) -- delante del ground
    
    makeLuaSprite('atmosphere', 'stages/MANIFEST/2/Red_atomsphere (Screen)', -582, -11)
    setScrollFactor('atmosphere', 1, 1)
    scaleObject('atmosphere', 2.2, 2.2)
    setProperty('atmosphere.alpha', 1)
    setBlendMode('atmosphere', 'screen')
    addLuaSprite('atmosphere', true)
    
    makeLuaSprite('glowscreen', 'stages/MANIFEST/2/Glow (Screen)', -985, -749)
    setScrollFactor('glowscreen', 1, 1)
    scaleObject('glowscreen', 3, 3)
    setProperty('glowscreen.alpha', 1)
    setBlendMode('glowscreen', 'screen')
    addLuaSprite('glowscreen', true)
    
    table.insert(phase2Assets, 'glowscreen')
  table.insert(phase2Assets, 'bg spikes')
  table.insert(phase2Assets, 'atmosphere')
  table.insert(phase2Assets, 'ground')
  table.insert(phase2Assets, 'groundGlow')
  table.insert(phase2Assets, 'crackedWallCode')
  table.insert(phase2Assets, 'error1')
  table.insert(phase2Assets, 'error2')
  table.insert(phase2Assets, 'error3')
  table.insert(phase2Assets, 'redBG')
  table.insert(phase2Assets, 'crackedWall')
  
  
  table.insert(phase1Assets, 'shiftWall')
  table.insert(phase1Assets, 'shiftWallCode')
  table.insert(phase1Assets, 'coderain')
  table.insert(phase1Assets, 'shiftGround')
  table.insert(phase1Assets, 'shiftGroundCode')
  
  table.insert(phase1Assets, 'lighting')
  
 for _, i in pairs(phase2Assets) do
setProperty(i..'.visible', false)    
end
    
end


function onStepHit()
    if curStep == 1864 then
    cameraFlash('game', 'FFFFFF', 0.5, true) 
    cameraShake('game', 0.01, 0.3);
    
     for _, i in pairs(phase2Assets) do
setProperty(i..'.visible', true)

for _, i in pairs(phase1Assets) do
setProperty(i..'.visible', false)    
end

    
end


elseif curStep == 3350 then

doTweenAlpha('mySpriteTween', 'camGame', 0, 3, 'quadOut')
end
end

function onUpdate(elapsed)
stageTime = stageTime + elapsed

for i = 1, #errorSprites do
        local tag = errorSprites[i]
        local baseY = errorPositions[i] or 0
         local newY = math.cos(stageTime + i) * 60 + baseY + 100
        if getProperty(tag .. '.y') ~= nil then
            setProperty(tag .. '.y', newY)
        end
    end
    
 local fadeSpeed = 1.2 * elapsed

    for _, name in ipairs({'crackedWallCode','shiftWallCode', 'shiftGroundCode', 'lighting','coderain'}) do
        if luaSpriteExists(name) then
            local a = getProperty(name .. '.alpha')
            if a ~= 0 then
                a = a - fadeSpeed
                if a < 0 then a = 0 end
                setProperty(name .. '.alpha', a)
            end
        end
    end

    if coderain ~= nil then
        local a = getProperty(coderain .. '.alpha')
        if a ~= 0 then
            a = a - fadeSpeed
            if a < 0 then a = 0 end
            setProperty(coderain .. '.alpha', a)
        end
    end
end

function onBeatHit()
    if curBeat % 2 == 0 then
        
        for _, name in ipairs({'crackedWallCode','coderain','shiftWallCode', 'shiftGroundCode', 'lighting'}) do
            if luaSpriteExists(name) then
                setProperty(name .. '.alpha', 1)
            end
        end
    end
end

function luaSpriteExists(tag)
    return getProperty(tag .. '.width') ~= nil
end


function onEvent(name,v1,v2)
    if name == 'ManifestDestructionProgress' then
    if v1 == 'fase0' then
    setProperty('spikes1.visible',true)
    setProperty('crack1.visible',true)
    setProperty('spikes2.visible',false)
    setProperty('crack2.visible',false)
    
    end
    if v2 == 'fase1' then
    setProperty('spikes1.visible',false)
    setProperty('crack1.visible',false)
    setProperty('spikes2.visible',true)
    setProperty('crack2.visible',true)
    
    end
    end
    end