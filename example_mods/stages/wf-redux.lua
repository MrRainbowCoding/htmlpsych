function onCreate()
setProperty('camGame.bgColor', getColorFromHex('ffffff'))
setProperty('showComboNum', false);

makeLuaSprite('shiftback', 'stages/WF/shift', -1667, -1002)
    setScrollFactor('shiftback', 1, 1)
    scaleObject('shiftback', 3.6, 2)
    setProperty('shiftback.alpha', 1)
    addLuaSprite('shiftback', false)
    
    makeLuaSprite('shiftground', 'stages/WF/Ground', -1672, 358)
    setScrollFactor('shiftground', 1, 1)
    scaleObject('shiftground', 3.6, 2)
    setProperty('shiftground.alpha', 1)
    addLuaSprite('shiftground', false) 

    makeAnimatedLuaSprite('clouds', 'stages/WF/clouds_lineboil', -500, -200)
    addAnimationByPrefix('clouds', 'idle', 'clouds', 4, true)
    objectPlayAnimation('clouds', 'idle', true)
    setScrollFactor('clouds', 0.6, 1)
    scaleObject('clouds', 2, 2)
    setProperty('clouds.alpha', 0.7)
    addLuaSprite('clouds', false)

    makeAnimatedLuaSprite('bushes', 'stages/WF/bushes_lineboil', -513, 170)
    addAnimationByPrefix('bushes', 'idle', 'bushes', 4, true)
    objectPlayAnimation('bushes', 'idle', true)
    setScrollFactor('bushes', 0.8, 1)
    scaleObject('bushes', 2, 2)
    setProperty('bushes.alpha', 1)
    addLuaSprite('bushes', false) 
    
    makeAnimatedLuaSprite('tree', 'stages/WF/tree_lineboil', 40, -331)
    addAnimationByPrefix('tree', 'idle', 'tree', 4, true)
    objectPlayAnimation('tree', 'idle', true)
    setScrollFactor('tree', 1, 1)
    scaleObject('tree', 2, 2)
    setProperty('tree.alpha', 1)
    addLuaSprite('tree', false) 
    
    makeAnimatedLuaSprite('hill', 'stages/WF/wifeforever_lineboil', -510, 372)
    addAnimationByPrefix('hill', 'idle', 'hilltop', 4, true)
    objectPlayAnimation('hill', 'idle', true)
    setScrollFactor('hill', 1, 1)
    scaleObject('hill', 2, 2)
    setProperty('hill.alpha', 1)
    addLuaSprite('hill', false)
end

function onCreatePost()
    setProperty('clouds.velocity.x', 4)

    makeLuaSprite('flashSpr', nil, -1667, -1002)
    makeGraphic('flashSpr', 4000, 3000, 'FF0000')
    setObjectCamera('flashSpr', 'game')          
    setProperty('flashSpr.alpha', 0)              

    setObjectOrder('flashSpr', 99)                
    addLuaSprite('flashSpr', true)

end

function onUpdate(elapsed)
        local a = getProperty('flashSpr.alpha')
        a = a - (1 * elapsed)
        if a < 0 then a = 0 end
        setProperty('flashSpr.alpha', a)
    
end

function onBeatHit()
        if curBeat % 2 == 0 then
            setProperty('flashSpr.alpha', 0.2)
        
    end
end