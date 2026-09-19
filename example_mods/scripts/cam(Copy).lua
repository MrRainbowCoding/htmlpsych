
local isRedux = true
local hudBuilt = false
local isMF = false

local reduxHealthBarBG = 'reduxHealthBarBG'
local reduxHealthBar   = 'reduxHealthBar'


local popupBackdrop    = 'popupBackdrop'
local ratingPopup      = 'ratingPopup'
local comboTxt         = 'comboTxt'
local timerBackdrop    = 'timerBackdrop'
local timeTxt          = 'timeTxt'

local function centerX(tag)
    local sw = getPropertyFromClass('flixel.FlxG', 'width')
    local w  = getProperty(tag .. '.width')
    setProperty(tag .. '.x', (sw - w) / 2)
end

local function padCombo(num)
    local s = tostring(num or 0)
    while #s < 3 do
        s = '0' .. s
    end
    return s
end

local function formatTimeSec(sec)
    sec = math.floor(math.max(sec, 0))
    local m = math.floor(sec / 60)
    local s = sec % 60
    if s < 10 then
        return m .. ':0' .. s
    end
    return m .. ':' .. s
end
function onCreate()
    precacheImage('ui/hud/normal/Healthbar')
    precacheImage('ui/hud/normal/RatingBackdrop')
    precacheImage('ui/hud/normal/sky_ratings')
    precacheImage('ui/hud/normal/TimerBackdrop')

    precacheImage('ui/hud/manifest/MF_Healthbar')
    precacheImage('ui/hud/manifest/MF_RatingsBackdrop')
    precacheImage('ui/hud/manifest/manifest_sky_ratings')
    precacheImage('ui/hud/manifest/MF_TimerBackdrop')
end

function onCreatePost()

if songName == 'Manifest' then
isMF = true
end
    
    
    local hbY = getProperty('healthBar.y')
    local texHealth = isMF and 'ui/hud/manifest/MF_Healthbar' or 'ui/hud/normal/Healthbar'

    
    local offsetBG = isMF and 70 or 100

local barY = 10
    local offsetBar = isMF and 30 or 60
    barY = barY + offsetBar


 local texBackdrop = isMF and 'ui/hud/manifest/MF_RatingsBackdrop' or 'ui/hud/normal/RatingBackdrop'
    makeLuaSprite(popupBackdrop, texBackdrop, 0, hbY - 70)
    setObjectCamera(popupBackdrop, 'hud')
    setProperty(popupBackdrop .. '.scale.x', 0.7)
    setProperty(popupBackdrop .. '.scale.y', 0.6)
    updateHitbox(popupBackdrop)

    local sw = getPropertyFromClass('flixel.FlxG', 'width')
    setProperty(popupBackdrop .. '.x', sw - getProperty(popupBackdrop .. '.width')+180)

    if getPropertyFromClass('flixel.FlxG', 'onMobile') then
        setProperty(popupBackdrop .. '.y', 610)
        
        if downscroll then
        setProperty(popupBackdrop .. '.y', 0)
        end
    end

    addLuaSprite(popupBackdrop, true)

    
    local texRatings = isMF and 'ui/hud/manifest/manifest_sky_ratings' or 'ui/hud/normal/sky_ratings'
    makeAnimatedLuaSprite(ratingPopup, texRatings,
        getProperty(popupBackdrop .. '.x') +85,
        getProperty(popupBackdrop .. '.y') + 5)
    setObjectCamera(ratingPopup, 'hud')
    addAnimationByPrefix(ratingPopup, 'killer', 'killer', 24, true)
    addAnimationByPrefix(ratingPopup, 'sweet', 'sweet', 24, true)
    addAnimationByPrefix(ratingPopup, 'lame',  'lame',  24, true)
    addAnimationByPrefix(ratingPopup, 'wtf',   'wtf',   24, true)
    scaleObject(ratingPopup, 0.45, 0.45)
    playAnim(ratingPopup, 'killer', true)
    addLuaSprite(ratingPopup, true)

local comboY = getProperty(ratingPopup .. '.y') + 65
    makeLuaText(comboTxt, '000', sw, 110, comboY)
    setObjectCamera(comboTxt, 'hud')
    setTextFont(comboTxt, 'sky.ttf')
    setTextSize(comboTxt, 40)
    setTextAlignment(comboTxt, 'right')
    local comboColor = isMF and 'CC0045' or '002EAF'
    setTextColor(comboTxt, comboColor)
    setTextBorder(comboTxt, 5, 'FFFFFF')
    addLuaText(comboTxt)

    
    hudBuilt = true
end




function goodNoteHit(id, noteData, noteType, isSustainNote)
    if not isRedux then return end

    local rating = getPropertyFromGroup('notes', id, 'rating') or 'sick'

    if rating == 'sick' then
        playAnim(ratingPopup, 'killer', true)
    elseif rating == 'good' then
        playAnim(ratingPopup, 'sweet', true)
    elseif rating == 'bad' then
        playAnim(ratingPopup, 'lame', true)
    elseif rating == 'shit' then
        playAnim(ratingPopup, 'wtf', true)
    end

    setProperty(ratingPopup .. '.scale.x', 0.5)
    setProperty(ratingPopup .. '.scale.y', 0.5)
end

function onUpdate(elapsed)
    if not isRedux then return end

    local sx = getProperty(ratingPopup .. '.scale.x')
    local sy = getProperty(ratingPopup .. '.scale.y')
    if sx > 0.45 then
        sx = sx - 0.5 * elapsed
        sy = sy - 0.5 * elapsed
        if sx < 0.45 then sx = 0.45 end
        if sy < 0.45 then sy = 0.45 end
        setProperty(ratingPopup .. '.scale.x', sx)
        setProperty(ratingPopup .. '.scale.y', sy)
    end

    
    local health = getProperty('health')
     local scaleBase = 0.5
    local factor = math.max(0, math.min(health / 2, 1))
    setProperty(reduxHealthBar .. '.scale.x', scaleBase * factor)
    updateHitbox(reduxHealthBar)

    if not getProperty('paused') then
        local songLength = getPropertyFromClass('Conductor', 'songLength') or 0
        local songPos = getPropertyFromClass('Conductor', 'songPosition') or 0

        local timeRemaining = songPos - songLength
        local timeRemainingInSecs = math.abs(timeRemaining / 1000)

        setTextString(timeTxt, formatTimeSec(timeRemainingInSecs))

         local comboValue = getProperty('combo') or 0
        setTextString(comboTxt, padCombo(comboValue))
    end
end

function onDestroy()
    hudBuilt = false
end