function onCreate()

    -- Fondo normal
    makeLuaSprite('backTexture', 'stages/PICO/SKY/1/Background', -450, -286)
    scaleObject('backTexture', 3, 2)
    setScrollFactor('backTexture', 1, 1)
    addLuaSprite('backTexture', false)

    -- Back Building
    makeAnimatedLuaSprite('backBuilding', 'stages/PICO/SKY/1/Bg_Building', 1674, -293)
    addAnimationByPrefix('backBuilding', 'idle', 'Bg_Building', 4, true)
    objectPlayAnimation('backBuilding', 'idle', true)
    setScrollFactor('backBuilding', 1, 1)
    addLuaSprite('backBuilding', false)
   scaleObject('backBuilding', 2, 2);

    -- Left Side
    makeAnimatedLuaSprite('leftSide', 'stages/PICO/SKY/1/Left_Side', -500, -290)
    addAnimationByPrefix('leftSide', 'idle', 'Left_Side', 4, true)
    objectPlayAnimation('leftSide', 'idle', true)
    setScrollFactor('leftSide', 1, 1)
    addLuaSprite('leftSide', false)
       scaleObject('leftSide', 2, 2);


    -- Right Side
    makeAnimatedLuaSprite('rightSide', 'stages/PICO/SKY/1/Right_Side', 885, -291)
    addAnimationByPrefix('rightSide', 'idle', 'Right_Side', 4, true)
    objectPlayAnimation('rightSide', 'idle', true)
    setScrollFactor('rightSide', 1, 1)
    addLuaSprite('rightSide', false)
       scaleObject('rightSide', 2, 2);


    makeAnimatedLuaSprite('backBuildingMad', 'stages/PICO/SKY/2/Angry_Bg_Building', 1674, -293)
    addAnimationByPrefix('backBuildingMad', 'idle', 'Angry_BgBuilding', 4, true)
    objectPlayAnimation('backBuildingMad', 'idle', true)
    setScrollFactor('backBuildingMad', 1, 1)
    setProperty('backBuildingMad.alpha', 0)
    addLuaSprite('backBuildingMad', false)
       scaleObject('backBuildingMad', 2, 2);


    makeAnimatedLuaSprite('leftSideMad', 'stages/PICO/SKY/2/Angry_Left_side', -456, -290)
    addAnimationByPrefix('leftSideMad', 'idle', 'Angry_LeftSide', 4, true)
    objectPlayAnimation('leftSideMad', 'idle', true)
    setScrollFactor('leftSideMad', 1, 1)
    setProperty('leftSideMad.alpha', 0)
    addLuaSprite('leftSideMad', false)
       scaleObject('leftSideMad', 2, 2);


    makeAnimatedLuaSprite('rightSideMad', 'stages/PICO/SKY/2/Angry_Right_side', 885, -291)
    addAnimationByPrefix('rightSideMad', 'idle', 'Angry_RightSide', 4, true)
    objectPlayAnimation('rightSideMad', 'idle', true)
    setScrollFactor('rightSideMad', 1, 1)
    setProperty('rightSideMad.alpha', 0)
    addLuaSprite('rightSideMad', false)
       scaleObject('rightSideMad', 2, 2);


end

